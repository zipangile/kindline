'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Admin Dashboard Error:', error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-500 mb-6">
          An error occurred while loading this part of the admin dashboard.
          {error.message && (
            <span className="block mt-2 p-3 bg-gray-50 rounded-lg text-sm font-mono text-red-600 break-words">
              {error.message}
            </span>
          )}
          {error.digest && (
            <span className="block mt-1 text-xs text-gray-600">
              Error Digest: {error.digest}
            </span>
          )}
        </p>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2"
          >
            <RefreshCcw size={18} />
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/admin'}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
