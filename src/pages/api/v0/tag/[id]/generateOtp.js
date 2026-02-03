import { PublicController } from "@framework/publicController";
import twilio from "@/be/lib/twilio";


class GenerateOtpController extends PublicController {
  constructor() {
    super();
  }
  /*
   * TODO: 
   * Genererate OTP only if Tag is available
   * Save OTP in Tag.otp.code, expires_at, attempts, last_attempt_at
   * Send OTP to phone number
   * Return success or error
   * Rate limiting: same IP, max 1 attempt per 1 minute
   */
  async post(req, res) {
    const tagId = req?.params?.id;
    const phone = req?.body?.phone;
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("Otp:",tagId,phone,otp);
    twilio.sendMessage(phone, `Your OTP is ${otp}`);
    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  }
}

export default new GenerateOtpController().handler;