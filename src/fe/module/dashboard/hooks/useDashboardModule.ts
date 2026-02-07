"use client";

import { useState } from "react";

export type DashboardModule = "batches" | "employees" | "tags";

export function useDashboardModule() {
  const [activeModule, setActiveModule] = useState<DashboardModule>("batches");

  return {
    activeModule,
    setActiveModule,
  };
}
