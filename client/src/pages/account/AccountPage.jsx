import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../../features/authSlice';
import { getAddresses } from '../../api/addressApi';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

export default function AccountPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [addresses, setAddresses] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '' });
      getAddresses().then((res) => setAddresses(res.data.data.addresses));
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!user) return <Spinner className="mt-32" />;

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
          <input type="text" className="w-full border rounded px-3 py-2 text-sm" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input type="text" className="w-full border rounded px-3 py-2 text-sm" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <Button type="submit">{saved ? 'Saved!' : 'Update Profile'}</Button>
      </form>

      <div>
        <h2 className="font-semibold text-lg mb-4">Saved Addresses</h2>
        {addresses.length === 0 ? (
          <p className="text-sm text-gray-500">No addresses saved.</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((a) => (
              <div key={a._id} className="border rounded p-3 text-sm">
                <p className="font-medium">{a.label}</p>
                <p>{a.fullName}, {a.phone}</p>
                <p>{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
                <p>{a.city}, {a.state} {a.zipCode}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
