export const pageStyles = {
  container: "min-h-screen bg-white dark:bg-gray-900",
  header:
    "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800",
  headerContent: "flex items-center justify-between px-4 py-3",
  logo: "flex items-center gap-2",
  title: "text-xl font-bold text-gray-900 dark:text-white",
  badge: "text-xs bg-yellow-400 text-black px-2 py-0.5 rounded font-semibold",
  main: "max-w-md mx-auto px-4 py-6",
} as const;

export const ownerLoginStyles = {
  container:
    "mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-blue-200 dark:border-gray-600",
  wrapper: "flex items-start gap-3",
  iconWrapper: "flex-shrink-0 mt-1",
  icon: "text-2xl",
  content: "flex-1",
  title: "text-sm font-semibold text-gray-900 dark:text-white mb-1",
  description: "text-xs text-gray-600 dark:text-gray-300 mb-3",
  button:
    "inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200",
  buttonIcon: "w-4 h-4",
} as const;
