import { useState } from 'react';
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const cart = useSelector((s) => s.cart);

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
