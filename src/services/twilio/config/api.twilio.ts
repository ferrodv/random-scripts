import axios from "axios";
import config from "../../../config";

export default axios.create({
  baseURL: "https://api.twilio.com",
  headers: {
    "Content-Type": "application/json",
  },
});
