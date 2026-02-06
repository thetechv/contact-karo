"use client";

import { LoadingSpinner } from "@/fe/components/ui";
import { TagsHeader } from "./TagsHeader";
import { TagsStats } from "./TagsStats";
import { TagsFilters } from "./TagsFilters";
import { TagsTable } from "./TagsTable";
import { useTags, useTagFilters } from "@/fe/services/dashboard/tags";
import { useSharedAuthCheck } from "@/fe/services/auth";

export const TagsContainer = () => {
  const { tags, loading, error, loadTags } = useTags();
  const { router } = useSharedAuthCheck({ loadData: loadTags });
  const { filter, filteredTags, stats, updateFilter } = useTagFilters(tags);

  if (loading) {
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
          <TagsStats stats={stats} />
          <TagsFilters filter={filter} onFilterChange={updateFilter} />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <TagsTable tags={filteredTags} />
      </div>
    </main>
  );
};
