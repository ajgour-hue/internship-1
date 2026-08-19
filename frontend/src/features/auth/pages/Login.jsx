import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import ContinueWithGoogle from "../component/ContinueWithGoogle";
import toast from "react-hot-toast";

const Login = () => {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await handleLogin({
                email: formData.email,
                password: formData.password
            });

            toast.success("Login successful 🎉");

            navigate("/");
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                "Invalid email or password";

            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen lg:h-screen overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row bg-white">

            {/* Left Section */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden bg-neutral-100">

                <img
                    src="/snitch_editorial_warm.png"
                    alt="FashionKart Fashion Editorial"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-[20s] ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />

                <div className="relative z-10 p-10 xl:p-16 flex flex-col h-full justify-between w-full max-w-2xl">

                    <span className="text-xs font-semibold tracking-[0.32em] uppercase text-black">
                        FashionKart
                    </span>

                    <div className="mt-auto">

                        <p className="text-4xl xl:text-6xl font-semibold leading-[1.1] mb-4 xl:mb-6 text-black">
                            Welcome <br />
                            back.
                        </p>

                        <p className="max-w-md text-base xl:text-lg leading-relaxed text-neutral-500">
                            Sign in to access your account and explore
                            clothing available for swapping.
                        </p>

                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-8 sm:px-8 sm:py-10 lg:p-8 xl:p-12 lg:h-screen lg:overflow-y-auto bg-white">

                <div className="w-full max-w-sm sm:max-w-md my-auto">

                    {/* Mobile Top Bar */}
                    <div className="lg:hidden mb-8 flex items-center justify-between">

                        <span className="text-xs font-semibold tracking-[0.32em] uppercase text-black">
                            FashionKart
                        </span>

                        <Link
                            to="/register"
                            className="text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors"
                        >
                            Sign Up
                        </Link>

                    </div>

                    {/* Heading */}
                    <div className="mb-8">

                        <h1 className="text-4xl sm:text-5xl font-semibold leading-tight mb-3 text-black">
                            Welcome Back
                        </h1>

                        <p className="text-sm text-neutral-500">
                            Sign in to continue your journey.
                        </p>

                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 px-4 py-3 text-sm rounded-lg bg-red-50 border border-red-200 text-red-600">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5"
                    >

                        {/* Email */}
                        <div className="flex flex-col">

                            <label
                                htmlFor="email"
                                className="text-xs uppercase tracking-[2px] font-medium mb-2 text-neutral-600"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                                className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm outline-none focus:border-black focus:ring-4 focus:ring-neutral-100 transition-all"
                                placeholder="Enter your email"
                            />

                        </div>

                        {/* Password */}
                        <div className="flex flex-col">

                            <label
                                htmlFor="password"
                                className="text-xs uppercase tracking-[2px] font-medium mb-2 text-neutral-600"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
                                className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm outline-none focus:border-black focus:ring-4 focus:ring-neutral-100 transition-all"
                                placeholder="Enter your password"
                            />

                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full py-3.5 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >

                            {loading && (
                                <svg
                                    className="animate-spin h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />

                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                            )}

                            {loading
                                ? "Signing In..."
                                : "Sign In"}

                        </button>

                        <ContinueWithGoogle />

                        {/* Footer */}
                        <div className="text-center mt-2">

                            <span className="text-sm text-neutral-500">
                                Don't have an account?
                            </span>{" "}

                            <Link
                                to="/register"
                                className="text-sm uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors"
                            >
                                Sign Up
                            </Link>

                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;