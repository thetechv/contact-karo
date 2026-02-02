import { PublicController } from "../../../../be/framework/publicController";
import QrTagService from "../../../../be/services/QrTagService";

class QrTagController extends PublicController {
  constructor() {
    super();
    this.service = new QrTagService();
  }
  async get(req, res) {
    return this.service.getAllTags(req, res);
  }
  async post(req, res) {
    return this.service.createTag(req, res);
  }
}
export default new QrTagController().handler;
