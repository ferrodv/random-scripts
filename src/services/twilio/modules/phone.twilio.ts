import apiTwilio from "../config/api.twilio";

export default class TwilioPhone {

  static async GetAllPhones(
    twilioAccountSid: string,
    twilioAuthToken: string,
    tries = 0
  ): Promise<any> {
    if (tries >= 3) {
      console.log("Could not Get Phone Numbers");
      return null;
    }
    const token = Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64');
    try {
      const config = {
        headers: {
          Authorization: `Basic ${token}`,
        },
      };
      let response: any = await apiTwilio.get(
        `/2010-04-01/Accounts/${twilioAccountSid}/IncomingPhoneNumbers.json`,
        config,
      );
      let phones: any = response.data.incoming_phone_numbers;

      while (!!response.data.next_page_uri) {
        response = await apiTwilio.get(
          response.data.next_page_uri,
          config,
        );
        phones = [...phones, ...response.data.incoming_phone_numbers]
      }

      return phones;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async DeletePhone(
    twilioAccountSid: string,
    twilioAuthToken: string,
    phoneId: string,
    tries = 0
  ): Promise<any> {
    if (tries >= 3) {
      console.log("Could not Delete Phone: ", phoneId);
      return null;
    }
    const token = Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64');
    try {
      const config = {
        headers: {
          Authorization: `Basic ${token}`,
        },
      };
      const response = await apiTwilio.delete(
        `/2010-04-01/Accounts/${twilioAccountSid}/IncomingPhoneNumbers/${phoneId}`,
        config,
      );

      return phoneId;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
