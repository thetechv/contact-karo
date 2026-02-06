"use client";

import { useState } from "react";
import type { FilterState, Tag, TagStats } from "../constants";
import { initialFilterState } from "../constants";

export const useTagFilters = (tags: Tag[]) => {
  const [filter, setFilter] = useState<FilterState>(initialFilterState);

  const filteredTags = tags.filter((tag) => {
    if (filter.status && tag.status !== filter.status) return false;
    if (filter.search) {
      const search = filter.search.toLowerCase();
      return (
        tag._id.toLowerCase().includes(search) ||
        tag.user_id?.name?.toLowerCase().includes(search) ||
        tag.user_id?.vehicle_no?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const stats: TagStats = {
    total: tags.length,
    active: tags.filter((t) => t.status === "active").length,
    unassigned: tags.filter((t) => t.status === "unassigned").length,
    disabled: tags.filter((t) => t.status === "disabled").length,
  };

  const updateFilter = (field: keyof FilterState, value: string) => {
    setFilter((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilter(initialFilterState);
  };

  return {
    filter,
    filteredTags,
    stats,
    updateFilter,
    resetFilters,
  };
};
