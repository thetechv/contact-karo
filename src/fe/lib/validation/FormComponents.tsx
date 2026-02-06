import React, { useCallback, useState } from "react";
import {
  Formik,
  FormikProps,
  FormikHelpers,
  FormikConfig,
  FormikErrors,
  useFormik,
  useFormikContext,
} from "formik";
import * as Yup from "yup";
import {
  handleFormSubmission,
  FormSubmissionOptions,
  ApiResponse,
  createErrorDebouncer,
  FORM_ERROR_MESSAGES,
} from "./errors";

// Success/Error notification component
interface FormNotificationProps {
  type: "success" | "error";
  message: string;
  onDismiss?: () => void;
}

export const FormNotification: React.FC<FormNotificationProps> = ({
  type,
  message,
  onDismiss,
}) => {
  const baseClasses =
    "p-4 rounded-lg border flex items-center gap-3 transition-all duration-300";
  const typeClasses =
    type === "success"
      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
      : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400";

  return (
    <div className={`${baseClasses} ${typeClasses}`} role="alert">
      <span className="text-lg flex-shrink-0">
        {type === "success" ? "✓" : "⚠️"}
      </span>
      <span className="flex-1 text-sm font-medium">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-current opacity-70 hover:opacity-100 ml-2"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      )}
    </div>
  );
};

// Enhanced form field wrapper with error display
interface FormFieldWrapperProps {
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  name,
  label,
  required = false,
  error,
  touched,
  children,
  className = "",
}) => {
  const hasError = touched && error;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-gray-900 dark:text-white"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hasError && (
        <p
          className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
          role="alert"
          aria-live="polite"
        >
          <span className="text-xs">⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

// Enhanced form component interface
export interface EnhancedFormProps<T> {
  initialValues: FormikConfig<T>["initialValues"];
  validationSchema?: FormikConfig<T>["validationSchema"];
  validateOnChange?: FormikConfig<T>["validateOnChange"];
  validateOnBlur?: FormikConfig<T>["validateOnBlur"];
  onSubmit: (data: T) => Promise<ApiResponse>;
  onSuccess?: (data: any) => void;
  successMessage?: string;
  className?: string;
  showNotifications?: boolean;
  autoResetOnSuccess?: boolean;
  children: (
    formikProps: FormikProps<T> & {
      formState: {
        isSubmitting: boolean;
        isSuccess: boolean;
        error: string | null;
        successMessage: string | null;
      };
      clearNotifications: () => void;
    },
  ) => React.ReactNode;
}

// Enhanced form component with built-in error handling and notifications
export function EnhancedForm<T extends Record<string, any>>({
  onSubmit,
  onSuccess,
  successMessage = "Operation completed successfully",
  className = "",
  showNotifications = true,
  autoResetOnSuccess = false,
  children,
  ...formikProps
}: EnhancedFormProps<T>) {
  const [formState, setFormState] = useState({
    isSubmitting: false,
    isSuccess: false,
    error: null as string | null,
    successMessage: null as string | null,
  });

  const dismissError = useCallback(createErrorDebouncer(), []);
  const dismissSuccess = useCallback(createErrorDebouncer(3000), []);

  const clearNotifications = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      error: null,
      successMessage: null,
      isSuccess: false,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (values: T, formikHelpers: FormikHelpers<T>) => {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: true,
        error: null,
        successMessage: null,
      }));

      try {
        const result = await handleFormSubmission(values, {
          onSubmit,
          onSuccess: (data) => {
            setFormState((prev) => ({
              ...prev,
              isSuccess: true,
              successMessage: successMessage,
              error: null,
            }));

            if (autoResetOnSuccess) {
              formikHelpers.resetForm();
            }

            if (onSuccess) {
              onSuccess(data);
            }

            // Auto-dismiss success message
            dismissSuccess(() => {
              setFormState((prev) => ({
                ...prev,
                successMessage: null,
                isSuccess: false,
              }));
            });
          },
          onError: (error) => {
            setFormState((prev) => ({
              ...prev,
              error,
              isSuccess: false,
            }));

            // Auto-dismiss error message
            dismissError(() => {
              setFormState((prev) => ({ ...prev, error: null }));
            });
          },
          onFieldErrors: (errors) => {
            formikHelpers.setErrors(errors as FormikErrors<T>);
          },
          successMessage,
        });

        if (!result.success && result.errors) {
          // Set field-level errors
          formikHelpers.setErrors(result.errors as FormikErrors<T>);
        }
      } catch (error) {
        console.error("Form submission error:", error);
        setFormState((prev) => ({
          ...prev,
          error: FORM_ERROR_MESSAGES.GENERIC_ERROR,
          isSuccess: false,
        }));
      } finally {
        setFormState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [
      onSubmit,
      onSuccess,
      successMessage,
      autoResetOnSuccess,
      dismissError,
      dismissSuccess,
    ],
  );

  return (
    <div className={className}>
      {showNotifications && formState.error && (
        <div className="mb-6">
          <FormNotification
            type="error"
            message={formState.error}
            onDismiss={clearNotifications}
          />
        </div>
      )}

      {showNotifications && formState.successMessage && (
        <div className="mb-6">
          <FormNotification
            type="success"
            message={formState.successMessage}
            onDismiss={clearNotifications}
          />
        </div>
      )}

      <Formik {...formikProps} onSubmit={handleSubmit}>
        {(formikBag) =>
          children({
            ...formikBag,
            formState: {
              ...formState,
              isSubmitting: formState.isSubmitting || formikBag.isSubmitting,
            },
            clearNotifications,
          })
        }
      </Formik>
    </div>
  );
}

