import { PublicController } from "../../../../be/framework/publicController";
import EmployeeService from "../../../../be/services/EmployeeService";

class EmployeeLogoutController extends PublicController {
  constructor() {
    super();
    this.service = new EmployeeService();
  }

  async post(req, res) {
    return this.service.logoutEmployee(req, res);
  }
}

export default new EmployeeLogoutController().handler;
