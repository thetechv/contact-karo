import { PublicController } from "@/be/framework/publicController";
import QrTagService from "@/be/services/QrTagService";

class QrTagsByBatchController extends PublicController {
  constructor() {
    super();
    this.service = new QrTagService();
  }
  async get(req, res) {
    // The service method `getAllTags` uses `req.query.batch_ref`.
    // The `[id]` from the URL is available in `req.query.id`.
    // We map `id` to `batch_ref` for the service method.
    req.query.batch_ref = req.query.id;
    return this.service.getAllTags(req, res);
  }
}

export default new QrTagsByBatchController().handler;
