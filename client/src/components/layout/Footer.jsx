import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Vamika. All rights reserved.</p>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <Link to="/privacy" className="hover:text-gray-700">Privacy</Link>
          <Link to="/terms" className="hover:text-gray-700">Terms</Link>
          <Link to="/contact" className="hover:text-gray-700">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
