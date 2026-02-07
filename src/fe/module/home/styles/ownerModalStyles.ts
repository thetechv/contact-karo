export const ownerModalStyles = {
  overlay: "fixed inset-0 z-50 flex items-center justify-center p-4",
  backdrop: "absolute inset-0 bg-black/40",
  modal:
    "relative bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden",
  header: {
    container: "px-6 py-4 border-b bg-white dark:bg-gray-900",
    wrapper: "flex items-center justify-between",
    title: "text-lg font-semibold text-gray-900 dark:text-white",
    closeButton:
      "text-gray-600 dark:text-gray-400 rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition",
    closeIcon: "w-5 h-5",
  },
  form: {
    container: "p-6 space-y-4 overflow-y-auto flex-1",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-4",
    fullWidth: "md:col-span-2",
    field: "space-y-1.5",
    label: "block text-sm font-medium text-gray-800 dark:text-gray-200",
    required: "text-red-500 ml-0.5",
    input:
      "w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 outline-none transition",
    textarea:
      "w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 outline-none transition resize-none",
    submitButton:
      "w-full px-6 py-4 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-base sm:text-sm rounded-xl shadow-lg hover:shadow-xl disabled:shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:hover:scale-100",
    secondaryButton:
      "w-full px-6 py-4 sm:py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold text-base sm:text-sm rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",

    // Compact variants for footer buttons (less bulky)
    submitButtonSmall:
      "w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm rounded-md shadow-sm hover:shadow-md transition-all duration-150",
    secondaryButtonSmall:
      "w-full px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-150",
  },
  alert: {
    error:
      "mx-6 mt-6 mb-0 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-md",
    success:
      "mx-6 mt-6 mb-0 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-md",
  },
} as const;
