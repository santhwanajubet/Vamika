import { useState, useEffect } from 'react';
import { getWorkTypes, createWorkType, updateWorkType, deleteWorkType } from '../../api/workTypeApi';
import Spinner from '../../components/ui/Spinner';

export default function AdminWorkTypes() {
  const [workTypes, setWorkTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchWorkTypes = () => {
    setLoading(true);
    getWorkTypes()
      .then((res) => setWorkTypes(res.data.data.workTypes))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchWorkTypes(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      if (editingId) {
        const res = await updateWorkType(editingId, { name });
        setWorkTypes((prev) => prev.map((w) => (w._id === editingId ? res.data.data.workType : w)));
      } else {
        const res = await createWorkType({ name });
        setWorkTypes((prev) => [...prev, res.data.data.workType]);
      }
      setName('');
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save work type');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (w) => {
    setName(w.name);
    setEditingId(w._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this work type?')) return;
    try {
      await deleteWorkType(id);
      setWorkTypes((prev) => prev.filter((w) => w._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete work type');
    }
  };

  if (loading) return <Spinner className="mt-16" />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Work Types</h2>

      <form onSubmit={handleSubmit} className="border rounded p-4 mb-6 max-w-lg flex gap-2">
        <input
          type="text"
          placeholder="Work type name"
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
            {workTypes.map((w) => (
              <tr key={w._id} className="border-t">
                <td className="px-4 py-3 font-medium">{w.name}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{w.slug}</td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => handleEdit(w)} className="text-xs underline">Edit</button>
                  <button onClick={() => handleDelete(w._id)} className="text-red-500 text-xs underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
