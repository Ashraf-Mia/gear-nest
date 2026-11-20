import { authClient } from "@/lib/auth-client";

export const getTokenFromServer = async (): Promise<string> => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Please login first.");
  }

  return data.token;
};
