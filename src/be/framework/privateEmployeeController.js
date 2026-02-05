import { Controller as BaseController } from "inrext-framework";
import { loginAuth } from "../middlewares/loginAuth.js";

export class PrivateEmployeeController extends BaseController {
  constructor() {
    super();
    this.userAuth = loginAuth;
  }
}

