import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from '../../api/materialApi';
import Spinner from '../../components/ui/Spinner';

export default function AdminMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchMaterials = () => {
    setLoading(true);
    getMaterials()
      .then((res) => setMaterials(res.data.data.materials))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMaterials(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      if (editingId) {
        const res = await updateMaterial(editingId, { name });
        setMaterials((prev) => prev.map((m) => (m._id === editingId ? res.data.data.material : m)));
      } else {
        const res = await createMaterial({ name });
        setMaterials((prev) => [...prev, res.data.data.material]);
      }
      setName('');
      setEditingId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save material');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (m) => {
    setName(m.name);
    setEditingId(m._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this material?')) return;
    try {
      await deleteMaterial(id);
      setMaterials((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete material');
    }
  };

  if (loading) return <Spinner className="mt-16" />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Materials</h2>

      <form onSubmit={handleSubmit} className="border rounded p-4 mb-6 max-w-lg flex gap-2">
        <input
          type="text"
          placeholder="Material name"
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
            {materials.map((m) => (
              <tr key={m._id} className="border-t">
                <td className="px-4 py-3 font-medium">{m.name}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{m.slug}</td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => handleEdit(m)} className="text-xs underline">Edit</button>
                  <button onClick={() => handleDelete(m._id)} className="text-red-500 text-xs underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
