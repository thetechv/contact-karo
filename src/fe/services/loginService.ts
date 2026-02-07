import { LoginFormData, ApiResponse } from "@/fe/lib/validation";

// Login Service
export class LoginService {
  /**
   * Authenticate user
   */
  static async login(data: LoginFormData): Promise<ApiResponse> {
    try {
      const response = await fetch("/api/v0/employee/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message:
            result?.message ||
            `HTTP ${response.status}: ${response.statusText}`,
          errors: result?.errors || [],
        };
      }

      if (!result?.success) {
        return {
          success: false,
          message: result?.message || "Login failed",
          errors: result?.errors || [],
        };
      }

      return {
        success: true,
        data: result.data || result,
        message: result.message || "Login successful",
      };
    } catch (error) {
      console.error("LoginService.login error:", error);

      // Handle network errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        return {
          success: false,
          message: "Network error. Please check your connection and try again.",
        };
      }

      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<ApiResponse> {
    try {
      const response = await fetch("/api/v0/employee/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message:
            result?.message ||
            `HTTP ${response.status}: ${response.statusText}`,
          errors: result?.errors || [],
        };
      }

      return {
        success: true,
        data: result.data,
        message: result.message || "Logout successful",
      };
    } catch (error) {
      console.error("LoginService.logout error:", error);

      if (error instanceof TypeError && error.message.includes("fetch")) {
        return {
          success: false,
          message: "Network error. Please check your connection and try again.",
        };
      }

      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  }
}

export default LoginService;
