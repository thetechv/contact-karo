import { PublicController } from "../../../../be/framework/publicController";
import UserService from "../../../../be/services/UserService";

class UserByIdController extends PublicController {
  constructor() {
    super();
    this.service = new UserService();
  }
  async get(req, res) {
    return this.service.getUserById(req, res);
  }

  async patch(req, res) {
    return this.service.updateUserDetails(req, res);
  }
}

export default new UserByIdController().handler;