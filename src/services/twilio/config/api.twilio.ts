import axios from "axios";

export default axios.create({
  baseURL: "https://api.twilio.com",
  headers: {
    "Content-Type": "application/json",
  },
});
