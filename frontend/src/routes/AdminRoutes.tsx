// src/components/routes/AdminWrapper.tsx
import { useAtomValue } from "jotai";
import { Navigate } from "react-router-dom";
import { profileAtom } from "../atoms/profileAtom";

export default function AdminWrapper({ children }: { children: React.ReactNode }) {
  const profile = useAtomValue(profileAtom);

  if (!profile) {
    return <Navigate to="/" replace />;
  }

  if (profile.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
