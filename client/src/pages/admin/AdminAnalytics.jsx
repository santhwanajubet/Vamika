import { useState, useEffect } from 'react';
import { getSummary, getRevenueOverTime, getTopProducts, getOrdersByStatus, getLowStock } from '../../api/analyticsApi';
import Spinner from '../../components/ui/Spinner';

const STATUS_COLORS = {
  confirmed: 'bg-blue-500',
  processing: 'bg-yellow-500',
  shipped: 'bg-purple-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

export default function AdminAnalytics() {
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getSummary(),
      getRevenueOverTime(30),
      getTopProducts(),
      getOrdersByStatus(),
      getLowStock(5),
    ])
      .then(([s, r, t, o, ls]) => {
        setSummary(s.data.data);
        setRevenue(r.data.data.revenueOverTime || []);
        setTopProducts(t.data.data.products || []);
        setOrdersByStatus(o.data.data.ordersByStatus || []);
        setLowStock(ls.data.data.lowStock || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="mt-16" />;

  const maxRevenue = Math.max(...revenue.map((d) => d.revenue), 1);
  const totalOrdersByStatus = ordersByStatus.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Analytics</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Revenue" value={`₹${summary?.totalRevenue?.toFixed(0) || 0}`} />
        <StatCard label="Orders" value={summary?.totalOrders || 0} />
        <StatCard label="Users" value={summary?.totalUsers || 0} />
        <StatCard label="Products" value={summary?.activeProducts || 0} />
      </div>

      <div className="border rounded p-4">
        <h3 className="font-semibold text-sm mb-4">Revenue (Last 30 Days)</h3>
        {revenue.length === 0 ? (
          <p className="text-sm text-gray-500">No revenue data yet.</p>
        ) : (
          <div className="flex items-end gap-1 h-40">
            {revenue.map((d) => (
              <div key={d._id} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-black rounded-t"
                  style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                  title={`₹${d.revenue.toFixed(0)} (${d._id})`}
                />
              </div>
            ))}
          </div>
        )}
        {revenue.length > 0 && (
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{revenue[0]._id}</span>
            <span>{revenue[revenue.length - 1]._id}</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded p-4">
          <h3 className="font-semibold text-sm mb-4">Orders by Status</h3>
          {ordersByStatus.length === 0 ? (
            <p className="text-sm text-gray-500">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {ordersByStatus.map((d) => (
                <div key={d._id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="capitalize">{d._id}</span>
                    <span>{d.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${STATUS_COLORS[d._id] || 'bg-gray-400'}`}
                      style={{ width: `${(d.count / totalOrdersByStatus) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border rounded p-4">
          <h3 className="font-semibold text-sm mb-4">Top Products</h3>
          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-500">No products yet.</p>
          ) : (
            <div className="space-y-2">
              {topProducts.map((p, i) => (
                <div key={p._id} className="flex items-center gap-3 text-sm">
                  <span className="text-gray-400 w-5 text-right">{i + 1}.</span>
                  <span className="flex-1 truncate">{p.name}</span>
                  <span className="text-gray-500">{p.soldCount} sold</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="border rounded p-4">
          <h3 className="font-semibold text-sm mb-4">Low Stock Alerts</h3>
          <div className="space-y-2">
            {lowStock.map((p) => (
              <div key={p._id} className="flex items-center gap-3 text-sm">
                <span className="flex-1 font-medium">{p.name}</span>
                {p.variants.map((v) => (
                  <span key={v.sku} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded">
                    {v.size}/{v.color}: {v.stock}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
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
