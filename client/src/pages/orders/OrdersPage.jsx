import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../api/orderApi';
import Spinner from '../../components/ui/Spinner';

const STATUS_COLORS = {
  confirmed: 'bg-gray-100 text-gray-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-yellow-100 text-yellow-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data.data.orders))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="mt-32" />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link key={o._id} to={`/orders/${o._id}`} className="block border rounded p-4 hover:border-gray-400 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{o.orderNumber}</p>
                  <p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500 mt-1">{o.items.length} item(s)</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{o.total.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[o.status] || ''}`}>
                    {o.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
