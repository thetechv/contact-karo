import { PublicController } from "../../../../be/framework/publicController";
import QrBatchService from "../../../../be/services/QrBatchService";

class QrBatchByIdController extends PublicController {
  constructor() {
    super();
    this.service = new QrBatchService();
  }
  async get(req, res) {
    return this.service.getBatchById(req, res);
  }
  async patch(req, res) {
    return this.service.updateBatch(req, res);
  }
  async delete(req, res) {
    return this.service.deleteBatch(req, res);
  }
}
export default new QrBatchByIdController().handler;
