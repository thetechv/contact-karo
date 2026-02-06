import { Controller as BaseController } from "inrext-framework";
import { publicAuth } from "../middlewares/publicAuth";

export class PublicController extends BaseController {
  constructor() {
    super();
    this.userAuth = publicAuth;
    // this.skipAuth = ["get", "post", "put", "delete"];
  }
}

