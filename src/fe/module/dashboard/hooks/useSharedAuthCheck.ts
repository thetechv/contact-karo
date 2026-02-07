"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface UseSharedAuthCheckProps {
  loadData?: () => Promise<void>;
  onAuthSuccess?: () => void;
}

export const useSharedAuthCheck = (props?: UseSharedAuthCheckProps) => {
  const router = useRouter();
  const { loadData, onAuthSuccess } = props || {};

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

      // Call success callbacks
      onAuthSuccess?.();
      await loadData?.();
    } catch (err) {
      router.push("/login");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/v0/employee/logout", { method: "POST" });
    } catch (err) {
      // ignore
    }
    router.push("/login");
  };

  return { router, handleLogout, checkAuthAndLoad };
};
