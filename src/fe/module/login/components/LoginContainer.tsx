"use client";

import { LoginForm } from "./LoginForm";
import { useLogin } from "../hooks";

export const LoginContainer = () => {
  const {
    email,
    password,
    isSubmitting,
    error,
    setEmail,
    setPassword,
    handleSubmit,
  } = useLogin();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12 bg-white dark:bg-black">
      <LoginForm
        email={email}
        password={password}
        isSubmitting={isSubmitting}
        error={error}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
      />
    </main>
  );
};
