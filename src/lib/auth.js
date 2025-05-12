import { SignJWT, jwtVerify } from "jose";

// Secret for signing JWT
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// Sign a JWT token
export const signJwtToken = async (payload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
};

// Verify the JWT token
export const verifyJwtToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    throw new Error("Invalid token");
  }
};
