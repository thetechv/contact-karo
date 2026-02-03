"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
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
      const message = error instanceof Error ? error.message : "Failed to load batches.";
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

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const message = error instanceof Error ? error.message : "Failed to create batch.";
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
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
            <div>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-900 px-3 py-1 text-sm font-semibold text-slate-900 hover:bg-slate-900 hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            Quick form to add a batch with name, notes, and quantity.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Add Batch</h2>
            <p className="text-sm text-slate-600">
              Provide the batch name (batch_id), notes, and quantity.
            </p>
          </div>
        </div>

        <form className="mt-6 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Name
            <input
              name="name"
              placeholder="BATCH001"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400"
              type="text"
              value={formState.name}
              onChange={handleChange}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Quantity
            <input
              name="qty"
              placeholder="100"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400"
              type="number"
              min={1}
              value={formState.qty}
              onChange={handleChange}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
            Notes
            <textarea
              name="notes"
              placeholder="Optional notes"
              className="min-h-[96px] rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400"
              value={formState.notes}
              onChange={handleChange}
            />
          </label>

          {errorMessage ? (
            <p className="text-sm font-medium text-red-600 sm:col-span-2">{errorMessage}</p>
          ) : null}
          {successMessage ? (
            <p className="text-sm font-medium text-emerald-600 sm:col-span-2">
              {successMessage}
            </p>
          ) : null}

          <div className="flex items-center justify-end sm:col-span-2">
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add batch"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-slate-900">Recent Batches</h2>
          <p className="text-sm text-slate-600">
            Download the QR zip for each batch when ready.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {isLoading ? (
            <p className="text-sm text-slate-500">Loading batches...</p>
          ) : batches.length === 0 ? (
            <p className="text-sm text-slate-500">No batches found yet.</p>
          ) : (
            batches.map((batch) => (
              <div
                key={batch._id}
                className="flex flex-col gap-3 rounded-lg border border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{batch.batch_id}</p>
                  <p className="text-xs text-slate-500">
                    Qty: {batch.qty} {batch.status ? `• ${batch.status}` : ""}
                  </p>
                  {batch.note ? (
                    <p className="mt-1 text-xs text-slate-600">{batch.note}</p>
                  ) : null}
                </div>
                <a
                  href={`/api/v0/batch/download/${batch._id}`}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-900 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
                >
                  Download QR zip
                </a>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
