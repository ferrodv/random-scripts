import axios from "axios";

export default axios.create({
  baseURL: "https://api.vapi.ai",
  headers: {
    "Content-Type": "application/json",
  },
});
