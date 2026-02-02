import React from "react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
}

export function EmptyState({
  title = "Tag Not Activated Yet",
  message = "This QR tag hasn't been activated. If you're the owner, please activate your tag and register your vehicle details to enable contact features.",
  icon = "🏷️",
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
