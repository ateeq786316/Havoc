import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { supabase } from '../lib/supabase';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setError(error.message || 'Login failed');
        return;
      }

      // Verify admin role
      const userId = data.user?.id;
      if (!userId) {
        setError('Login failed: no user');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        setError(profileError.message || 'Could not fetch profile');
        return;
      }

      if (profile?.role !== 'admin') {
        setError('Access denied: not an admin account');
        await supabase.auth.signOut();
        return;
      }

      navigate('/admin');
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Havoc Solutions</h1>
          <p className="text-gray-600">Admin Panel Login</p>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Super Admin:</strong> <code className="bg-yellow-100 px-1 rounded">havocsolutions1@gmail.com</code> / 
              <code className="bg-yellow-100 px-1 rounded">Havocsuperadmin@786316</code>
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="admin@havocsolutions.com"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            loading={loading}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an admin account?{' '}
            <button
              onClick={() => navigate('/admin/register')}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Register here
            </button>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            First time setup?{' '}
            <button
              onClick={() => navigate('/admin/setup')}
              className="text-green-600 hover:text-green-500 font-medium"
            >
              Initial Setup
            </button>
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Website
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
