import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/authSlice';

const NAV_LINKS = [
  { to: '/shop', label: 'Shop' },
  { to: '/cart', label: 'Cart' },
  { to: '/wishlist', label: 'Wishlist' },
  { to: '/orders', label: 'Orders' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const cart = useSelector((s) => s.cart);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/products/search?q=${encodeURIComponent(value)}&limit=8`);
        const data = await res.json();
        if (data.success) {
          setResults(data.data.products);
          setShowResults(true);
        }
      } catch { /* ignore */ }
    }, 300);
  };

  const goToProduct = (slug) => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    navigate(`/product/${slug}`);
  };

  const linkClass = 'hover:text-gray-600 transition-colors';
  const mobileLinkClass = 'block px-4 py-2 text-sm hover:bg-gray-50';

  return (
    <nav className="border-b border-gray-200 bg-white dark:bg-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/vamikaLogo.jpeg" alt="Vamika" className="h-14 w-auto mix-blend-multiply" />
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className={linkClass}>
              {label}
              {to === '/cart' && cart.items.length > 0 && (
                <span className="ml-1 text-xs bg-black text-white px-1.5 py-0.5 rounded-full">
                  {cart.items.length}
                </span>
              )}
            </Link>
          ))}

          <div className="relative" ref={searchRef}>
            <div className="flex items-center border border-gray-300 rounded-full px-3 py-1.5 focus-within:border-gray-500 transition-colors">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => results.length > 0 && setShowResults(true)}
                placeholder="Search products..."
                className="ml-2 outline-none text-sm bg-transparent w-40 focus:w-56 transition-all"
              />
            </div>
            {showResults && results.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {results.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => goToProduct(p.slug)}
                    className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 text-left"
                  >
                    <img
                      src={p.images?.[0] || ''}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">
                        ₹{(p.offerPrice || p.price).toLocaleString('en-IN')}
                        {p.offerPrice && p.offerPrice < p.price && (
                          <span className="line-through ml-1 text-gray-400">₹{p.price.toLocaleString('en-IN')}</span>
                        )}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/account" className={linkClass}>
                {user.name}
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className={linkClass}>
                  Products
                </Link>
              )}
              <button onClick={() => { dispatch(logout()); navigate('/'); }} className="text-sm text-gray-500 hover:text-gray-700">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/auth/login" className={linkClass}>
                Sign In
              </Link>
            </div>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white pb-3">
          <div className="px-4 py-2">
            <div className="flex items-center border border-gray-300 rounded-full px-3 py-1.5 focus-within:border-gray-500">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search products..."
                className="ml-2 outline-none text-sm bg-transparent w-full"
              />
            </div>
            {showResults && results.length > 0 && (
              <div className="mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {results.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => { goToProduct(p.slug); setOpen(false); }}
                    className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 text-left"
                  >
                    <img src={p.images?.[0] || ''} alt={p.name} className="w-8 h-8 object-cover rounded" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">₹{(p.offerPrice || p.price).toLocaleString('en-IN')}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} className={mobileLinkClass}>
              {label}
              {to === '/cart' && cart.items.length > 0 && (
                <span className="ml-1 text-xs bg-black text-white px-1.5 py-0.5 rounded-full">
                  {cart.items.length}
                </span>
              )}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/account" onClick={() => setOpen(false)} className={mobileLinkClass}>{user.name}</Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setOpen(false)} className={mobileLinkClass}>Products</Link>
              )}
              <button onClick={() => { dispatch(logout()); navigate('/'); setOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-50">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login" onClick={() => setOpen(false)} className={mobileLinkClass}>Sign In</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
