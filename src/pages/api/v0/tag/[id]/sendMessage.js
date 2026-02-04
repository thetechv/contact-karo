import { PublicController } from "@framework/publicController";
import QrTagService from "@service/QrTagService";

class SendMessageController extends PublicController {
  constructor() {
    super();
    this.service = new QrTagService();
  }

  /**
   * TODO: Rate limiting: same IP, max 1 attempt per 1 minute
   */
  async post(req, res) {
    return this.service.sendMessage(req, res);
  }
}

export default new SendMessageController().handler;
