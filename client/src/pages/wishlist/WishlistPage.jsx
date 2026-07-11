import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist, addToWishlist, removeFromWishlist } from '../../api/wishlistApi';
import Spinner from '../../components/ui/Spinner';

export default function WishlistPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWishlist()
      .then((res) => setProducts(res.data.data.wishlist?.products || []))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
    setProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  if (loading) return <Spinner className="mt-32" />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Wishlist</h1>
      {products.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p._id}>
              <Link to={`/product/${p.slug}`}>
                <div className="aspect-[3/4] bg-gray-100 rounded overflow-hidden mb-2">
                  {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                </div>
              </Link>
              <h3 className="font-medium text-sm">{p.name}</h3>
              <p className="text-sm text-gray-500">
                {p.offerPrice && <span className="line-through mr-2">₹{p.price}</span>}
                ₹{p.offerPrice || p.price}
              </p>
              <button onClick={() => handleRemove(p._id)} className="text-xs text-red-500 mt-1 hover:underline">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
