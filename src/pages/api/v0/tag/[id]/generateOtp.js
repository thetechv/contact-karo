import { PublicController } from "@framework/publicController";
import QrTagService from "@service/QrTagService";

class GenerateOtpController extends PublicController {
  constructor() {
    super();
    this.service = new QrTagService();
  }

  async post(req, res) {
    return this.service.generateOtp(req, res);
  }
}

export default new GenerateOtpController().handler;