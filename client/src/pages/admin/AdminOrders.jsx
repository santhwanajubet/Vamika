import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api/orderApi';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

const STATUSES = ['confirmed', 'processing', 'shipped', 'delivered'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    getAllOrders({ limit: 50 })
      .then((res) => setOrders(res.data.data.orders))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatus = async (id, status) => {
    await updateOrderStatus(id, { status });
    fetchOrders();
  };

  return (
    <div className="flex-1 px-4">
      <h2 className="text-2xl font-bold mb-6">Orders</h2>
      {loading ? (
        <Spinner />
      ) : (
        <div className="border rounded overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3">Order #</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((o) => {
                const nextIdx = STATUSES.indexOf(o.status) + 1;
                const next = STATUSES[nextIdx];
                return (
                  <tr key={o._id}>
                    <td className="px-4 py-3 font-mono text-xs">{o.orderNumber}</td>
                    <td className="px-4 py-3">{o.user?.name || 'N/A'}</td>
                    <td className="px-4 py-3">₹{o.total.toFixed(2)}</td>
                    <td className="px-4 py-3 capitalize">{o.status}</td>
                    <td className="px-4 py-3 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {next && (
                        <Button size="sm" onClick={() => handleStatus(o._id, next)}>
                          Mark {next}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
