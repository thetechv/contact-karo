"use client";

import { useState } from "react";
import { api } from "@/fe/services/api";

// Types
export interface Tag {
  _id: string;
  status: string;
  batch_ref: any;
  user_id: any;
  createdAt: string;
}

export interface FilterState {
  status: string;
  search: string;
}

export interface TagStats {
  total: number;
  active: number;
  unassigned: number;
  disabled: number;
}

export const initialFilterState: FilterState = {
  status: "",
  search: "",
};

// Tags hook service
export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTags = async () => {
    setLoading(true);
    const result = await api.getAllTags();
    if (result.success && result.data) {
      setTags(result.data as Tag[]);
    } else {
      setError(result.message || "Failed to load tags");
    }
    setLoading(false);
  };

  return {
    tags,
    loading,
    error,
    loadTags,
  };
};

// Tag filters hook service
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
