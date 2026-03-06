import Twilio from "twilio";

export default function handler(req, res) {
    try {
        const { customer } = req.query;

        if (!customer) {
            return res.status(400).send("Customer number is required");
        }

        const twiml = new Twilio.twiml.VoiceResponse();

        twiml.say("Connecting your call.");

        const dial = twiml.dial({
            callerId: process.env.TWILIO_PHONE_NUMBER || "+15042336764",
        });

        dial.number(customer);

        res.setHeader("Content-Type", "text/xml");
        return res.status(200).send(twiml.toString());
    } catch (error) {
        console.error("connect-customer error:", error);
        return res.status(500).send("Internal Server Error");
    }
}