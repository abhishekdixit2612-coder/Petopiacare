'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error('Invalid password');
      }

      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/logos/primary.png"
            alt="PetopiaCare"
            width={150}
            height={60}
            className="mx-auto mb-4"
          />
          <h1 className="font-display text-display-sm font-semibold text-neutral-900">Admin Login</h1>
          <p className="text-body-md text-neutral-500 mt-2">Access PetopiaCare Admin Control Center</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-md p-8 border border-neutral-100">
          {error && (
            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg mb-4 text-body-sm font-semibold">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="password" className="block text-label font-medium text-neutral-700 mb-2">
              Admin Vault Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all font-mono"
              disabled={loading}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-400 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>

        <p className="text-center text-neutral-400 text-label-sm mt-6">
          Authorized personnel only. Sessions expire after 24 hours.
        </p>
      </div>
    </div>
  );
}
