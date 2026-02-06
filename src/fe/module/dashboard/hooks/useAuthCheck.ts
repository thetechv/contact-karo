"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuthCheck = (loadBatches: () => Promise<void>) => {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const res = await fetch("/api/v0/employee", { method: "GET" });
        if (res.status === 401) {
          router.push("/login");
          return;
        }
      } catch (err) {
        // if network error, redirect to login to be safe
        router.push("/login");
        return;
      }

      void loadBatches();
    };

    void checkAuthAndLoad();
  }, [router, loadBatches]);

  const handleLogout = async () => {
    try {
      await fetch("/api/v0/employee/logout", { method: "POST" });
    } catch (err) {
      // ignore
    }
    router.push("/login");
  };

  return {
    handleLogout,
    router,
  };
};
