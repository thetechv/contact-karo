import { PublicController } from "@framework/publicController";
import QrTagService from "@service/QrTagService";

class QrTagAssignController extends PublicController {
  constructor() {
    super();
    this.service = new QrTagService();
  }
  async post(req, res) {
    return this.service.activateQr(req, res);
  }
}
export default new QrTagAssignController().handler;