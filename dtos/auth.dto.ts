export type LoginDTO = {
  email: string;
  password: string;
};

export type RegisterDTO = {
  email: string;
  password: string;
  name: string;
  role: "CLIENT" | "SELLER";
};
