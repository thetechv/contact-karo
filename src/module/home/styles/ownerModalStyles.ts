export const ownerModalStyles = {
  overlay: "fixed inset-0 z-50 flex items-center justify-center p-4",
  backdrop: "absolute inset-0 bg-black/50 backdrop-blur-sm",
  modal:
    "relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto",
  header: {
    container:
      "sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4",
    wrapper: "flex items-center justify-between",
    title: "text-xl font-bold text-gray-900 dark:text-white",
    closeButton:
      "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors",
    closeIcon: "w-6 h-6",
  },
  form: {
    container: "p-6 space-y-4",
    field: "space-y-1",
    label: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
    required: "text-red-500",
    input:
      "w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all",
    textarea:
      "w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none",
    submitButton:
      "w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl",
  },
} as const;
