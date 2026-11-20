import { authClient } from "@/lib/auth-client";

// We keep the token in memory so we do not ask the auth server for a new
// token on every button click. It is fetched again when it is close to
// expiring.
let cachedToken: string | null = null;
let cachedTokenExpiresAt = 0;

// Read the expiry time ("exp") from a JWT without any extra package.
function getTokenExpiry(token: string) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));

    return typeof payload.exp === "number" ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

// Call this after login or logout so the next request uses the right user.
export function clearTokenCache() {
  cachedToken = null;
  cachedTokenExpiresAt = 0;
}

export const getTokenFromClient = async (): Promise<string> => {
  // Reuse the saved token until it is 30 seconds away from expiring.
  if (cachedToken && cachedTokenExpiresAt > Date.now() + 30_000) {
    return cachedToken;
  }

  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Please login first.");
  }

  cachedToken = data.token;
  cachedTokenExpiresAt = getTokenExpiry(data.token);

  return cachedToken;
};
