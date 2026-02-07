import type { TagStats } from "../constants";

interface TagsStatsProps {
  stats: TagStats;
}

export const TagsStats = ({ stats }: TagsStatsProps) => {
  return (
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
  );
};

export const StatCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => {
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
};
