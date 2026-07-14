import axios from "axios";
import config from "../../../config";

export default axios.create({
  baseURL: config.jiraApiEndpoint,
  headers: {
    "Authorization" : `Bearer ${config.jimAuthToken}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
    "UserType": "customer",
  },
});

export const createJimApi = (baseURL: string, token: string) => axios.create({
  baseURL: baseURL,
  headers: {
    "auth_token": token,
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});
