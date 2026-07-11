import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getFeatured, getNewArrivals } from '../../api/productApi';
import { getWishlist, addToWishlist, removeFromWishlist } from '../../api/wishlistApi';
import Spinner from '../../components/ui/Spinner';
import WishlistButton from '../../components/ui/WishlistButton';

export default function HomePage() {
  const { user } = useSelector((s) => s.auth);
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState(new Set());

  useEffect(() => {
    Promise.all([getFeatured(), getNewArrivals()])
      .then(([f, n]) => {
        setFeatured(f.data.data.products);
        setNewArrivals(n.data.data.products);
        if (user) return getWishlist();
      })
      .then((res) => {
        if (res) {
          const ids = res.data.data.wishlist?.products?.map((p) => p._id) || [];
          setWishlistIds(new Set(ids));
        }
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleToggleWishlist = async (productId) => {
    if (!user) return;
    const newSet = new Set(wishlistIds);
    const wasWishlisted = newSet.has(productId);
    if (wasWishlisted) newSet.delete(productId);
    else newSet.add(productId);
    setWishlistIds(newSet);
    try {
      if (wasWishlisted) await removeFromWishlist(productId);
      else await addToWishlist(productId);
    } catch {
      const revert = new Set(wishlistIds);
      if (wasWishlisted) revert.add(productId);
      else revert.delete(productId);
      setWishlistIds(revert);
    }
  };

  if (loading) return <Spinner className="mt-32" />;

  return (
    <div>
      <section className="bg-red-50 py-16 sm:py-24 text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Timeless Sarees</h1>
        <p className="text-gray-600 mb-8 text-sm sm:text-base">Discover traditional & designer sarees for every occasion</p>
        <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
          <Link to="/shop" className="inline-block bg-black text-white px-6 sm:px-8 py-3 rounded text-sm font-medium hover:bg-gray-800">
            Shop Now
          </Link>
          {!user && (
            <Link to="/auth/register" className="inline-block border border-black text-black px-6 sm:px-8 py-3 rounded text-sm font-medium hover:bg-gray-50">
              Sign Up Free
            </Link>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Featured</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map((p) => (
            <ProductCard key={p._id} product={p} wishlisted={wishlistIds.has(p._id)} onToggleWishlist={handleToggleWishlist} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">New Arrivals</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {newArrivals.map((p) => (
            <ProductCard key={p._id} product={p} wishlisted={wishlistIds.has(p._id)} onToggleWishlist={handleToggleWishlist} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product, wishlisted, onToggleWishlist }) {
  return (
    <Link to={`/product/${product.slug}`} className="group relative">
      <div className="aspect-[3/4] bg-gray-100 rounded overflow-hidden mb-3">
        {product.images[0] && (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        )}
        <WishlistButton productId={product._id} wishlisted={wishlisted} onToggle={() => onToggleWishlist(product._id)} />
      </div>
      <h3 className="font-medium text-sm">{product.name}</h3>
      <p className="text-sm text-gray-500">
        {product.offerPrice && (
          <span className="line-through mr-2">₹{product.price}</span>
        )}
        ₹{product.offerPrice || product.price}
      </p>
    </Link>
  );
}
