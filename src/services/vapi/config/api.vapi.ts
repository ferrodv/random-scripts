import axios from "axios";
import config from "../../../config";

export default axios.create({
  baseURL: "https://api.vapi.ai",
  headers: {
    "Content-Type": "application/json",
  },
});
