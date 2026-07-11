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
  { to: '/admin/users', label: 'Users' },
];

export default function AdminDashboard() {
  const location = useLocation();
  const isRoot = location.pathname === '/admin';

  if (!isRoot) return <Outlet />;

  return <AdminOverview />;
}

function AdminOverview() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSummary()
      .then((res) => setSummary(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="mt-32" />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        <aside className="w-56 shrink-0">
          <h1 className="text-xl font-bold mb-6">Admin</h1>
          <nav className="space-y-1 text-sm">
            {ADMIN_LINKS.map((l) => {
              const active = l.exact ? location.pathname === l.to : location.pathname.startsWith(l.to);
              return (
                <Link key={l.to} to={l.to} className={`block px-3 py-2 rounded ${active ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}`}>
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 px-4">
          <h2 className="text-2xl font-bold mb-6">Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Revenue" value={`₹${summary?.totalRevenue?.toFixed(2) || '0.00'}`} />
            <StatCard label="Orders" value={summary?.totalOrders || 0} />
            <StatCard label="Users" value={summary?.totalUsers || 0} />
            <StatCard label="Active Products" value={summary?.activeProducts || 0} />
          </div>
        </div>
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
