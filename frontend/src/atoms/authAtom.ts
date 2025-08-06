import { atom } from "jotai";
import api from "../utils/api";
import type { User, AuthResponse, AuthPayload } from "../types/auth";
import { profileAtom } from "./profileAtom";

// init from localStorage
const storedUser = localStorage.getItem("user");
export const userAtom = atom<User | null>(
  storedUser ? JSON.parse(storedUser) as User : null
);


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
         // store the user as profile
      localStorage.setItem("profile", JSON.stringify(data.user));

      return data;

    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }
);

export const adminSignupAtom = atom(
  null,
  async (_get, set, payload: AuthPayload) => {
    try {
      const { data } = await api.post<AuthResponse>("/admin/create-admin", payload);

      localStorage.setItem("token", data.token);
      localStorage.setItem("profile", JSON.stringify(data.user));

      set(userAtom, data.user);
      set(profileAtom, data.user);

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
  localStorage.removeItem("profile");

  set(userAtom, null);
  set(profileAtom, null);
});



