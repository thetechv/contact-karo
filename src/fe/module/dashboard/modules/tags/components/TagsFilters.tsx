import { Input } from "@/fe/components/ui";
import type { FilterState } from "../constants";

interface TagsFiltersProps {
  filter: FilterState;
  onFilterChange: (field: keyof FilterState, value: string) => void;
}

export const TagsFilters = ({ filter, onFilterChange }: TagsFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Input
        placeholder="Search by ID, name, or vehicle..."
        value={filter.search}
        onChange={(e) => onFilterChange("search", e.target.value)}
        className="flex-1"
      />
      <select
        value={filter.status}
        onChange={(e) => onFilterChange("status", e.target.value)}
        className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-yellow-400 focus:outline-none"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="unassigned">Unassigned</option>
        <option value="disabled">Disabled</option>
      </select>
    </div>
  );
};
