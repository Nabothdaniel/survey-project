// src/hooks/useProfile.ts
import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { profileAtom, fetchProfileAtom } from "../atoms/profileAtom";

export default function useProfile() {
  const profile = useAtomValue(profileAtom);     
  const fetchProfile = useSetAtom(fetchProfileAtom); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !profile) {
      console.log("Fetching profile...");
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  return { profile, fetchProfile, loading: !profile };
}
