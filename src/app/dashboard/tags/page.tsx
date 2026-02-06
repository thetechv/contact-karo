"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/fe/services/api";
import { Badge, Button, Input, LoadingSpinner } from "@/fe/components/ui";
import {
  formatDateTime,
  getStatusColor,
  copyToClipboard,
} from "@/fe/lib/utils";

type Tag = {
  _id: string;
  status: string;
  batch_ref: any;
  user_id: any;
  createdAt: string;
};

export default function TagsPage() {
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({ status: "", search: "" });

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    try {
      const res = await fetch("/api/v0/employee", { method: "GET" });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      loadTags();
    } catch (err) {
      router.push("/login");
    }
  };

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

  const stats = {
    total: tags.length,
    active: tags.filter((t) => t.status === "active").length,
    unassigned: tags.filter((t) => t.status === "unassigned").length,
    disabled: tags.filter((t) => t.status === "disabled").length,
  };

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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              QR Tags Management
            </h1>
            <Button onClick={() => router.push("/dashboard")}>
              ← Dashboard
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Total Tags"
              value={stats.total}
              color="bg-gray-100 dark:bg-gray-800"
            />
            <StatCard
              label="Active"
              value={stats.active}
              color="bg-green-100 dark:bg-green-900/30"
            />
            <StatCard
              label="Unassigned"
              value={stats.unassigned}
              color="bg-yellow-100 dark:bg-yellow-900/30"
            />
            <StatCard
              label="Disabled"
              value={stats.disabled}
              color="bg-red-100 dark:bg-red-900/30"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search by ID, name, or vehicle..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="flex-1"
            />
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-yellow-400 focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="unassigned">Unassigned</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Tags Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Tag ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Batch
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredTags.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                    >
                      No tags found
                    </td>
                  </tr>
                ) : (
                  filteredTags.map((tag) => (
                    <tr
                      key={tag._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            copyToClipboard(tag._id);
                            alert("Tag ID copied!");
                          }}
                          className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {tag._id.slice(0, 8)}...
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getStatusColor(tag.status)}>
                          {tag.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {tag.user_id?.name || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {tag.user_id?.vehicle_no || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {tag.batch_ref?.batch_id || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {formatDateTime(tag.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          size="sm"
                          onClick={() =>
                            window.open(`/tag/${tag._id}`, "_blank")
                          }
                          className="text-xs"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className={`${color} rounded-xl p-4`}>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {label}
      </p>
      <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
        {value}
      </p>
    </div>
  );
}
