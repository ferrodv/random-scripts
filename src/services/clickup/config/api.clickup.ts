import axios from "axios";
import config from "../../../config";

export default axios.create({
  baseURL: "https://api.clickup.com",
  headers: {
    Authorization: `${config.clickupAdminKey}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