// Input component with Formik integration
interface FormikInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export const FormikInput: React.FC<FormikInputProps> = ({
  name,
  label,
  type = "text",
  placeholder = "",
  required = false,
  className = "",
  disabled = false,
}) => {
  const { values, errors, touched, handleChange, handleBlur } =
    useFormikContext<Record<string, any>>();
  return (
    <FormFieldWrapper
      name={name}
      label={label}
      required={required}
      error={typeof errors[name] === "string" ? errors[name] : undefined}
      touched={!!touched[name]}
      className={className}
    >
      <input
        id={name}
        name={name}
        type={type}
        value={values[name] || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-3 text-sm border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all ${
          touched[name] && errors[name]
            ? "border-red-500 dark:border-red-400"
            : "border-gray-300 dark:border-gray-700"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      />
    </FormFieldWrapper>
  );
};

// Textarea component with Formik integration
interface FormikTextareaProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
  disabled?: boolean;
}

export const FormikTextarea: React.FC<FormikTextareaProps> = ({
  name,
  label,
  placeholder = "",
  required = false,
  rows = 4,
  className = "",
  disabled = false,
}) => {
  const { values, errors, touched, handleChange, handleBlur } =
    useFormikContext<Record<string, any>>();
  return (
    <FormFieldWrapper
      name={name}
      label={label}
      required={required}
      error={typeof errors[name] === "string" ? errors[name] : undefined}
      touched={!!touched[name]}
      className={className}
    >
      <textarea
        id={name}
        name={name}
        value={values[name] || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`w-full px-4 py-3 text-sm border rounded-lg resize-vertical bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all ${
          touched[name] && errors[name]
            ? "border-red-500 dark:border-red-400"
            : "border-gray-300 dark:border-gray-700"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      />
    </FormFieldWrapper>
  );
};

// Select component with Formik integration
interface FormikSelectProps {
  name: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export const FormikSelect: React.FC<FormikSelectProps> = ({
  name,
  label,
  options,
  placeholder = "Select an option",
  required = false,
  className = "",
  disabled = false,
}) => {
  const { values, errors, touched, handleChange, handleBlur } =
    useFormikContext<Record<string, any>>();
  return (
    <FormFieldWrapper
      name={name}
      label={label}
      required={required}
      error={typeof errors[name] === "string" ? errors[name] : undefined}
      touched={!!touched[name]}
      className={className}
    >
      <select
        id={name}
        name={name}
        value={values[name] || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        className={`w-full px-4 py-3 text-sm border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all ${
          touched[name] && errors[name]
            ? "border-red-500 dark:border-red-400"
            : "border-gray-300 dark:border-gray-700"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormFieldWrapper>
  );
};

// Submit button component
interface FormikSubmitButtonProps {
  children: React.ReactNode;
  isSubmitting?: boolean;
  disabled?: boolean;
  className?: string;
  loadingText?: string;
}

export const FormikSubmitButton: React.FC<FormikSubmitButtonProps> = ({
  children,
  isSubmitting = false,
  disabled = false,
  className = "",
  loadingText = "Submitting...",
}) => {
  const isDisabled = isSubmitting || disabled;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`rounded-lg bg-yellow-400 text-black hover:bg-yellow-500 px-6 py-3 text-base font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isSubmitting ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">⏳</span>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
};
