import {
  formatDateTime,
  getStatusColor,
  copyToClipboard,
} from "@/fe/lib/utils";
import { Badge, Button } from "@/fe/components/ui";
import type { Tag } from "../constants";

interface TagsTableProps {
  tags: Tag[];
}

export const TagsTable = ({ tags }: TagsTableProps) => {
  return (
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
            {tags.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  No tags found
                </td>
              </tr>
            ) : (
              tags.map((tag) => (
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
                      onClick={() => window.open(`/tag/${tag._id}`, "_blank")}
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
  );
};
