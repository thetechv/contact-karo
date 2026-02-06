export const ownerModalStyles = {
  overlay: "fixed inset-0 z-50 flex items-center justify-center p-4",
  backdrop: "absolute inset-0 bg-black/70 backdrop-blur-sm",
  modal:
    "relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border-2 border-gray-900 dark:border-gray-300",
  header: {
    container:
      "bg-white dark:bg-gray-900 border-b-2 border-gray-900 dark:border-gray-300 px-6 py-4 flex-shrink-0",
    wrapper: "flex items-center justify-between",
    title: "text-xl font-bold text-gray-900 dark:text-white",
    closeButton:
      "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg p-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-800",
    closeIcon: "w-5 h-5",
  },
  form: {
    container: "p-6 space-y-4 overflow-y-auto flex-1",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-4",
    fullWidth: "md:col-span-2",
    field: "space-y-1.5",
    label: "block text-sm font-semibold text-gray-900 dark:text-white",
    required: "text-red-500 ml-0.5",
    input:
      "w-full px-4 py-3 text-sm border border-gray-700 dark:border-gray-400 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all",
    textarea:
      "w-full px-4 py-3 text-sm border border-gray-700 dark:border-gray-400 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all resize-none",
    submitButton:
      "w-full px-6 py-3.5 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-black font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98]",
  },
} as const;
