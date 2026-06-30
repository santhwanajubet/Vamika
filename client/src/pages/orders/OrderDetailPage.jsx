import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../../api/orderApi';
import Spinner from '../../components/ui/Spinner';

const STATUS_COLORS = {
  confirmed: 'bg-gray-100 text-gray-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-yellow-100 text-yellow-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(id)
      .then((res) => setOrder(res.data.data.order))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner className="mt-32" />;
  if (!order) return <p className="text-center mt-32">Order not found</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/orders" className="text-sm text-gray-500 hover:underline">&larr; My Orders</Link>
      <div className="flex justify-between items-start mt-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
          <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <span className={`text-sm px-3 py-1 rounded ${STATUS_COLORS[order.status]}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className="border rounded p-4 mb-6">
        <h2 className="font-semibold mb-3">Items</h2>
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm py-2 border-b last:border-0">
            <span>{item.name} x{item.quantity}</span>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t mt-2 pt-2 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{order.discount.toFixed(2)}</span></div>}
          <div className="flex justify-between"><span>Shipping</span><span>{order.shippingCost === 0 ? 'Free' : `₹${order.shippingCost.toFixed(2)}`}</span></div>
          <div className="flex justify-between font-bold text-base"><span>Total</span><span>₹{order.total.toFixed(2)}</span></div>
        </div>
      </div>

      <div className="border rounded p-4 mb-6">
        <h2 className="font-semibold mb-3">Shipping Address</h2>
        <p className="text-sm">{order.shippingAddress?.fullName}</p>
        <p className="text-sm">{order.shippingAddress?.line1}</p>
        <p className="text-sm">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
      </div>

      <div className="border rounded p-4">
        <h2 className="font-semibold mb-3">Timeline</h2>
        <div className="space-y-2">
          {order.statusHistory?.map((h, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[h.status]?.split(' ')[0] || 'bg-gray-300'}`} />
              <span className="capitalize">{h.status}</span>
              <span className="text-gray-400 text-xs">{new Date(h.timestamp).toLocaleString()}</span>
              {h.note && <span className="text-gray-500">— {h.note}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
