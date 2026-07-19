import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getProduct, getRelated } from '../../api/productApi';
import { getProductReviews, createReview } from '../../api/reviewApi';
import { getWishlist, addToWishlist, removeFromWishlist } from '../../api/wishlistApi';
import { addItem } from '../../features/cartSlice';
import { addGuestItem } from '../../features/cartSlice';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import WishlistButton from '../../components/ui/WishlistButton';

function Stars({ rating, interactive, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => onChange(star) : undefined}
          className={`text-lg ${interactive ? 'cursor-pointer' : 'cursor-default'} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [form, setForm] = useState({ rating: 0, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    setLoading(true);
    let productId;
    getProduct(slug)
      .then((res) => {
        const p = res.data.data.product;
        productId = p._id;
        setProduct(p);
        if (p.variants.length > 0) {
          setSelectedColor(p.variants[0].color);
          setSelectedSize(p.variants[0].size);
        }
        return Promise.all([getRelated(p._id), getProductReviews(p._id)]);
      })
      .then(([relatedRes, reviewsRes]) => {
        setRelated(relatedRes.data.data.products);
        setReviews(reviewsRes.data.data.reviews);
        if (user) {
          return getWishlist();
        }
      })
      .then((wishlistRes) => {
        if (wishlistRes) {
          const ids = wishlistRes.data.data.wishlist?.products?.map((p) => p._id) || [];
          const idSet = new Set(ids);
          setWishlistIds(idSet);
          setWishlisted(idSet.has(productId));
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (user && product) {
      setUserHasReviewed(reviews.some((r) => r.user?._id === user._id));
    }
  }, [user, product, reviews]);

  const currentVariant = product?.variants?.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const displayImages = currentVariant?.images?.length
    ? currentVariant.images
    : product?.images || [];

  useEffect(() => { setAddedToCart(false); }, [selectedSize, selectedColor]);
  useEffect(() => { setActiveImage(0); }, [selectedColor]);

  const colors = [...new Set(product?.variants?.map((v) => v.color) || [])];
  const sizes = [...new Set(product?.variants?.map((v) => v.size) || [])];

  const handleAddToCart = () => {
    if (!currentVariant) return;
    if (user) {
      dispatch(addItem({ productId: product._id, variantSku: currentVariant.sku, quantity: qty, price: product.offerPrice || product.price, name: product.name, image: product.images[0] || '' }));
    } else {
      dispatch(addGuestItem({
        productId: product._id,
        variantSku: currentVariant.sku,
        quantity: qty,
        price: product.offerPrice || product.price,
        name: product.name,
        image: product.images[0] || '',
      }));
    }
    setAddedToCart(true);
  };

  const handleToggleWishlist = async (id) => {
    if (!user) return;
    const newSet = new Set(wishlistIds);
    const wasWishlisted = newSet.has(id);
    if (wasWishlisted) newSet.delete(id);
    else newSet.add(id);
    setWishlistIds(newSet);
    if (id === product._id) setWishlisted(newSet.has(id));
    try {
      if (wasWishlisted) await removeFromWishlist(id);
      else await addToWishlist(id);
    } catch {
      const revert = new Set(wishlistIds);
      if (wasWishlisted) revert.add(id);
      else revert.delete(id);
      setWishlistIds(revert);
      if (id === product._id) setWishlisted(revert.has(id));
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!form.rating) return;
    setSubmitting(true);
    try {
      const res = await createReview(product._id, form);
      setReviews((prev) => [res.data.data.review, ...prev]);
      setForm({ rating: 0, title: '', comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner className="mt-32" />;
  if (!product) return <p className="text-center mt-32">Product not found</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="relative aspect-[3/4] bg-gray-100 rounded overflow-hidden mb-3">
            {displayImages[activeImage] && (
              <img src={displayImages[activeImage]} alt={product.name} className="w-full h-full object-cover" />
            )}
            <WishlistButton productId={product._id} wishlisted={wishlisted} onToggle={() => handleToggleWishlist(product._id)} />
          </div>
          {displayImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {displayImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 shrink-0 rounded border-2 overflow-hidden ${activeImage === i ? 'border-black' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-semibold mb-4">
            {product.offerPrice && (
              <span className="line-through text-gray-400 text-lg mr-2">₹{product.price}</span>
            )}
            ₹{product.offerPrice || product.price}
          </p>

          <div className="mb-4">
            <p className="text-sm font-medium mb-1">Color</p>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`px-3 py-1 text-sm border rounded ${selectedColor === c ? 'border-black bg-black text-white' : 'border-gray-300'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium mb-1">Size</p>
            <div className="flex gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-3 py-1 text-sm border rounded ${selectedSize === s ? 'border-black bg-black text-white' : 'border-gray-300'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium mb-1">Quantity</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="border px-2 py-1 rounded">-</button>
              <span className="w-8 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} disabled={qty >= (currentVariant?.stock || 0)} className="border px-2 py-1 rounded disabled:opacity-40">+</button>
            </div>
          </div>

          <Button onClick={handleAddToCart} disabled={!currentVariant || currentVariant.stock === 0 || addedToCart} className="w-full mb-2">
            {currentVariant?.stock === 0 ? 'Out of Stock' : addedToCart ? 'In Cart ✓' : 'Add to Cart'}
          </Button>

          <p className="text-xs text-gray-500">
            {currentVariant ? (currentVariant.stock > 0 && currentVariant.stock < 5 ? `${currentVariant.stock} in stock` : currentVariant.stock === 0 ? 'Out of stock' : '') : 'Select size and color'}
          </p>

          <p className="mt-6 text-sm text-gray-700 leading-relaxed">{product.description}</p>

          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-semibold mb-3">Product Details</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {product.material && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Material</span>
                  <span className="font-medium">{product.material}</span>
                </div>
              )}
              {product.workType && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Work Type</span>
                  <span className="font-medium">{product.workType}</span>
                </div>
              )}
              {product.occasion && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Occasion</span>
                  <span className="font-medium">{product.occasion}</span>
                </div>
              )}
              {product.length && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Length</span>
                  <span className="font-medium">{product.length}</span>
                </div>
              )}
              {product.category?.name && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium">{product.category.name}</span>
                </div>
              )}
              {product.tags?.length > 0 && (
                <div className="col-span-2 flex justify-between">
                  <span className="text-gray-500">Tags</span>
                  <span className="font-medium">{product.tags.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="mt-16 border-t pt-8">
        <h2 className="text-xl font-bold mb-6">Customer Reviews</h2>

        {reviews.length === 0 && <p className="text-sm text-gray-500 mb-6">No reviews yet.</p>}

        <div className="space-y-4 mb-8">
          {reviews.map((r) => (
            <div key={r._id} className="border rounded p-4">
              <div className="flex items-center gap-3 mb-1">
                <Stars rating={r.rating} />
                <span className="text-sm font-medium">{r.user?.name || 'Anonymous'}</span>
                <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              {r.title && <p className="text-sm font-medium">{r.title}</p>}
              {r.comment && <p className="text-sm text-gray-600 mt-1">{r.comment}</p>}
            </div>
          ))}
        </div>

        {user ? (
          userHasReviewed ? (
            <p className="text-sm text-gray-500">You have already reviewed this product.</p>
          ) : (
            <form onSubmit={handleSubmitReview} className="border rounded p-4 max-w-lg">
              <h3 className="text-sm font-semibold mb-3">Write a Review</h3>
              <div className="mb-3">
                <label className="block text-xs font-medium mb-1">Rating</label>
                <Stars rating={form.rating} interactive onChange={(val) => setForm((f) => ({ ...f, rating: val }))} />
              </div>
              <div className="mb-3">
                <label className="block text-xs font-medium mb-1">Title</label>
                <input
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Great saree!"
                />
              </div>
              <div className="mb-3">
                <label className="block text-xs font-medium mb-1">Comment</label>
                <textarea
                  className="w-full border rounded px-3 py-2 text-sm"
                  rows={3}
                  value={form.comment}
                  onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                  placeholder="Share your experience..."
                />
              </div>
              <Button type="submit" disabled={submitting || !form.rating}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          )
        ) : (
          <p className="text-sm text-gray-500">
            <Link to="/auth/login" className="underline">Sign in</Link> to leave a review.
          </p>
        )}
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <Link key={p._id} to={`/product/${p.slug}`} className="group relative">
                <div className="aspect-[3/4] bg-gray-100 rounded overflow-hidden mb-2">
                  {(p.images[0] || p.variants?.[0]?.images?.[0]) && (
                    <img src={p.images[0] || p.variants?.[0]?.images?.[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  )}
                  <WishlistButton productId={p._id} wishlisted={wishlistIds.has(p._id)} onToggle={() => handleToggleWishlist(p._id)} />
                </div>
                <h3 className="font-medium text-sm">{p.name}</h3>
                <p className="text-sm text-gray-500">
                  {p.offerPrice && <span className="line-through mr-2">₹{p.price}</span>}
                  ₹{p.offerPrice || p.price}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
