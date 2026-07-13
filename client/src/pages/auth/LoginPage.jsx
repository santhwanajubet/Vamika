import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, clearError } from '../../features/authSlice';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import FieldError from '../../components/ui/FieldError';
import { validateLogin } from '../../utils/validate';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error } = useSelector((s) => s.auth);

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);
  useEffect(() => { dispatch(clearError()); }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validateLogin(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const result = await dispatch(login(form));
    if (result.error) setSubmitting(false);
  };

  const inputClass = (field) => `w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black ${errors[field] ? 'border-red-500' : 'border-gray-300'}`;

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className={inputClass('email')}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <FieldError message={errors.email} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className={inputClass('password')}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <FieldError message={errors.password} />
        </div>
        <div className="flex justify-end">
          <Link to="/auth/forgot-password" className="text-xs text-gray-500 underline">Forgot password?</Link>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? <Spinner size="sm" /> : 'Sign In'}
        </Button>
      </form>
      <p className="text-sm text-gray-500 mt-4 text-center">
        Don&apos;t have an account? <Link to="/auth/register" className="underline">Register</Link>
      </p>
    </div>
  );
}
