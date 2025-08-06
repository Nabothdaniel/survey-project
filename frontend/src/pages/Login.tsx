import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { useAtom } from 'jotai'
import { loginAtom } from "../atoms/authAtom";
import { toast } from 'react-toastify'

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [, login] = useAtom(loginAtom)
  const formRef = useRef<HTMLDivElement>(null);

  const route = useNavigate();

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success("Login successful! Redirecting....");
      setTimeout(()=> route("/dashboard"),3000)
    } catch (err: any) {
      toast.error(err.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const switchToSignup = () => {
    route("/signup");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-3">
      <div ref={formRef} className="max-w-md w-full bg-white px-5 py-10 rounded-xl shadow-xl space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome back!</h2>
          <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
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
          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {loading ? (
              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <button onClick={switchToSignup}  className="text-blue-600 hover:text-blue-500">
            Don’t have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
