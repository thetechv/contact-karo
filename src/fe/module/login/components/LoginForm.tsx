interface LoginFormProps {
  email: string;
  password: string;
  isSubmitting: boolean;
  error: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const LoginForm = ({
  email,
  password,
  isSubmitting,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) => {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-xl">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Contact<span className="text-yellow-400">Karo</span>
          </h1>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Employee Login
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Sign in to access the dashboard
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Email Address
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition-all"
            placeholder="employee@contactkaro.in"
            required
            autoComplete="email"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition-all"
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </label>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-yellow-400 hover:bg-yellow-500 px-4 py-3 text-base font-bold text-black shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "⏳ Signing in..." : "Sign In →"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        © 2026 ContactKaro. All rights reserved.
      </p>
    </div>
  );
};
