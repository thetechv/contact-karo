"use client";

import { useState } from "react";
import { api } from "@/fe/services/api";
import type { Tag } from "../constants";

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTags = async (params: any = {}) => {
    setLoading(true);
    const { page = pagination.page, limit = pagination.limit, ...filters } = params;

    // Ensure we don't send undefined/null values
    const queryParams: any = { page, limit };
    if (filters.status) queryParams.status = filters.status;
    if (filters.batch_ref) queryParams.batch_ref = filters.batch_ref;
    if (filters.user_id) queryParams.user_id = filters.user_id;

    const result = await api.getAllTags(queryParams);

    if (result.success && result.data) {
      setTags(result.data as Tag[]);
      if (result.pagination) {
        setPagination({
          page: result.pagination.page,
          limit: result.pagination.limit,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages,
        });
      }
      if (result.stats) {
        setStats(result.stats);
      }
    } else {
      setError(result.message || "Failed to load tags");
    }
    setLoading(false);
  };

  const setPage = (page: number) => {
    loadTags({ page });
  };

  const setLimit = (limit: number) => {
    loadTags({ limit, page: 1 }); // Reset to page 1 on limit change
  };

  return {
    tags,
    loading,
    error,
    loadTags,
    pagination,
    stats,
    setPage,
    setLimit,
  };
};
