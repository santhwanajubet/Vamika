import { useState, useEffect } from 'react';
import { getOccasions, createOccasion, updateOccasion, deleteOccasion } from '../../api/occasionApi';
import Spinner from '../../components/ui/Spinner';

export default function AdminOccasions() {
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchOccasions = () => {
    setLoading(true);
    getOccasions()
      .then((res) => setOccasions(res.data.data.occasions))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOccasions(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      if (editingId) {
        const res = await updateOccasion(editingId, { name });
        setOccasions((prev) => prev.map((o) => (o._id === editingId ? res.data.data.occasion : o)));
      } else {
        const res = await createOccasion({ name });
        setOccasions((prev) => [...prev, res.data.data.occasion]);
      }
      setName('');
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save occasion');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (o) => {
    setName(o.name);
    setEditingId(o._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this occasion?')) return;
    try {
      await deleteOccasion(id);
      setOccasions((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete occasion');
    }
  };

  if (loading) return <Spinner className="mt-16" />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Occasions</h2>

      <form onSubmit={handleSubmit} className="border rounded p-4 mb-6 max-w-lg flex gap-2">
        <input
          type="text"
          placeholder="Occasion name"
          required
          className="flex-1 border rounded px-3 py-2 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" disabled={submitting} className="bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-50">
          {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setName(''); setEditingId(null); }} className="border px-4 py-2 rounded text-sm">
            Cancel
          </button>
        )}
      </form>

      <div className="border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {occasions.map((o) => (
              <tr key={o._id} className="border-t">
                <td className="px-4 py-3 font-medium">{o.name}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{o.slug}</td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => handleEdit(o)} className="text-xs underline">Edit</button>
                  <button onClick={() => handleDelete(o._id)} className="text-red-500 text-xs underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
