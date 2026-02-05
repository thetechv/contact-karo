import { PublicController } from "../../../../../be/framework/publicController";
import QrTagService from "../../../../../be/services/QrTagService";

class VerifyOtpController extends PublicController{
    constructor() {
        super();
        this.service = new QrTagService();
      } 
      async post(req, res) {
    return this.service.verifyOtp(req, res);
  }
}

export default new VerifyOtpController().handler;