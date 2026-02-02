import { PublicController } from "@framework/publicController";
import QrBatchService from "@service/QrBatchService";

class QrBatchDownloadController extends PublicController {
  constructor() {
    super();
    this.service = new QrBatchService();
  }
  async get(req, res) {
    return this.service.downloadBatchQRZip(req, res);
  }
}
export default new QrBatchDownloadController().handler;