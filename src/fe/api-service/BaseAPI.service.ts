class BaseAPIService {
  protected baseURL: string;

  constructor(baseURL: string = "/api/v0") {
    this.baseURL = baseURL;
  }

  protected async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<{ success: boolean; data?: T; message?: string }> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
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
}

export default BaseAPIService;
