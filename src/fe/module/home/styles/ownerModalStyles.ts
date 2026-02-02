export const ownerModalStyles = {
  overlay: "fixed inset-0 z-50 flex items-center justify-center p-4",
  backdrop: "absolute inset-0 bg-black/50 backdrop-blur-sm",
  modal:
    "relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full max-h-[85vh] overflow-y-auto",
  header: {
    container:
      "sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3",
    wrapper: "flex items-center justify-between",
    title: "text-lg font-semibold text-gray-900 dark:text-white",
    closeButton:
      "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors",
    closeIcon: "w-5 h-5",
  },
  form: {
    container: "p-4 space-y-3",
    field: "space-y-1",
    label: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5",
    required: "text-red-500",
    input:
      "w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all",
    textarea:
      "w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none",
    submitButton:
      "w-full mt-4 px-4 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200",
  },
} as const;
