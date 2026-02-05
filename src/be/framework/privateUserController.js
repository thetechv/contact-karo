import { Controller as BaseController } from "inrext-framework";
import { userAuth } from "../middlewares/userAuth";

export class PrivateUserController extends BaseController {
  constructor() {
    super();
    this.userAuth = userAuth;
  }
}

