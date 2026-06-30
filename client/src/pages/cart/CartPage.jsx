import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateItem, removeItem } from '../../features/cartSlice';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (user) dispatch(fetchCart());
  }, [dispatch, user]);

  const subtotal = items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);

  if (loading) return <Spinner className="mt-32" />;

  if (items.length === 0) {
    return (
      <div className="text-center mt-32">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <Link to="/shop" className="text-sm underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item._id || item.variantSku} className="flex gap-4 border-b pb-4">
            <div className="w-20 h-20 bg-gray-100 rounded shrink-0">
              {item.product?.images?.[0] && (
                <img src={item.product.images[0]} alt={item.name} className="w-full h-full object-cover rounded" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{item.product?.name || item.name}</p>
              <p className="text-xs text-gray-500">{item.variantSku}</p>
              <p className="text-sm font-semibold mt-1">₹{item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <button
                    onClick={() => dispatch(updateItem({ itemId: item._id, quantity: item.quantity - 1 }))}
                    className="border px-2 py-1 rounded text-sm"
                    disabled={item.quantity <= 1}
                  >-</button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(updateItem({ itemId: item._id, quantity: item.quantity + 1 }))}
                    className="border px-2 py-1 rounded text-sm"
                  >+</button>
                  <button onClick={() => dispatch(removeItem(item._id))} className="text-red-500 text-sm ml-2">
                    Remove
                  </button>
                </>
              ) : (
                <span className="text-sm">x{item.quantity}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-right">
        <p className="text-xl font-bold">Subtotal: ₹{subtotal.toFixed(2)}</p>
        <Link to="/checkout">
          <Button className="mt-4">Proceed to Checkout</Button>
        </Link>
      </div>
    </div>
  );
}
