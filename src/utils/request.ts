export default function request(body: any) {
  if (typeof body === "object") return body;
  return JSON.parse(body.replaceAll("\n", " "));
}
