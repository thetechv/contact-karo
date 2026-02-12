"use client";

import { useState } from "react";
import type { Batch } from "../constants";
import { PrintModal } from "./PrintModal";
import { Pagination } from "@/fe/components/ui";

interface BatchListProps {
  batches: Batch[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export const BatchList = ({ batches, isLoading, pagination, setPage, setLimit }: BatchListProps) => {
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  return (
    <>
      <PrintModal
        isOpen={!!selectedBatch}
        onClose={() => setSelectedBatch(null)}
        batch={selectedBatch}
      />
      <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Batches
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Download QR codes when batch generation is complete
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {isLoading && batches.length === 0 ? (
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
                  <div className="flex gap-2">
                    <a
                      href={`/api/v0/batch/download/${batch._id}`}
                      className="inline-flex items-center justify-center rounded-lg bg-yellow-400 text-black hover:bg-yellow-500 px-4 py-2 text-sm font-bold transition shadow-md hover:shadow-lg"
                    >
                      📥 Download ZIP
                    </a>
                    <button
                      onClick={() => setSelectedBatch(batch)}
                      className="inline-flex items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 text-sm font-bold transition shadow-md hover:shadow-lg"
                    >
                      Download Print
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
          pageSize={pagination.limit}
          onPageSizeChange={setLimit}
          totalItems={pagination.total}
          title="Batches per page"
          loading={isLoading}
        />
      </section>
    </>
  );
};
