import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/axios';
import { createOrder, cancelOrder as cancelOrderApi } from '../../api/orderApi';
import { getAddresses, createAddress } from '../../api/addressApi';
import { validateCoupon } from '../../api/couponApi';
import { clearUserCart } from '../../features/cartSlice';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import FieldError from '../../components/ui/FieldError';
import { validateCheckout } from '../../utils/validate';

function loadScript(src) {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.cart);
  const [address, setAddress] = useState({
    fullName: '', phone: '', line1: '', city: '', state: '', zipCode: '', country: 'India',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddrId, setSelectedAddrId] = useState(null);
  const [saveAddress, setSaveAddress] = useState(false);

  useEffect(() => {
    loadScript('https://checkout.razorpay.com/v1/checkout.js');
    getAddresses().then((res) => {
      const addrs = res.data.data.addresses;
      setSavedAddresses(addrs);
      const def = addrs.find((a) => a.isDefault);
      if (def) {
        setAddress({ fullName: def.fullName, phone: def.phone, line1: def.line1, city: def.city, state: def.state, zipCode: def.zipCode, country: def.country || 'India' });
        setSelectedAddrId(def._id);
      }
    }).catch(() => {});
  }, []);

  const selectAddress = (a) => {
    setAddress({ fullName: a.fullName, phone: a.phone, line1: a.line1, city: a.city, state: a.state, zipCode: a.zipCode, country: a.country || 'India' });
    setSelectedAddrId(a._id);
    setErrors({});
  };

  const subtotal = items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);
  const shipping = subtotal >= 2500 ? 0 : 99;
  const total = subtotal + shipping - discount;

  const handleApplyCoupon = async () => {
    const code = couponCode.trim();
    if (!code) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await validateCoupon({ code, cartTotal: subtotal });
      setAppliedCoupon(res.data.data.coupon);
      setDiscount(res.data.data.discount);
      setCouponCode('');
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon');
      setAppliedCoupon(null);
      setDiscount(0);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validateCheckout(address);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    setError('');

    try {
      if (saveAddress && !selectedAddrId) {
        try {
          await createAddress({ ...address, label: 'Home', isDefault: savedAddresses.length === 0 });
        } catch {}
      }

      const { data: orderRes } = await createOrder({
        shippingAddress: address,
        paymentMethod: 'razorpay',
        couponCode: appliedCoupon?.code || undefined,
      });
      const order = orderRes.data.order;

      const { data: payRes } = await api.post('/payments/create-order', { orderId: order._id });
      const { razorpayOrderId, amount, currency, keyId } = payRes.data;

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        name: 'Vamika',
        description: `Order ${order.orderNumber}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            dispatch(clearUserCart());
            navigate(`/orders/${order._id}`);
          } catch {
            setError('Payment verification failed. Contact support.');
            setLoading(false);
          }
        },
        modal: { ondismiss: async () => {
          setLoading(false);
          try { await cancelOrderApi(order._id, { reason: 'Payment cancelled' }); } catch {}
        } },
        prefill: { name: address.fullName, contact: address.phone },
        theme: { color: '#000' },
      });

      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const inputClass = (field) => `w-full border rounded px-3 py-2 text-sm ${errors[field] ? 'border-red-500' : 'border-gray-300'}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8 md:gap-12">
      <div>
        <h1 className="text-2xl font-bold mb-6">Shipping Address</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          {savedAddresses.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Saved Addresses</p>
              <div className="space-y-2">
                {savedAddresses.map((a) => (
                  <label key={a._id} className={`flex items-start gap-3 border rounded p-3 text-sm cursor-pointer ${selectedAddrId === a._id ? 'border-black ring-1 ring-black' : 'border-gray-200 hover:border-gray-400'}`}>
                    <input type="radio" name="savedAddress" checked={selectedAddrId === a._id}
                      onChange={() => selectAddress(a)} className="mt-0.5 accent-black" />
                    <div>
                      <span className="font-medium">{a.label}</span>
                      {a.isDefault && <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded">Default</span>}
                      <p className="text-gray-600">{a.fullName}, {a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} {a.zipCode}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <span className="border-t flex-1"></span>
                <span>or enter manually</span>
                <span className="border-t flex-1"></span>
              </div>
            </div>
          )}

          <div>
            <input type="text" placeholder="Full Name" required className={inputClass('fullName')}
              value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
            <FieldError message={errors.fullName} />
          </div>
          <div>
            <input type="tel" placeholder="Phone (10 digits)" required className={inputClass('phone')}
              value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
            <FieldError message={errors.phone} />
          </div>
          <div>
            <input type="text" placeholder="Address Line 1" required className={inputClass('line1')}
              value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
            <FieldError message={errors.line1} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input type="text" placeholder="City" required className={inputClass('city')}
                value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              <FieldError message={errors.city} />
            </div>
            <div>
              <input type="text" placeholder="State" required className={inputClass('state')}
                value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
              <FieldError message={errors.state} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input type="text" placeholder="PIN Code (6 digits)" required className={inputClass('zipCode')}
                value={address.zipCode} onChange={(e) => setAddress({ ...address, zipCode: e.target.value.replace(/\D/g, '').slice(0, 6) })} />
              <FieldError message={errors.zipCode} />
            </div>
            <div>
              <input type="text" placeholder="Country" required className={inputClass('country')}
                value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
              <FieldError message={errors.country} />
            </div>
          </div>

          {!selectedAddrId && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="rounded accent-black" />
              Save this address for future orders
            </label>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Spinner size="sm" /> : `Pay ₹${total.toFixed(2)}`}
          </Button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">Order Summary</h2>
        <div className="space-y-2 text-sm">
          {items.map((i) => (
            <div key={i._id || i.variantSku} className="flex justify-between">
              <span>{i.product?.name || i.name} x{i.quantity}</span>
              <span>₹{((i.price || 0) * i.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2 space-y-1">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>

            {appliedCoupon ? (
              <div className="flex justify-between text-green-600">
                <span>Coupon ({appliedCoupon.code}) <button onClick={handleRemoveCoupon} className="text-red-500 text-xs underline">Remove</button></span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 pt-1">
                <input
                  className="flex-1 border rounded px-2 py-1 text-xs"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponCode.trim()}
                  className="text-xs bg-black text-white px-3 py-1 rounded disabled:opacity-50"
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </div>
            )}
            {couponError && <p className="text-red-600 text-xs">{couponError}</p>}

            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between font-bold text-base"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
