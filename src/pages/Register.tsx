import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'elder' | 'caregiver'>('elder');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill out all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      const success = await register({
        name,
        email,
        password,
        role,
      });
      
      if (!success) {
        setError('Email already in use');
      }
    } catch (err) {
      setError('Failed to create account. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-neutral-900 mb-6">Create Account</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg flex items-start">
          <AlertCircle className="text-error-500 mr-2 shrink-0" size={20} />
          <p className="text-error-700 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="text-neutral-500" size={18} />
            </div>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input pl-10"
              placeholder="John Doe"
              disabled={loading}
            />
          </div>
        </div>
        
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
        
        <div className="mb-4">
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
        </div>
        
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="text-neutral-500" size={18} />
            </div>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input pl-10"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            I am a
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`py-2 px-4 rounded-lg border ${
                role === 'elder'
                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                  : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
              }`}
              onClick={() => setRole('elder')}
              disabled={loading}
            >
              Elder
            </button>
            <button
              type="button"
              className={`py-2 px-4 rounded-lg border ${
                role === 'caregiver'
                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                  : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
              }`}
              onClick={() => setRole('caregiver')}
              disabled={loading}
            >
              Caregiver
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      
      <p className="mt-6 text-center text-neutral-600">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;