// src/Admin/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      // Query /adminCredentials by email
      const res = await api.get('/adminCredentials', {
        params: { email: email.trim().toLowerCase() },
      });

      const admins = Array.isArray(res.data) ? res.data : [];

      if (admins.length === 0) {
        setError('Invalid email or password.');
        setLoading(false);
        return;
      }

      const admin = admins[0];

      if (admin.password !== password) {
        setError('Invalid email or password.');
        setLoading(false);
        return;
      }

      if (
        admin.status &&
        admin.status.toLowerCase() !== 'active'
      ) {
        setError('Your admin account is not active.');
        setLoading(false);
        return;
      }

      // Persist login (dev-only — no JWT in this environment)
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('adminUser', JSON.stringify(admin));
      storage.setItem('adminAuthenticated', 'true');
      storage.setItem('adminToken', 'json-server-dev-token');

      if (!rememberMe) {
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminToken');
      }

      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Admin login error:', err);
      if (!err.response) {
        setError(
          'Cannot reach the server. Make sure JSON Server is running on port 5000.'
        );
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/40 flex items-center justify-center px-4 py-12">
      <ToastContainer position="top-right" autoClose={4000} theme="light" />

      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-600 shadow-lg mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">SkillNest</h1>
          <p className="text-xs text-gray-500 mt-1">Administrator Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Admin Sign In
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter your administrator credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 transition-all bg-white"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 transition-all bg-white"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <span className="text-gray-700">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  toast.info(
                    'Please contact the system administrator to reset your password.'
                  )
                }
                className="text-amber-700 hover:text-amber-800 font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white rounded-lg bg-amber-600 hover:bg-amber-700 active:bg-amber-800 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Login to Admin Portal
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100">
          <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 leading-relaxed">
            This is a restricted administrator area. Unauthorized access
            attempts are logged.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;