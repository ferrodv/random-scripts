import response from "../utils/response";
import request from '../utils/request';
import TwilioPhone from "../services/twilio/modules/phone.twilio";

export async function handler(event: any) {
  const { twilioAccountSid, twilioAuthToken } = request(event.body);
  try {
    const phones = await TwilioPhone.GetAllPhones(twilioAccountSid, twilioAuthToken);
    let deletedPhones = await Promise.all(
      phones.map(async (phone: any) => {
        return TwilioPhone.DeletePhone(twilioAccountSid, twilioAuthToken, phone.sid)
      })
    );
    return response({ deletedCount: deletedPhones.length, phonesCount: phones.length, phones });
  } catch (e) {
    console.error(e);
    return response({ message: "Not ok" }, 503);
  }
}
