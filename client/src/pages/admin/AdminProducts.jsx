import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct, bulkDeleteProducts } from '../../api/productApi';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());

  const fetchProducts = () => {
    setLoading(true);
    getProducts({ limit: 50 })
      .then((res) => setProducts(res.data.data.products))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Archive this product?')) return;
    await deleteProduct(id);
    fetchProducts();
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === products.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(products.map((p) => p._id)));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Archive ${selected.size} products?`)) return;
    await bulkDeleteProducts([...selected]);
    setSelected(new Set());
    fetchProducts();
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Products</h2>
          {products.length > 0 && (
            <button onClick={toggleSelectAll} className="text-sm text-gray-500 underline hover:text-black">
              {selected.size === products.length ? 'Deselect All' : 'Select All'}
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {selected.size > 0 && (
            <Button variant="danger" onClick={handleBulkDelete}>
              Archive Selected ({selected.size})
            </Button>
          )}
          <Link to="/admin/products/new">
            <Button>+ New Product</Button>
          </Link>
        </div>
      </div>
      <div className="border rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium w-10">
                <input
                  type="checkbox"
                  checked={selected.size === products.length && products.length > 0}
                  onChange={toggleSelectAll}
                  className="cursor-pointer"
                />
              </th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Sold</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p._id} className={selected.has(p._id) ? 'bg-gray-50' : ''}>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(p._id)}
                    onChange={() => toggleSelect(p._id)}
                    className="cursor-pointer"
                  />
                </td>
                <td className="px-4 py-3">
                  <Link to={`/admin/products/${p._id}`} className="hover:underline">
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-3">₹{p.price}</td>
                <td className="px-4 py-3">{p.totalStock}</td>
                <td className="px-4 py-3">{p.soldCount}</td>
                <td className="px-4 py-3 space-x-2">
                  <Link to={`/admin/products/${p._id}`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(p._id)}>
                    Archive
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
