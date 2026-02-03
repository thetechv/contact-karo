export const ownerModalStyles = {
  overlay: "fixed inset-0 z-50 flex items-center justify-center p-4",
  backdrop: "absolute inset-0 bg-black/60 backdrop-blur-sm",
  modal:
    "relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col",
  header: {
    container:
      "bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-6 py-4 flex-shrink-0",
    wrapper: "flex items-center justify-between",
    title: "text-xl font-bold text-white",
    closeButton:
      "text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all",
    closeIcon: "w-5 h-5",
  },
  form: {
    container: "p-6 space-y-4 overflow-y-auto flex-1",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-4",
    fullWidth: "md:col-span-2",
    field: "space-y-1.5",
    label: "block text-sm font-semibold text-gray-700 dark:text-gray-200",
    required: "text-red-500 ml-0.5",
    input:
      "w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all",
    textarea:
      "w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none",
    submitButton:
      "w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98]",
  },
} as const;
