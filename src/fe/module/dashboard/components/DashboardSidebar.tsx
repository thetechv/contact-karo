"use client";

import React, { useEffect, useState } from "react";
import { DashboardModule } from "../hooks/useDashboardModule";

interface DashboardSidebarProps {
  activeModule: DashboardModule;
  onModuleChange: (module: DashboardModule) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeModule,
  onModuleChange,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const val = localStorage.getItem("dashboardSidebarCollapsed");
      if (val !== null) setCollapsed(val === "true");
    } catch (e) {
      // ignore (SSR or disabled storage)
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("dashboardSidebarCollapsed", String(collapsed));
    } catch (e) {
      // ignore
    }
  }, [collapsed]);
  const modules = [
    { id: "batches" as const, label: "QR Batches", icon: "📦" },
    { id: "employees" as const, label: "Employees", icon: "👥" },
    { id: "tags" as const, label: "Tags", icon: "🏷️" },
  ];

  return (
    <aside
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full transition-all duration-200 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2">
        <div className="text-sm font-semibold text-gray-900 dark:text-white">
          {!collapsed ? "Dashboard" : ""}
        </div>
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {collapsed ? "▶" : "◀"}
        </button>
      </div>

      <nav className="mt-4 px-2">
        <ul className="space-y-2">
          {modules.map((module) => (
            <li key={module.id}>
              <button
                title={module.label}
                onClick={() => onModuleChange(module.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 text-left text-sm font-medium rounded-lg transition-colors ${
                  activeModule === module.id
                    ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <span className="text-lg">{module.icon}</span>
                {!collapsed && <span>{module.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
