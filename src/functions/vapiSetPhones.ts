import * as path from 'path';
import * as os from 'os';
import csvToJson from "convert-csv-to-json";

import response from "../utils/response";
import request from '../utils/request';
import VapiPhone from '../services/vapi/modules/phone.vapi';

export async function handler(event: any) {
  const { vapiKey, twilioAccountSid, twilioAuthToken, provider, file } = request(event.body);
  const csvPath = path.join(os.homedir(), 'Downloads', file);
  const phones = csvToJson.fieldDelimiter(',').getJsonFromCsv(csvPath);

  async function twilioProvider(): Promise<any[]> {
    const results: any[] = [];
    await Promise.all(
      phones.map(async (phone: any) => {
        const result = await VapiPhone.createTwilioPhone(vapiKey, phone.PhoneNumber, twilioAccountSid, twilioAuthToken, String(phone.FriendlyName).slice(0, 2))
        results.push({
          vapiPhoneId: result.id,
          phoneNumber: result.number,
          areaCode: result.name
        })
      })
    );
    await Promise.resolve(results);
    return results
  }

  try {
    let result: any;
    switch (provider) {
      case 'twilio':
        result = await twilioProvider();
        break;
      default:
        result = await twilioProvider();
    }
    await Promise.resolve(result);
    return response({ added: result.length, phones: result });
  } catch (e) {
    console.error(e);
    return response({ message: "Not ok" }, 503);
  }
}
