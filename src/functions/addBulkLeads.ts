import * as path from 'path';
import * as os from 'os';
import csvToJson from "convert-csv-to-json";
import request from "../utils/request";
import response from "../utils/response";
import JimLeads from "../services/jim/modules/leads.jim";

interface AddBulkLeadsPayload {
  apiEndpoint: string;
  authToken: string;
  csvFileName: string;
  leadStatus: string;
  dispoStatus: string;
  phone: string;
}

export async function handler(event: any) {
  const { apiEndpoint, authToken, csvFileName, leadStatus, dispoStatus, phone } = request(event.body);

  try {
    const csvPath = path.join(os.homedir(), 'Downloads', csvFileName);
    const leads = csvToJson.fieldDelimiter(',').getJsonFromCsv(csvPath);


    const leadsToAdd: any[] = [];
    const createdLeads: any[] = [];
    const failedLeads: any[] = [];

    leads.forEach(lead => {
      if (lead['LeadStatus'] === leadStatus && lead['DispoStatus'] === dispoStatus) {
        leadsToAdd.push({
          email: lead?.['Email'],
          first_name: lead?.['FirstName'],
          last_name: lead?.['LastName'],
          phone,
        });
      };
    });

    for (const lead of leadsToAdd) {
      const result = await JimLeads.createLead(lead, apiEndpoint, authToken);
      if (result === null) {
        failedLeads.push(lead);
      } else {
        createdLeads.push(lead);
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return response({
      leadsToAddCount: leadsToAdd.length,
      leadsToAdd,
      createdLeadsCount: createdLeads.length,
      createdLeads,
      failedLeadsCount: failedLeads.length,
      failedLeads,
      leadsCount: leads.length,
      leads
    });
  } catch (e) {
    console.error(e);
    return response({ message: "Not ok" }, 503);
  }
}
