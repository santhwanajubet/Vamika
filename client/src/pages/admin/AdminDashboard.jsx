import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { getSummary } from '../../api/analyticsApi';
import Spinner from '../../components/ui/Spinner';

const ADMIN_LINKS = [
  { to: '/admin', label: 'Dashboard', exact: true },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/products/new', label: 'New Product' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/coupons', label: 'Coupons' },
  { to: '/admin/reviews', label: 'Reviews' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/materials', label: 'Materials' },
  { to: '/admin/work-types', label: 'Work Types' },
  { to: '/admin/occasions', label: 'Occasions' },
  { to: '/admin/users', label: 'Users' },
];

export default function AdminDashboard() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`${sidebarOpen ? 'fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg overflow-y-auto' : 'hidden'} md:static md:block md:w-56 md:shrink-0 md:bg-transparent md:shadow-none`}>
        <div className="p-4 border-b md:border-0 md:pt-6">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex items-center">
              <img src="/vamikaLogo.jpeg" alt="Vamika" className="h-12 w-auto mix-blend-multiply" />
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-black text-xl leading-none">&times;</button>
          </div>
          <nav className="mt-4 space-y-0.5 text-sm">
            {ADMIN_LINKS.map((l) => {
              const active = l.exact ? location.pathname === l.to : location.pathname.startsWith(l.to);
              return (
                <Link key={l.to} to={l.to} className={`block px-3 py-2 rounded ${active ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}>
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="flex-1">
        <div className="md:hidden sticky top-0 z-20 bg-white border-b px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <img src="/vamikaLogo.jpeg" alt="Vamika" className="h-8 w-auto mix-blend-multiply" />
        </div>

        <div className="p-4 md:p-6 md:pt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function AdminOverview() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSummary()
      .then((res) => setSummary(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="mt-16" />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={`₹${summary?.totalRevenue?.toFixed(2) || '0.00'}`} />
        <StatCard label="Orders" value={summary?.totalOrders || 0} />
        <StatCard label="Users" value={summary?.totalUsers || 0} />
        <StatCard label="Active Products" value={summary?.activeProducts || 0} />
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="border rounded p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
