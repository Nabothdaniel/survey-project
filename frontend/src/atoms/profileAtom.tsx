// src/atoms/profileAtom.ts
import { atom } from "jotai";
import api from "../utils/api";
import type { Profile } from "../types/auth";

export const profileAtom = atom<Profile | null>(
  localStorage.getItem("profile")
    ? (JSON.parse(localStorage.getItem("profile")!) as Profile)
    : null
);

export const fetchProfileAtom = atom(
  null,
  async (_get, set) => {
    try {
      const { data } = await api.get<{ success: boolean; user: Profile }>("/auth/profile");

      

      // extract only the user object
      const profile = data.user;

      localStorage.setItem("profile", JSON.stringify(profile));
      set(profileAtom, profile);

      return profile;
    } catch (error: any) {
      localStorage.removeItem("profile");
      set(profileAtom, null);
      throw error.response?.data || error.message;
    }
  }
);
