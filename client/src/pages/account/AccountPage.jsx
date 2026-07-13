import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../../features/authSlice';
import { getAddresses, createAddress, updateAddress, deleteAddress } from '../../api/addressApi';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import FieldError from '../../components/ui/FieldError';
import { validateAccount, validateAddress } from '../../utils/validate';

const emptyAddress = { label: 'Home', fullName: '', phone: '', line1: '', line2: '', city: '', state: '', zipCode: '', country: 'India', isDefault: false };

export default function AccountPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [addrForm, setAddrForm] = useState({ ...emptyAddress });
  const [addrErrors, setAddrErrors] = useState({});
  const [addrLoading, setAddrLoading] = useState(false);

  const loadAddresses = () => getAddresses().then((res) => setAddresses(res.data.data.addresses));

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '' });
      loadAddresses();
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fieldErrors = validateAccount(form);
    if (Object.keys(fieldErrors).length > 0) { setErrors(fieldErrors); return; }
    setErrors({});
    dispatch(updateUserProfile(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const openAddForm = () => {
    setEditingId(null);
    setAddrForm({ ...emptyAddress });
    setAddrErrors({});
    setShowForm(true);
  };

  const openEditForm = (a) => {
    setEditingId(a._id);
    setAddrForm({ label: a.label || 'Home', fullName: a.fullName, phone: a.phone, line1: a.line1, line2: a.line2 || '', city: a.city, state: a.state, zipCode: a.zipCode, country: a.country || 'India', isDefault: a.isDefault });
    setAddrErrors({});
    setShowForm(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const fe = validateAddress(addrForm);
    if (Object.keys(fe).length > 0) { setAddrErrors(fe); return; }
    setAddrErrors({});
    setAddrLoading(true);
    try {
      if (editingId) {
        const res = await updateAddress(editingId, addrForm);
        setAddresses((prev) => prev.map((a) => (a._id === editingId ? res.data.data.address : a)));
      } else {
        const res = await createAddress(addrForm);
        setAddresses((prev) => [...prev, res.data.data.address]);
      }
      setShowForm(false);
    } catch (err) {
      setAddrErrors({ submit: err.response?.data?.message || 'Failed to save address' });
    } finally {
      setAddrLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a._id !== id));
    } catch {}
  };

  const handleSetDefault = async (id) => {
    try {
      await updateAddress(id, { isDefault: true });
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a._id === id })));
    } catch {}
  };

  if (!user) return <Spinner className="mt-32" />;

  const inputClass = (field) => `w-full border rounded px-3 py-2 text-sm ${errors[field] ? 'border-red-500' : 'border-gray-300'}`;
  const addrInputClass = (field) => `w-full border rounded px-3 py-2 text-sm ${addrErrors[field] ? 'border-red-500' : 'border-gray-300'}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Account</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-12">
        <h2 className="font-semibold text-lg">Profile</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" value={user.email} disabled className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" className={inputClass('name')} value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <FieldError message={errors.name} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input type="tel" className={inputClass('phone')} value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
          <FieldError message={errors.phone} />
        </div>
        <Button type="submit">{saved ? 'Saved!' : 'Update Profile'}</Button>
      </form>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Saved Addresses</h2>
          {!showForm && (
            <button onClick={openAddForm} className="text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              + Add New
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSaveAddress} className="border rounded p-4 space-y-3 mb-6 bg-gray-50">
            <h3 className="font-medium text-sm">{editingId ? 'Edit Address' : 'New Address'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input type="text" placeholder="Label (e.g. Home, Work)" className={addrInputClass('label')}
                  value={addrForm.label} onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })} />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="isDefault" checked={addrForm.isDefault}
                  onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })} className="rounded" />
                <label htmlFor="isDefault" className="text-sm">Set as default</label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input type="text" placeholder="Full Name" required className={addrInputClass('fullName')}
                  value={addrForm.fullName} onChange={(e) => setAddrForm({ ...addrForm, fullName: e.target.value })} />
                <FieldError message={addrErrors.fullName} />
              </div>
              <div>
                <input type="tel" placeholder="Phone (10 digits)" required className={addrInputClass('phone')}
                  value={addrForm.phone} onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
                <FieldError message={addrErrors.phone} />
              </div>
            </div>
            <div>
              <input type="text" placeholder="Address Line 1" required className={addrInputClass('line1')}
                value={addrForm.line1} onChange={(e) => setAddrForm({ ...addrForm, line1: e.target.value })} />
              <FieldError message={addrErrors.line1} />
            </div>
            <div>
              <input type="text" placeholder="Address Line 2 (Optional)" className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={addrForm.line2} onChange={(e) => setAddrForm({ ...addrForm, line2: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input type="text" placeholder="City" required className={addrInputClass('city')}
                  value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} />
                <FieldError message={addrErrors.city} />
              </div>
              <div>
                <input type="text" placeholder="State" required className={addrInputClass('state')}
                  value={addrForm.state} onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })} />
                <FieldError message={addrErrors.state} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input type="text" placeholder="PIN Code (6 digits)" required className={addrInputClass('zipCode')}
                  value={addrForm.zipCode} onChange={(e) => setAddrForm({ ...addrForm, zipCode: e.target.value.replace(/\D/g, '').slice(0, 6) })} />
                <FieldError message={addrErrors.zipCode} />
              </div>
              <div>
                <input type="text" placeholder="Country" required className={addrInputClass('country')}
                  value={addrForm.country} onChange={(e) => setAddrForm({ ...addrForm, country: e.target.value })} />
              </div>
            </div>
            {addrErrors.submit && <p className="text-red-600 text-sm">{addrErrors.submit}</p>}
            <div className="flex gap-2">
              <Button type="submit" disabled={addrLoading}>
                {addrLoading ? <Spinner size="sm" /> : editingId ? 'Update Address' : 'Save Address'}
              </Button>
              <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-600 px-4 py-2 rounded border border-gray-300 hover:bg-gray-100">
                Cancel
              </button>
            </div>
          </form>
        )}

        {addresses.length === 0 && !showForm ? (
          <p className="text-sm text-gray-500">No addresses saved yet. Add one for faster checkout.</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((a) => (
              <div key={a._id} className={`border rounded p-4 text-sm ${a.isDefault ? 'border-black ring-1 ring-black' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{a.label}</span>
                      {a.isDefault && <span className="text-xs bg-black text-white px-2 py-0.5 rounded">Default</span>}
                    </div>
                    <p>{a.fullName}, {a.phone}</p>
                    <p>{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
                    <p>{a.city}, {a.state} {a.zipCode}</p>
                    <p className="text-gray-500">{a.country}</p>
                  </div>
                  <div className="flex flex-col gap-1 text-right shrink-0 ml-4">
                    {!a.isDefault && (
                      <button onClick={() => handleSetDefault(a._id)} className="text-xs text-blue-600 hover:underline">Set Default</button>
                    )}
                    <button onClick={() => openEditForm(a)} className="text-xs text-gray-600 hover:underline">Edit</button>
                    <button onClick={() => handleDeleteAddress(a._id)} className="text-xs text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
