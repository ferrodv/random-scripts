import apiVapi from "../config/api.vapi";

export default class VapiPhone {
  static async createTwilioPhone(
    vapiKey: string,
    phoneNumber: string,
    twilioAccountSid: string,
    twilioAuthToken: string,
    friendlyName: string,
    provider = "twilio",
    tries = 0
  ): Promise<any> {
    if (tries >= 3) {
      console.log("Could not create phone: ", phoneNumber);
      return null;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${vapiKey}`,
        },
      };
      const body = {
        provider,
        number: phoneNumber,
        twilioAccountSid,
        twilioAuthToken,
        name: friendlyName
      };
      const response = await apiVapi.post(
        `/phone-number`,
        body,
        config,
      );

      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}