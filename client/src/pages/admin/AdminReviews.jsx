import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAllReviews, approveReview, deleteReview } from '../../api/reviewApi';
import Spinner from '../../components/ui/Spinner';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    setLoading(true);
    getAllReviews()
      .then((res) => setReviews(res.data.data.reviews))
      .finally(() => setLoading(false));
  };

  useEffect(fetch, []);

  const handleApprove = async (id, isApproved) => {
    try {
      await approveReview(id, isApproved);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update review');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      await deleteReview(id);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete review');
    }
  };

  if (loading) return <Spinner className="mt-16" />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500">No reviews yet.</p>
      ) : (
        <div className="border rounded overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Comment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reviews.map((r) => (
                <tr key={r._id} className={r.isApproved ? '' : 'bg-yellow-50'}>
                  <td className="px-4 py-3">
                    <Link to={`/product/${r.product?.slug}`} className="text-blue-600 hover:underline">
                      {r.product?.name || 'Deleted'}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{r.user?.name || r.user?.email || 'Unknown'}</td>
                  <td className="px-4 py-3">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{r.title || r.comment || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${r.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {r.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 flex gap-2">
                    {!r.isApproved && (
                      <button onClick={() => handleApprove(r._id, true)} className="text-xs text-green-600 hover:underline">
                        Approve
                      </button>
                    )}
                    {r.isApproved && (
                      <button onClick={() => handleApprove(r._id, false)} className="text-xs text-yellow-600 hover:underline">
                        Unapprove
                      </button>
                    )}
                    <button onClick={() => handleDelete(r._id)} className="text-xs text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
