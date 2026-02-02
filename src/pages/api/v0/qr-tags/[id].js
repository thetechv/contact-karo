import { PublicController } from "../../../../be/framework/publicController";
import QrTagService from "../../../../be/services/QrTagService";

class QrTagByIdController extends PublicController {
  constructor() {
    super();
    this.service = new QrTagService();
  }
  async get(req, res) {
    return this.service.getTagById(req, res);
  }
  async patch(req, res) {
    return this.service.updateTag(req, res);
  }
  async delete(req, res) {
    return this.service.deleteTag(req, res);
  }
}
export default new QrTagByIdController().handler;
