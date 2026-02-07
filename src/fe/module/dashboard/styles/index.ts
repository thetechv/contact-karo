// Dashboard-specific styles can be added here if needed
// Currently using Tailwind classes directly in components

export const dashboardStyles = {
  container: "mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10",
  header:
    "rounded-2xl border border-gray-300 dark:border-gray-700 bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 shadow-xl",
  section:
    "rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xl",
  button: {
    primary:
      "rounded-lg bg-yellow-400 text-black hover:bg-yellow-500 px-6 py-3 text-base font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "rounded-lg bg-black text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 transition",
    outline:
      "rounded-lg border-2 border-black text-black px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white transition",
  },
  input:
    "rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400",
};
