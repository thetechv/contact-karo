"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

type Batch = {
  _id: string;
  batch_id: string;
  qty: number;
  note?: string;
  status?: string;
  createdAt?: string;
};

type BatchFormState = {
  name: string;
  qty: string;
  notes: string;
};

const initialFormState: BatchFormState = {
  name: "",
  qty: "",
  notes: "",
};

export default function DashboardPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [formState, setFormState] = useState<BatchFormState>(initialFormState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const canSubmit = useMemo(() => {
    const qty = Number(formState.qty);
    return formState.name.trim().length > 0 && Number.isFinite(qty) && qty > 0;
  }, [formState]);

  const loadBatches = async () => {
    try {
      setErrorMessage("");
      const response = await fetch("/api/v0/batch");
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "Unable to load batches.");
      }
      setBatches(payload?.data || []);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load batches.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const res = await fetch("/api/v0/employee", { method: "GET" });
        if (res.status === 401) {
          router.push("/login");
          return;
        }
      } catch (err) {
        // if network error, redirect to login to be safe
        router.push("/login");
        return;
      }

      void loadBatches();
    };

    void checkAuthAndLoad();
  }, []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await fetch("/api/v0/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batch_id: formState.name.trim(),
          qty: Number(formState.qty),
          note: formState.notes.trim(),
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "Failed to create batch.");
      }

      setSuccessMessage("Batch created. QR codes are generating now.");
      setFormState(initialFormState);
      await loadBatches();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create batch.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/v0/employee/logout", { method: "POST" });
    } catch (err) {
      // ignore
    }
    router.push("/login");
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
      <section className="rounded-2xl border border-gray-300 dark:border-gray-700 bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 shadow-xl">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-black tracking-tight">
                Dashboard
              </h1>
              <p className="text-sm opacity-80 font-medium">
                ContactKaro Management System
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/dashboard/tags")}
                className="rounded-lg bg-black text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 transition"
              >
                Tags
              </button>
              <button
                onClick={() => router.push("/dashboard/employees")}
                className="rounded-lg bg-black text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 transition"
              >
                Employees
              </button>
              <button
                onClick={handleLogout}
                className="rounded-lg border-2 border-black text-black px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </section>

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

        <form
          className="mt-6 grid gap-5 sm:grid-cols-2"
          onSubmit={handleSubmit}
        >
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

      <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xl">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recent Batches
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Download QR codes when batch generation is complete
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {isLoading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading batches...
            </p>
          ) : batches.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No batches created yet.
            </p>
          ) : (
            batches.map((batch) => (
              <div
                key={batch._id}
                className="flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:flex-row sm:items-center sm:justify-between hover:border-yellow-400 transition"
              >
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {batch.batch_id}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Qty: {batch.qty} {batch.status ? `• ${batch.status}` : ""}
                  </p>
                  {batch.note && (
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {batch.note}
                    </p>
                  )}
                </div>
                <a
                  href={`/api/v0/batch/download/${batch._id}`}
                  className="inline-flex items-center justify-center rounded-lg bg-yellow-400 text-black hover:bg-yellow-500 px-4 py-2 text-sm font-bold transition shadow-md hover:shadow-lg"
                >
                  📥 Download ZIP
                </a>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
