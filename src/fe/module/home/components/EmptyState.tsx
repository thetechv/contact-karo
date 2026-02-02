import React from "react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
  onRegisterClick: () => void;
}

export function EmptyState({
  title = "Tag Not Activated Yet",
  message = "This QR tag hasn't been activated. If you're the owner, please activate your tag and register your vehicle details to enable contact features.",
  icon = "🏷️",
  onRegisterClick,
}: EmptyStateProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <span className="text-7xl">{icon}</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          {message}
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            console.log("Register button clicked!");
            onRegisterClick();
          }}
          className="w-full mb-6 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <span>Register Your Vehicle</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <div className="p-4 bg-blue-50 dark:bg-gray-800 rounded-xl border border-blue-200 dark:border-gray-700">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Owner?</span> Register your vehicle
            to enable contact features and emergency notifications.
          </p>
        </div>
      </div>
    </div>
  );
}
