import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      const success = await login(email, password);
      
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Failed to log in. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-neutral-900 mb-6">Log In</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg flex items-start">
          <AlertCircle className="text-error-500 mr-2 shrink-0" size={20} />
          <p className="text-error-700 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="text-neutral-500" size={18} />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input pl-10"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="text-neutral-500" size={18} />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pl-10"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          <div className="mt-1 text-right">
            <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
              Forgot password?
            </a>
          </div>
        </div>
        
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      
      <p className="mt-6 text-center text-neutral-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
          Sign up
        </Link>
      </p>
      
      <div className="mt-8 bg-primary-50 rounded-lg p-3">
        <p className="text-primary-800 text-sm text-center font-medium">
          Demo Accounts
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-neutral-700">
          <div className="p-2 bg-white rounded">
            <div className="font-medium mb-1">Elder</div>
            <div>Email: martha@example.com</div>
            <div>Password: password123</div>
          </div>
          <div className="p-2 bg-white rounded">
            <div className="font-medium mb-1">Caregiver</div>
            <div>Email: sarah@example.com</div>
            <div>Password: password123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;