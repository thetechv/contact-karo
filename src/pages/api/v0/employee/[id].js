import { PrivateController } from "../../../../be/framework/privateController";
import EmployeeService from "../../../../be/services/EmployeeService";

class EmployeeController extends PrivateController {
  constructor() {
    super();
    this.service = new EmployeeService();
  }
  get(req, res) {
    return this.service.getEmployeeById(req, res);
  }
  patch(req, res) {
    return this.service.updateEmployee(req, res);
  }
}

export default new EmployeeController().handler;
