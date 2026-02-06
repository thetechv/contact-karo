import type { ChangeEvent, FormEvent } from "react";
import type { BatchFormState } from "../constants";

interface BatchFormProps {
  formState: BatchFormState;
  isSubmitting: boolean;
  errorMessage: string;
  successMessage: string;
  canSubmit: boolean;
  handleChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export const BatchForm = ({
  formState,
  isSubmitting,
  errorMessage,
  successMessage,
  canSubmit,
  handleChange,
  handleSubmit,
}: BatchFormProps) => {
  return (
    <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Create New Batch
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Generate QR codes in bulk for distribution
          </p>
        </div>
      </div>

      <form className="mt-6 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Batch Name
          <input
            name="name"
            placeholder="BATCH001"
            className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
            type="text"
            value={formState.name}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Quantity
          <input
            name="qty"
            placeholder="100"
            className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
            type="number"
            min={1}
            value={formState.qty}
            onChange={handleChange}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 sm:col-span-2">
          Notes (Optional)
          <textarea
            name="notes"
            placeholder="Additional notes..."
            className="min-h-[96px] rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
            value={formState.notes}
            onChange={handleChange}
          />
        </label>

        {errorMessage ? (
          <p className="text-sm font-medium text-red-600 sm:col-span-2">
            {errorMessage}
          </p>
        ) : null}
        {successMessage ? (
          <p className="text-sm font-medium text-emerald-600 sm:col-span-2">
            {successMessage}
          </p>
        ) : null}

        <div className="flex items-center justify-end sm:col-span-2">
          <button
            type="submit"
            className="rounded-lg bg-yellow-400 text-black hover:bg-yellow-500 px-6 py-3 text-base font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? "⏳ Creating..." : "Create Batch →"}
          </button>
        </div>
      </form>
    </section>
  );
};
