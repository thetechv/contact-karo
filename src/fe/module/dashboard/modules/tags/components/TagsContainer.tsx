"use client";

import { LoadingSpinner, Pagination } from "@/fe/components/ui";
import { TagsHeader } from "./TagsHeader";
import { TagsStats } from "./TagsStats";
import { TagsFilters } from "./TagsFilters";
import { TagsTable } from "./TagsTable";
import { useTags, useTagFilters } from "@/fe/services/dashboard/tags";
import { useSharedAuthCheck } from "@/fe/services/auth";
import { useEffect } from "react";

export const TagsContainer = () => {
  const {
    tags,
    loading,
    error,
    loadTags,
    pagination,
    stats,
    setPage,
    setLimit,
  } = useTags();
  const { router } = useSharedAuthCheck({
    loadData: () => loadTags(),
  });
  const {
    filter,
    filteredTags: clientFilteredTags,
    stats: localStats,
    updateFilter,
  } = useTagFilters(tags);

  // Reload tags when filter status changes
  useEffect(() => {
    loadTags({ page: 1, status: filter.status });
  }, [filter.status]);

  // Use backend stats if available, otherwise local stats (fallback)
  const displayStats = stats || localStats;

  // If using backend search support, pass search term to loadTags.
  // Currently backend only supports status filter, so we rely on client-side filtering for search
  // applied to the fetched page.
  // Note: If you want search across all items, backend search implementation is needed.
  const displayTags = filter.search ? clientFilteredTags : tags;

  if (loading && !tags.length) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <TagsHeader onBackToDashboard={() => router.push("/dashboard")} />
          <TagsStats stats={displayStats} />
          <TagsFilters filter={filter} onFilterChange={updateFilter} />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <TagsTable tags={displayTags} />

        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
          pageSize={pagination.limit}
          onPageSizeChange={setLimit}
          totalItems={pagination.total}
          title="Tags per page"
          loading={loading}
        />
      </div>
    </main>
  );
};
