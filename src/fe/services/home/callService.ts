import BaseAPIService from "@/fe/api-service/BaseAPI.service";

interface SetupCallRequest {
  phone: string;
}

interface SetupCallResponse {
  message: string;
  data: string; // Phone number to display
}

class CallService extends BaseAPIService {
  async setupMaskedCall(
    tagId: string,
    request: SetupCallRequest,
  ): Promise<{ success: boolean; data?: string; message?: string }> {
    return this.request<string>(`/tag/${tagId}/call`, {
      method: "POST",
      body: JSON.stringify(request),
    });
  }
}

export default new CallService();
