import { BatchFormData, ApiResponse } from "@/fe/lib/validation";

// Base API configuration
const API_BASE_URL = "/api/v0";

// Batch Service
export class BatchService {
  /**
   * Create a new batch
   */
  static async createBatch(data: BatchFormData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batch_id: data.name.trim(),
          qty: data.qty,
          note: data.notes.trim() || undefined,
        }),
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
          message: result?.message || "Failed to create batch",
          errors: result?.errors || [],
        };
      }

      return {
        success: true,
        data: result.data,
        message: result.message || "Batch created successfully",
      };
    } catch (error) {
      console.error("BatchService.createBatch error:", error);

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
   * Get all batches
   */
  static async getBatches(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/batch`, {
        method: "GET",
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
        data: result.data || result,
        message: result.message,
      };
    } catch (error) {
      console.error("BatchService.getBatches error:", error);

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
   * Delete a batch
   */
  static async deleteBatch(batchId: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/batch/${batchId}`, {
        method: "DELETE",
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
        message: result.message || "Batch deleted successfully",
      };
    } catch (error) {
      console.error("BatchService.deleteBatch error:", error);

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

export default BatchService;
