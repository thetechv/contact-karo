"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuthCheck = (loadData: () => Promise<void>) => {
  const router = useRouter();

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
      loadData();
    } catch (err) {
      router.push("/login");
    }
  };

  return { router };
};
