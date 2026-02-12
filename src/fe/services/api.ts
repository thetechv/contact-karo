// API Service Layer - Handles all backend communication

const API_BASE = "/api/v0";

type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  stats?: any;
};

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  // ========== QR Tag APIs ==========

  async getTagById(tagId: string) {
    return this.request<any>(`/tag/${tagId}`);
  }

  async getAllTags(params?: {
    status?: string;
    batch_ref?: string;
    user_id?: string;
    page?: number;
    limit?: number;
  }) {
    const query = new URLSearchParams(
      params as unknown as Record<string, string>,
    ).toString();
    return this.request<any>(`/tag${query ? `?${query}` : ""}`);
  }

  async generateOtp(tagId: string, phone: string) {
    return this.request<any>(`/tag/${tagId}/generateOtp`, {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  }

  async generateOtpToUpdateTag(tagId: string, phone: string) {
    return this.request<any>(`/tag/${tagId}/generateOtpToUpdateTag`, {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  }

  async verifyOtp(tagId: string, otp: string, phone: string) {
    return this.request<any>(`/tag/${tagId}/verifyOtp`, {
      method: "POST",
      body: JSON.stringify({ otp, phone }),
    });
  }

  async activateTag(
    tagId: string,
    data: {
      otp: string;
      name: string;
      phone: string;
      email: string;
      vehicle_no: string;
      vehicle_type: string;
      emergency_contact_1: string;
      emergency_contact_2?: string;
      address?: string;
      whatsapp?: string;
    },
  ) {
    return this.request<any>(`/tag/${tagId}/activate`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTag(tagId: string, data: any) {
    // Use the authenticated update endpoint which expects a POST to /tag/:id/updateTag
    return this.request<any>(`/tag/${tagId}/updateTag`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async sendMessage(tagId: string, violation: string) {
    return this.request<any>(`/tag/${tagId}/sendMessage`, {
      method: "POST",
      body: JSON.stringify({ violation }),
    });
  }

  // ========== Batch APIs ==========

  async getAllBatches() {
    return this.request<any[]>("/batch");
  }

  async getBatchById(batchId: string) {
    return this.request<any>(`/batch/${batchId}`);
  }

  async createBatch(data: { batch_id: string; qty: number; note?: string }) {
    return this.request<any>("/batch", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateBatch(batchId: string, data: any) {
    return this.request<any>(`/batch/${batchId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteBatch(batchId: string) {
    return this.request<any>(`/batch/${batchId}`, {
      method: "DELETE",
    });
  }

  downloadBatchQR(batchId: string) {
    window.open(`${API_BASE}/batch/download/${batchId}`, "_blank");
  }

  // ========== Employee APIs ==========

  async employeeLogin(email: string, password: string) {
    return this.request<any>("/employee/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async employeeLogout() {
    return this.request<any>("/employee/logout", {
      method: "POST",
    });
  }

  async getAllEmployees() {
    return this.request<any[]>("/employee");
  }

  async getEmployeeById(id: string) {
    return this.request<any>(`/employee?id=${id}`);
  }

  async createEmployee(data: {
    name: string;
    phone: string;
    email: string;
    password: string;
    address?: string;
  }) {
    return this.request<any>("/employee", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateEmployee(id: string, data: any) {
    return this.request<any>(`/employee/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiService();
