export function getTokenFromRequest(req) {
  const token = req.cookies.get("authToken")?.value;

  return token;
}
