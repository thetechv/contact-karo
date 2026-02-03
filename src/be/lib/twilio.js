import TwilioClient from 'twilio';


class Twilio {
  constructor() {
    this.phoneNumber = '+15042336764';
    this.client = new TwilioClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }

  /**
   * 
   * @param {*} to | phone number without +91
   * @param {*} body | message body
   * @returns {Promise<void>}
   */
  async sendMessage(to, body) {
    const message = await this.client.messages.create({
      body,
      from: this.phoneNumber,
      to :`+91${to}`,
    });
    console.log("Message:",message);
  }
}

const twilio = new Twilio();
export default twilio;