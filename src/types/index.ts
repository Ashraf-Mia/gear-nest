export type TRole = "customer" | "owner" | "admin";

// Users can register as a customer or an owner, but never as an admin.
export type TRegisterRole = Exclude<TRole, "admin">;

export type TRegisterForm = {
  name: string;
  email: string;
  image: string;
  role: TRegisterRole;
  password: string;
  confirmPassword: string;
};
