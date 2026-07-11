import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getProducts } from '../../api/productApi';
import { getCategories } from '../../api/categoryApi';
import { getWishlist, addToWishlist, removeFromWishlist } from '../../api/wishlistApi';
import Spinner from '../../components/ui/Spinner';
import WishlistButton from '../../components/ui/WishlistButton';

export default function ShopPage() {
  const { user } = useSelector((s) => s.auth);
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState(new Set());

  const fetchProducts = () => {
    setLoading(true);
    getProducts(Object.fromEntries(params))
      .then((res) => {
        setProducts(res.data.data.products);
        setPagination(res.data.data.pagination);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [params]);
  useEffect(() => {
    getCategories().then((res) => setCategories(res.data.data.categories));
    if (user) {
      getWishlist().then((res) => {
        const ids = res.data.data.wishlist?.products?.map((p) => p._id) || [];
        setWishlistIds(new Set(ids));
      });
    }
  }, [user]);

  const handleToggleWishlist = async (productId) => {
    if (!user) return;
    const newSet = new Set(wishlistIds);
    if (newSet.has(productId)) {
      await removeFromWishlist(productId);
      newSet.delete(productId);
    } else {
      await addToWishlist(productId);
      newSet.add(productId);
    }
    setWishlistIds(newSet);
  };

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set('page', '1');
    setParams(next);
  };

  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
      <aside className={`w-64 shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2 text-sm">
          <button onClick={() => setParams(new URLSearchParams())} className="block hover:underline">
            All
          </button>
          {categories.map((c) => (
            <button key={c._id} onClick={() => updateParam('category', c._id)} className="block hover:underline">
              {c.name}
            </button>
          ))}
        </div>

        <h3 className="font-semibold mt-6 mb-3">Price</h3>
        <div className="flex gap-2 text-sm">
          <input
            type="number"
            placeholder="Min"
            className="w-full border rounded px-2 py-1"
            value={params.get('minPrice') || ''}
            onChange={(e) => updateParam('minPrice', e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            className="w-full border rounded px-2 py-1"
            value={params.get('maxPrice') || ''}
            onChange={(e) => updateParam('maxPrice', e.target.value)}
          />
        </div>

        <h3 className="font-semibold mt-6 mb-3">Material</h3>
        <div className="space-y-2 text-sm">
          {['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Linen', 'Velvet'].map((m) => (
            <label key={m} className="flex items-center gap-2">
              <input
                type="radio"
                name="material"
                checked={params.get('material') === m.toLowerCase()}
                onChange={() => updateParam('material', params.get('material') === m.toLowerCase() ? '' : m.toLowerCase())}
              />
              {m}
            </label>
          ))}
        </div>

        <h3 className="font-semibold mt-6 mb-3">Occasion</h3>
        <div className="flex flex-wrap gap-2 text-sm">
          {['Wedding', 'Festive', 'Casual', 'Party', 'Daily Wear'].map((o) => (
            <button
              key={o}
              onClick={() => updateParam('occasion', params.get('occasion') === o.toLowerCase() ? '' : o.toLowerCase())}
              className={`px-2 py-1 rounded border ${params.get('occasion') === o.toLowerCase() ? 'bg-black text-white' : ''}`}
            >
              {o}
            </button>
          ))}
        </div>

        <h3 className="font-semibold mt-6 mb-3">Sort</h3>
        <select
          className="w-full border rounded px-2 py-1 text-sm"
          value={params.get('sort') || 'newest'}
          onChange={(e) => updateParam('sort', e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Best Rated</option>
        </select>
      </aside>

      {showFilters && (
        <div className="fixed inset-0 bg-black/30 z-10 md:hidden" onClick={() => setShowFilters(false)} />
      )}

      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Shop</h1>
          <button onClick={() => setShowFilters(!showFilters)} className="md:hidden text-sm border rounded px-3 py-1">
            Filters
          </button>
        </div>
        {loading ? (
          <Spinner className="mt-16" />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <Link key={p._id} to={`/product/${p.slug}`} className="group relative">
                  <div className="aspect-[3/4] bg-gray-100 rounded overflow-hidden mb-2">
                    {p.images[0] && (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    )}
                    <WishlistButton productId={p._id} wishlisted={wishlistIds.has(p._id)} onToggle={() => handleToggleWishlist(p._id)} />
                  </div>
                  <h3 className="font-medium text-sm">{p.name}</h3>
                  <p className="text-sm text-gray-500">₹{p.price}</p>
                </Link>
              ))}
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: pagination.pages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => updateParam('page', String(i + 1))}
                    className={`px-3 py-1 text-sm rounded border ${Number(params.get('page') || 1) === i + 1 ? 'bg-black text-white' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
