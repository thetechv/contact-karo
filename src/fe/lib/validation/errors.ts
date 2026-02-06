// Error handling utilities for forms
export interface ApiError {
  message: string;
  field?: string;
  code?: string;
}

export interface FormError {
  field: string;
  message: string;
}

export interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  fieldErrors: FormError[];
}

export const initialFormState: FormState = {
  isSubmitting: false,
  isSuccess: false,
  error: null,
  fieldErrors: [],
};

// Error response types from API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ApiError[];
}

// Form error messages
export const FORM_ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  VALIDATION_ERROR: "Please fix the validation errors below.",
  GENERIC_ERROR: "An unexpected error occurred. Please try again.",
  TIMEOUT_ERROR: "Request timed out. Please try again.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN: "Access denied. Please check your permissions.",
  NOT_FOUND: "Resource not found.",
  CONFLICT: "Conflict error. Please refresh and try again.",
  TOO_MANY_REQUESTS: "Too many requests. Please wait and try again.",
};

// Error type categorization
export const categorizeError = (
  error: unknown,
): { type: string; message: string } => {
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      type: "NETWORK_ERROR",
      message: FORM_ERROR_MESSAGES.NETWORK_ERROR,
    };
  }

  if (error instanceof Error) {
    if (error.message.includes("timeout")) {
      return {
        type: "TIMEOUT_ERROR",
        message: FORM_ERROR_MESSAGES.TIMEOUT_ERROR,
      };
    }

    if (
      error.message.includes("401") ||
      error.message.includes("Unauthorized")
    ) {
      return {
        type: "UNAUTHORIZED",
        message: FORM_ERROR_MESSAGES.UNAUTHORIZED,
      };
    }

    if (error.message.includes("403") || error.message.includes("Forbidden")) {
      return { type: "FORBIDDEN", message: FORM_ERROR_MESSAGES.FORBIDDEN };
    }

    if (error.message.includes("404") || error.message.includes("Not Found")) {
      return { type: "NOT_FOUND", message: FORM_ERROR_MESSAGES.NOT_FOUND };
    }

    if (error.message.includes("409") || error.message.includes("Conflict")) {
      return { type: "CONFLICT", message: FORM_ERROR_MESSAGES.CONFLICT };
    }

    if (
      error.message.includes("429") ||
      error.message.includes("Too Many Requests")
    ) {
      return {
        type: "TOO_MANY_REQUESTS",
        message: FORM_ERROR_MESSAGES.TOO_MANY_REQUESTS,
      };
    }

    if (
      error.message.includes("500") ||
      error.message.includes("Internal Server Error")
    ) {
      return {
        type: "SERVER_ERROR",
        message: FORM_ERROR_MESSAGES.SERVER_ERROR,
      };
    }

    return {
      type: "GENERIC_ERROR",
      message: error.message || FORM_ERROR_MESSAGES.GENERIC_ERROR,
    };
  }

  return { type: "GENERIC_ERROR", message: FORM_ERROR_MESSAGES.GENERIC_ERROR };
};

// Process API response errors
export const processApiError = (error: unknown): ApiError[] => {
  const categorized = categorizeError(error);

  // If it's an API response with structured errors
  if (error && typeof error === "object" && "response" in error) {
    const response = error.response as any;
    if (response?.data?.errors && Array.isArray(response.data.errors)) {
      return response.data.errors;
    }
    if (response?.data?.message) {
      return [{ message: response.data.message }];
    }
  }

  // Return categorized error
  return [{ message: categorized.message }];
};

// Transform API errors to form field errors
export const transformToFieldErrors = (
  apiErrors: ApiError[],
): { [key: string]: string } => {
  const fieldErrors: { [key: string]: string } = {};

  apiErrors.forEach((error) => {
    if (error.field) {
      fieldErrors[error.field] = error.message;
    }
  });

  return fieldErrors;
};

// Debounced error display (for things like toast notifications)
export const createErrorDebouncer = (delay = 5000) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (callback: () => void) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(callback, delay);
  };
};

// Form submission wrapper with error handling
export interface FormSubmissionOptions<T> {
  onSubmit: (data: T) => Promise<ApiResponse>;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  onFieldErrors?: (errors: { [key: string]: string }) => void;
  successMessage?: string;
  transformData?: (data: T) => T;
}

export const handleFormSubmission = async <T>(
  data: T,
  options: FormSubmissionOptions<T>,
): Promise<{
  success: boolean;
  errors?: { [key: string]: string };
  message?: string;
}> => {
  try {
    const transformedData = options.transformData
      ? options.transformData(data)
      : data;
    const response = await options.onSubmit(transformedData);

    if (response.success) {
      if (options.onSuccess) {
        options.onSuccess(response.data);
      }
      return {
        success: true,
        message:
          options.successMessage ||
          response.message ||
          "Operation completed successfully",
      };
    } else {
      const apiErrors = response.errors || [
        { message: response.message || "Operation failed" },
      ];
      const fieldErrors = transformToFieldErrors(apiErrors);

      if (Object.keys(fieldErrors).length > 0 && options.onFieldErrors) {
        options.onFieldErrors(fieldErrors);
      }

      const generalError =
        apiErrors.find((e) => !e.field)?.message || "Operation failed";
      if (options.onError) {
        options.onError(generalError);
      }

      return { success: false, errors: fieldErrors, message: generalError };
    }
  } catch (error) {
    const categorizedError = categorizeError(error);
    if (options.onError) {
      options.onError(categorizedError.message);
    }
    return { success: false, message: categorizedError.message };
  }
};

// Validation error type for Formik
export interface ValidationError {
  [field: string]: string | ValidationError;
}
