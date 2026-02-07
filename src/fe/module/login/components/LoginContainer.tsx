"use client";

import { useRouter } from "next/navigation";
import { LoginForm } from "./LoginForm";
import LoginService from "@/fe/services/loginService";
import { LoginFormData, ApiResponse } from "@/fe/lib/validation";

export const LoginContainer = () => {
  const router = useRouter();

  const handleLoginSubmit = async (
    data: LoginFormData,
  ): Promise<ApiResponse> => {
    return LoginService.login(data);
  };

  const handleLoginSuccess = () => {
    router.push("/dashboard");
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12 bg-white dark:bg-black">
      <LoginForm onSubmit={handleLoginSubmit} onSuccess={handleLoginSuccess} />
    </main>
  );
};
