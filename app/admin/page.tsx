'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if there's a saved code in localStorage
    const savedCode = localStorage.getItem('adminCode');
    const savedTime = localStorage.getItem('adminCodeTime');
    
    if (savedCode && savedTime) {
      const currentTime = new Date().getTime();
      const savedTimeNum = parseInt(savedTime);
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
      
      if (currentTime - savedTimeNum < fiveMinutes) {
        router.push('/admin/dashboard');
      } else {
        // Clear expired code
        localStorage.removeItem('adminCode');
        localStorage.removeItem('adminCodeTime');
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      console.log('Submitting code:', code);
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (response.ok) {
        // Save the code and current time to localStorage
        localStorage.setItem('adminCode', code);
        localStorage.setItem('adminCodeTime', new Date().getTime().toString());
        console.log('Verification successful, redirecting...');
        router.push('/admin/dashboard');
      } else {
        console.log('Verification failed:', data.error);
        setError(data.error || 'Invalid security code');
      }
    } catch (err) {
      console.error('Error during verification:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter the security code to access the admin dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="code" className="sr-only">
              Security Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter security code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 