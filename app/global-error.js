"use client";

import { useEffect } from "react";
import { Home, RefreshCcw, AlertTriangle } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md text-center">
            {/* Error Illustration */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-red-100 rounded-full mb-6">
                <AlertTriangle size={64} className="text-red-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                System Error
              </h1>
              <p className="text-gray-600">
                A critical error occurred. Please reload the page or return to
                the dashboard.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => reset()}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-md hover:shadow-lg"
              >
                <RefreshCcw size={20} />
                Reload Page
              </button>
              <a
                href="/dashboard"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <Home size={20} />
                Back to Dashboard
              </a>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-gray-400 mt-8">
              © 2026 Parking Team. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
