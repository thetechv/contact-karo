import { PublicController } from "../../../../be/framework/publicController";
import QrBatchService from "../../../../be/services/QrBatchService";

class QrBatchController extends PublicController {
  constructor() {
    super();
    this.service = new QrBatchService();
  }
  async get(req, res) {
    return this.service.getAllBatches(req, res);
  }
  async post(req, res) {
    return this.service.createBatch(req, res);
  }
}
export default new QrBatchController().handler;
