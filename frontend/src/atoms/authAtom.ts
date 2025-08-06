import { atom } from "jotai";
import api from "../utils/api";
import type { User, AuthResponse, AuthPayload } from "../types/auth";

// holds current user
export const userAtom = atom<User | null>(null);

// signup
export const signupAtom = atom(
  null,
  async (_get, set, payload: AuthPayload) => {
    try {
      const { data } = await api.post<AuthResponse>("/auth/register", payload);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      set(userAtom, data.user);

      return data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }
);

// login
export const loginAtom = atom(
  null,
  async (_get, set, payload: AuthPayload) => {
    try {
      const { data } = await api.post<AuthResponse>("/auth/login", payload);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      set(userAtom, data.user);

      return data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }
);

// logout
export const logoutAtom = atom(null, async (_get, set) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  set(userAtom, null);
});
