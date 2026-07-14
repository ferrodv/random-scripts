import { createJimApi } from "../config/api.jim";

export default class JimLeads {
  static async createLead(lead: any, apiEndpoint: string, authToken: string, retries = 0): Promise<any | null> {
    if (retries >= 3) {
      console.error("Failed to create lead");
      return null;
    }
    const apiJim = createJimApi(apiEndpoint, authToken);
    try {
      const response = await apiJim.post(``, lead);
      return response;
    } catch (error) {
      console.error(error);
      await new Promise(resolve => setTimeout(resolve, 500));
      return this.createLead(lead, apiEndpoint, authToken, retries + 1);
    }
  }
}
