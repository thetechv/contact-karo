import TwilioClient from 'twilio';


class Twilio {
  constructor() {
    this.phoneNumber = '+15042336764';
    this.whatsappNumber = 'whatsapp:+15557908540';
    this.client = new TwilioClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    this.templates = {
      reminder_template1: "HX65fdfb9b8b5e4266af18f5f00e4b4094",
    }
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
      to: `+91${to}`,
    });
    console.log("Message:", message);
  }

  async sendWhatsappMessage(to, name, vehicle_no, violation) {
    try {
      console.log("sending whatsapp message to", to, name, vehicle_no, violation);
      await this.client.messages.create({
        from: this.whatsappNumber,
        to: `whatsapp:+91${to}`,
        contentSid: this.templates.reminder_template1,
        contentVariables: JSON.stringify({
          1: name,
          2: vehicle_no,
          3: violation
        })
      });
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
    }
  }
}

const twilio = new Twilio();
export default twilio;