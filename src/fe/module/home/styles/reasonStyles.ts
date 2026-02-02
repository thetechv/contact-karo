export const reasonSelectorStyles = {
  container: "space-y-2 mb-6",
  button: {
    base: "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all duration-200 text-left",
    selected: "bg-yellow-400 border-yellow-400 shadow-sm",
    default:
      "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/10",
  },
  radio: {
    container:
      "flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 dark:border-gray-500 flex-shrink-0",
    selected: "w-2 h-2 rounded-full bg-gray-900 dark:bg-gray-100",
  },
  icon: "text-base",
  label: "text-sm flex-1 text-gray-900 dark:text-white",
};
