// src/components/routes/ProtectedRoute.tsx
import { useAtomValue } from "jotai";
import { Navigate } from "react-router-dom";
import { profileAtom } from "../atoms/profileAtom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const profile = useAtomValue(profileAtom);

  if (!profile) {
    return <Navigate to="/" replace />; 
  }

  return <>{children}</>;
}
