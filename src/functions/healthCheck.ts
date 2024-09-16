import response from "../utils/response";

export async function handler() {
  try {
    return response({ message: "Ok" });
  } catch (e) {
    console.error(e);
    return response({ message: "Not ok" }, 503);
  }
}
