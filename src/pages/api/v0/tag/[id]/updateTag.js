import { PrivateUserController } from "../../../../../be/framework/privateUserController";
import QrTagService from "../../../../../be/services/QrTagService";

class UpdateTagController extends PrivateUserController{
    constructor() {
        super();
        this.service = new QrTagService();
      } 
      async post(req, res) {
    return this.service.updateTag(req, res);
  }
}

export default new UpdateTagController().handler;