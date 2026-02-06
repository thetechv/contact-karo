"use client";

import { Form, Field } from "formik";
import {
  EnhancedForm,
  FormFieldWrapper,
  FormikSubmitButton,
  loginFormSchema,
  type LoginFormData,
  type ApiResponse,
} from "@/fe/lib/validation";

const initialValues: LoginFormData = {
  email: "",
  password: "",
};

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<ApiResponse>;
  onSuccess?: () => void;
}

export const LoginForm = ({ onSubmit, onSuccess }: LoginFormProps) => {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-xl">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Contact<span className="text-yellow-400">Karo</span>
          </h1>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Employee Login
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Sign in to access the dashboard
        </p>
      </div>

      <EnhancedForm<LoginFormData>
        initialValues={initialValues}
        validationSchema={loginFormSchema}
        onSubmit={onSubmit}
        onSuccess={onSuccess}
        successMessage="Login successful! Redirecting..."
        showNotifications={true}
      >
        {({ values, errors, touched, handleChange, handleBlur, formState }) => (
          <Form className="space-y-5">
            <FormFieldWrapper
              name="email"
              label="Email Address"
              required
              error={errors.email}
              touched={touched.email}
            >
              <Field
                name="email"
                type="email"
                placeholder="employee@contactkaro.in"
                autoComplete="email"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                disabled={formState.isSubmitting}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              name="password"
              label="Password"
              required
              error={errors.password}
              touched={touched.password}
            >
              <Field
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                disabled={formState.isSubmitting}
              />
            </FormFieldWrapper>

            <FormikSubmitButton
              isSubmitting={formState.isSubmitting}
              loadingText="⏳ Signing in..."
              className="w-full rounded-lg bg-yellow-400 hover:bg-yellow-500 px-4 py-3 text-base font-bold text-black shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign In →
            </FormikSubmitButton>
          </Form>
        )}
      </EnhancedForm>

      <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        © 2026 ContactKaro. All rights reserved.
      </p>
    </div>
  );
};
