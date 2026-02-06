import { PublicController } from "../../../../../be/framework/publicController";
import QrTagService from "../../../../../be/services/QrTagService";

class GenerateOtpToUpdateTagController extends PublicController{
    constructor() {
        super();
        this.service = new QrTagService();
      } 
      async post(req, res) {
    return this.service.generateOtpToUpdateTag(req, res);
  }
}

export default new GenerateOtpToUpdateTagController().handler;