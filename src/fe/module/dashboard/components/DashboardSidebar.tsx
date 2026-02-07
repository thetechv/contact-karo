import React from "react";
import { DashboardModule } from "../hooks/useDashboardModule";

interface DashboardSidebarProps {
  activeModule: DashboardModule;
  onModuleChange: (module: DashboardModule) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeModule,
  onModuleChange,
}) => {
  const modules = [
    { id: "batches" as const, label: "QR Batches", icon: "📦" },
    { id: "employees" as const, label: "Employees", icon: "👥" },
    { id: "tags" as const, label: "Tags", icon: "🏷️" },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {modules.map((module) => (
            <li key={module.id}>
              <button
                onClick={() => onModuleChange(module.id)}
                className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors ${
                  activeModule === module.id
                    ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <span className="mr-3 text-lg">{module.icon}</span>
                {module.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
