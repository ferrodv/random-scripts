import axios from "axios";
import config from "../../../config";

export default axios.create({
  baseURL: config.jiraApiEndpoint,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  auth: {
    username: config.jiraAdminEmail || "",
    password: config.jiraAdminKey || "",
  },
});
