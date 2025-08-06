import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import { loginAtom, logoutAtom } from "../atoms/authAtom";
import { profileAtom, fetchProfileAtom } from "../atoms/profileAtom";
import { toast } from "react-toastify";
import { isTokenValid, getTokenExpiry } from "../utils/auth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // 👈 new state
  const [, login] = useAtom(loginAtom);
  const [, logout] = useAtom(logoutAtom);
  const [, fetchProfile] = useAtom(fetchProfileAtom);
  const profile = useAtomValue(profileAtom);
  const token = localStorage.getItem("token");
  const formRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // ✅ Auto redirect if token valid
  useEffect(() => {
    const checkAuth = async () => {
      if (token && isTokenValid(token)) {
        try {
          if (!profile) {
            await fetchProfile();
          }
          const user = profile || JSON.parse(localStorage.getItem("profile")!);
          if (user?.role) {
            navigate(user.role === "admin" ? "/admin" : "/dashboard", {
              replace: true,
            });
          }
        } catch {
          // if fetching profile fails, clear auth
          logout();
        }
      }
      setCheckingAuth(false);
    };
    checkAuth();
  }, [token, profile, fetchProfile, logout, navigate]);

  // ✅ Auto logout when token expires
  useEffect(() => {
    if (token && isTokenValid(token)) {
      const expiry = getTokenExpiry(token);
      if (expiry) {
        const timeout = expiry - Date.now();
        const timer = setTimeout(() => {
          toast.info("Session expired. Please log in again.");
          logout();
          navigate("/", { replace: true });
        }, timeout);
        return () => clearTimeout(timer);
      }
    }
  }, [token, logout, navigate]);

  // ✅ Animate form
  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  // ✅ Handle login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login({ email, password });
      toast.success("Login successful! Redirecting...");
      navigate(res.user?.role === "admin" ? "/admin" : "/dashboard", {
        replace: true,
      });
    } catch (err: any) {
      toast.error(err.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    // 👇 simple loader while checking auth
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-3">
      <div
        ref={formRef}
        className="max-w-md w-full bg-white px-5 py-10 rounded-xl shadow-xl space-y-8"
      >
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome back!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Log in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
