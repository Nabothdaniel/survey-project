export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface AuthPayload {
  name?: string; // optional for login
  email: string;
  password: string;
}

export interface Profile {
  id: number | string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

