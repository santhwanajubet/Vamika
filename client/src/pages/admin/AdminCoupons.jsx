import { useState, useEffect } from 'react';
import { getAllCoupons, createCoupon, deleteCoupon } from '../../api/couponApi';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import FieldError from '../../components/ui/FieldError';
import { validateCoupon } from '../../utils/validate';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: '', type: 'percentage', value: '', minCartValue: 0, validFrom: '', validUntil: '' });
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchCoupons = () => {
    setLoading(true);
    getAllCoupons()
      .then((res) => setCoupons(res.data.data.coupons))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const fieldErrors = validateCoupon(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    await createCoupon({ ...form, value: Number(form.value), minCartValue: Number(form.minCartValue) });
    setShowForm(false);
    setForm({ code: '', type: 'percentage', value: '', minCartValue: 0, validFrom: '', validUntil: '' });
    fetchCoupons();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    await deleteCoupon(id);
    fetchCoupons();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Coupons</h2>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'New Coupon'}</Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="border rounded p-4 mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <input className={`border rounded px-3 py-2 text-sm ${errors.code ? 'border-red-500' : ''}`} placeholder="Code" value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })} required />
            <FieldError message={errors.code} />
          </div>
          <select className="border rounded px-3 py-2 text-sm" value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
          <div>
            <input className={`border rounded px-3 py-2 text-sm ${errors.value ? 'border-red-500' : ''}`} placeholder="Value" type="number" value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })} required />
            <FieldError message={errors.value} />
          </div>
          <input className="border rounded px-3 py-2 text-sm" placeholder="Min Cart Value" type="number" value={form.minCartValue}
            onChange={(e) => setForm({ ...form, minCartValue: e.target.value })} />
          <input className="border rounded px-3 py-2 text-sm" type="date" value={form.validFrom}
            onChange={(e) => setForm({ ...form, validFrom: e.target.value })} required />
          <div>
            <input className={`border rounded px-3 py-2 text-sm ${errors.validUntil ? 'border-red-500' : ''}`} type="date" value={form.validUntil}
              onChange={(e) => setForm({ ...form, validUntil: e.target.value })} required />
            <FieldError message={errors.validUntil} />
          </div>
          <Button type="submit">Create</Button>
        </form>
      )}

      {loading ? (
        <Spinner />
      ) : (
        <div className="border rounded overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Uses</th>
                <th className="px-4 py-3">Expires</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td className="px-4 py-3 font-mono">{c.code}</td>
                  <td className="px-4 py-3 capitalize">{c.type}</td>
                  <td className="px-4 py-3">{c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}</td>
                  <td className="px-4 py-3">{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</td>
                  <td className="px-4 py-3 text-xs">{new Date(c.validUntil).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Button variant="danger" size="sm" onClick={() => handleDelete(c._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
