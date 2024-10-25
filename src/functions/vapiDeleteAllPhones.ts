import response from "../utils/response";
import request from '../utils/request';
import VapiPhone from '../services/vapi/modules/phone.vapi';

export async function handler(event: any) {
  const { vapiKey } = request(event.body);
  try {
    const phones = await VapiPhone.GetAllPhones(vapiKey);
    let deletedPhones = await Promise.all(
      phones.map(async (phone: any) => {
        return VapiPhone.DeletePhone(vapiKey, phone.id)
      })
    );

    return response({ deletedCount: deletedPhones.length, phonesCount: phones.length, deletedPhones, phones });
  } catch (e) {
    console.error(e);
    return response({ message: "Not ok" }, 503);
  }
}
