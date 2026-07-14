import response from "../utils/response";
import request from "../utils/request";
import TwilioPhone from "../services/twilio/modules/phone.twilio";

export async function handler(event: any) {
  try {
    const { twilioAccountSid, twilioAuthToken } = request(event.body);

    if (!twilioAccountSid || !twilioAuthToken) {
      return response(
        { message: "Missing twilioAccountSid or twilioAuthToken" },
        400
      );
    }

    const phones = await TwilioPhone.GetAllPhones(
      twilioAccountSid,
      twilioAuthToken
    );

    if (!phones) {
      return response({ message: "Failed to get phones" }, 500);
    }

    const deletedPhones = await Promise.all(
      phones.map(async (phone: any) => {
        return TwilioPhone.DeletePhone(
          twilioAccountSid,
          twilioAuthToken,
          phone.sid
        );
      })
    );

    return response({
      deletedCount: deletedPhones.length,
      phonesCount: phones.length,
      phones,
    });
  } catch (e) {
    console.error("Handler error:", e);
    return response({ message: "Not ok", error: String(e) }, 503);
  }
}
