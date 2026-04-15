'use client';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('[App Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F5F5EF] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⚠️</div>
        <h2 className="font-baskerville text-2xl text-[#1a1a1a] mb-2">Something went wrong</h2>
        <p className="text-black/40 text-sm mb-6">
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <button
          onClick={reset}
          className="bg-[#174a37] text-white px-6 py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors"
        >
          Try Again
        </button>
        <a href="/" className="block mt-3 text-sm text-[#CFB383] hover:underline">
          Back to Home
        </a>
      </div>
    </div>
  );
}
