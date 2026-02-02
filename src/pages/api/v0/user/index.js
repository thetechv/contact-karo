import { PublicController } from "../../../../be/framework/publicController";
import UserService from "../../../../be/services/UserService";

class UserController extends PublicController {
  constructor() {
    super();
    this.service = new UserService();
  }
  async get(req, res) {
    return this.service.getAllUsers(req, res);
  }

  async post(req, res) {
    return this.service.createUser(req, res);
  }
}

export default new UserController().handler;
