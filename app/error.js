"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCcw, AlertCircle } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-red-100 rounded-full mb-6">
            <AlertCircle size={64} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Oops! Something Went Wrong
          </h1>
          <p className="text-gray-600 mb-4">
            Sorry, an unexpected error occurred. Please try again.
          </p>

          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-xs font-mono text-red-800 break-all">
                {error.message || "Unknown error"}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-md hover:shadow-lg"
          >
            <RefreshCcw size={20} />
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <Home size={20} />
            Back to Dashboard
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8">
          © 2026 Parking Team. All rights reserved.
        </p>
      </div>
    </div>
  );
}
