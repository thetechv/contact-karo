import ApiService from "./baseService";

class TagService extends ApiService {
  constructor() {
    super();
  }

  async getTagById(id) {
    const data = await this.get(`tag/${id}`);
    return data;
  }

  async generateOtp(tagId, phone) {
    const data = await this.post(`tag/${tagId}/generateOtp`, { phone });
    return data;
  }

  async generateOtpToUpdateTag(tagId, phone) {
    const data = await this.post(`tag/${tagId}/generateOtpToUpdateTag`, {
      phone,
    });
    return data;
  }

  async verifyOtp(tagId, otp, phone) {
    const data = await this.post(`tag/${tagId}/verifyOtp`, { otp, phone });
    return data;
  }

  async activateTag(tagId, userData) {
    const data = await this.post(`tag/${tagId}/activate`, userData);
    return data;
  }

  async updateTag(tagId, userData) {
    // Use the authenticated update endpoint implemented on the server
    const data = await this.post(`tag/${tagId}/updateTag`, userData);
    return data;
  }

  async sendMessage(tagId, violation) {
    const data = await this.post(`tag/${tagId}/sendMessage`, { violation });
    return data;
  }
}

const tagService = new TagService();
export default tagService;
