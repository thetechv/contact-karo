import { PublicController } from "../../../../be/framework/publicController";
import EmployeeService from "../../../../be/services/EmployeeService";

class EmployeeLoginController extends PublicController {
  constructor() {
    super();
    this.service = new EmployeeService();
  }

  async post(req, res) {
    return this.service.loginEmployee(req, res);
  }
}

export default new EmployeeLoginController().handler;
