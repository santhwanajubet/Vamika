import { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categoryApi';
import Spinner from '../../components/ui/Spinner';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    getCategories()
      .then((res) => setCategories(res.data.data.categories))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      if (editingId) {
        const res = await updateCategory(editingId, form);
        setCategories((prev) => prev.map((c) => (c._id === editingId ? res.data.data.category : c)));
      } else {
        const res = await createCategory(form);
        setCategories((prev) => [...prev, res.data.data.category]);
      }
      setForm({ name: '', description: '' });
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || '' });
    setEditingId(cat._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleCancel = () => {
    setForm({ name: '', description: '' });
    setEditingId(null);
  };

  if (loading) return <Spinner className="mt-16" />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Categories</h2>

      <form onSubmit={handleSubmit} className="border rounded p-4 mb-6 max-w-lg space-y-3">
        <h3 className="font-semibold text-sm">{editingId ? 'Edit Category' : 'New Category'}</h3>
        <input
          type="text"
          placeholder="Category name"
          required
          className="w-full border rounded px-3 py-2 text-sm"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          className="w-full border rounded px-3 py-2 text-sm"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="flex gap-2">
          <button type="submit" disabled={submitting} className="bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-50">
            {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="border px-4 py-2 rounded text-sm">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{c.slug}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{c.description || '—'}</td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => handleEdit(c)} className="text-xs underline">Edit</button>
                  <button onClick={() => handleDelete(c._id)} className="text-red-500 text-xs underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
