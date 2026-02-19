"use client";

import {
  useEffect,
  useState,
  useCallback,
  useRef,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

// Authentication check hook service for dashboard
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

// Shared authentication check hook service
interface UseSharedAuthCheckProps {
  loadData?: () => Promise<void>;
  onAuthSuccess?: () => void;
}

export const useSharedAuthCheck = (props?: UseSharedAuthCheckProps) => {
  const router = useRouter();

  // Simplified - no auto data loading or auth checking
  // Let individual hooks handle their own auth
  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/v0/employee/logout", { method: "POST" });
    } catch (err) {
      // ignore
    }
    router.push("/login");
  }, [router]);

  return { router, handleLogout };
};

// Login hook service
export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/v0/employee/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const payload = await res.json();
      if (!res.ok || !payload?.success) {
        throw new Error(payload?.message || "Login failed");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    password,
    isSubmitting,
    error,
    setEmail,
    setPassword,
    handleSubmit,
  };
};
