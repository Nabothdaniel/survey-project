import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import { adminSignupAtom } from "../atoms/authAtom";
import { toast } from 'react-toastify'

const AdminSignup: React.FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)
    const signup = useSetAtom(adminSignupAtom)
    const route = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        try {
            const payload = { name, email, password };
            await signup(payload)
            toast.success("Admin created..");
            route('/')
        } catch (error) {
            console.log('Error:', error)
            toast.error(`${error}`)
        } finally {
            setLoading(false)
        }
    };

    const switchToLogin = () => {
        route("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-3">
            <div className="max-w-md w-full space-y-8 bg-white  rounded-lg px-5 py-10  shadow-xl">
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Signup As Admin
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Create surveys for a wide range of audience
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className=" space-y-4">
                        <input
                            type="text"
                            required
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded-lg p-3  border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
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
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <button
                        onClick={switchToLogin}
                        className="text-blue-600 hover:text-blue-500"
                    >
                        Already have an account? Sign in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSignup;
