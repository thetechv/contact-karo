import { Button } from "@/fe/components/ui";

interface TagsHeaderProps {
  onBackToDashboard: () => void;
}

export const TagsHeader = ({ onBackToDashboard }: TagsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
        QR Tags Management
      </h1>
      <Button onClick={onBackToDashboard}>← Dashboard</Button>
    </div>
  );
};
