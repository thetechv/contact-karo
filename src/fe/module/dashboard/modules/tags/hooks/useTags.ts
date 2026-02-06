"use client";

import { useState } from "react";
import { api } from "@/fe/services/api";
import type { Tag } from "../constants";

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
