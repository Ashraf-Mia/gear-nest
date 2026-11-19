export type TRole = "customer" | "owner" | "admin";

export type TRegisterForm = {
  name: string;
  email: string;
  image: string;
  password: string;
  confirmPassword: string;
};
