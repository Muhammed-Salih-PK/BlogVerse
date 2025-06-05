import { getTokenFromRequest } from "./getTokenFromRequest";
import { hasAccess, verifyJwtToken } from "./auth";
import User from "@/models/User";
import { MESSAGES, STATUS_CODES } from "./constants";
// Constants for status and messages

export const rolesAuth = async (req, roles = []) => {
  const token = getTokenFromRequest(req);
  if (!token) {
    return [
      null,
      { message: MESSAGES.UNAUTHORIZED, status: STATUS_CODES.UNAUTHORIZED },
    ];
  }

  const decodedToken = await verifyJwtToken(token);
  const userId = decodedToken.id;

  // Role check from token
  if (!hasAccess(decodedToken, roles)) {
    return [
      null,
      { message: MESSAGES.FORBIDDEN, status: STATUS_CODES.FORBIDDEN },
    ];
  }

  // Check if user has admin role
  const currentUser = await User.findById(userId);

  if (!currentUser || !hasAccess(currentUser, roles)) {
    return [
      null,
      { message: MESSAGES.FORBIDDEN, status: STATUS_CODES.FORBIDDEN },
    ];
  }

  return [currentUser, null];
};
