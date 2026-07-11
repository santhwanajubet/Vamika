import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function WishlistButton({ productId, wishlisted, onToggle, className = '' }) {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return navigate('/auth/login');
    onToggle(productId);
  };

  return (
    <button
      onClick={handleClick}
      className={`absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors ${className}`}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
        {wishlisted ? (
          <path fill="#ef4444" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        ) : (
          <path fill="none" stroke="#374151" strokeWidth="2" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        )}
      </svg>
    </button>
  );
}
