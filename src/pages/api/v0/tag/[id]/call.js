import { PublicController } from "@framework/publicController";
import QrTagService from "@service/QrTagService";

class CallController extends PublicController {
    constructor() {
        super();
        this.service = new QrTagService();
    }

    async post(req, res) {
        return this.service.call(req, res);
    }
}

export default new CallController().handler;