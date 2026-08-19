import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import ContinueWithGoogle from "../component/ContinueWithGoogle";
import toast from "react-hot-toast";

const Register = () => {
    const { handleRegister } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        contactNumber: "",
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
            await handleRegister({
                email: formData.email,
                contact: formData.contactNumber,
                password: formData.password,
                fullname: formData.fullName
            });

            toast.success(
                "Account created successfully 🎉"
            );

            navigate("/");
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                "Something went wrong. Please try again.";

            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen lg:h-screen overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row bg-white">

            {/* Left Section */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden bg-neutral-100 border-r border-neutral-200">

                <img
                    src="/snitch_editorial_warm.webp"
                    alt="FashionKart Fashion Editorial"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-[20s] ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

                <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white opacity-60" />

                <div className="relative z-10 p-10 xl:p-16 flex flex-col h-full justify-between w-full max-w-2xl">

                    <span className="text-xs font-medium tracking-[0.32em] uppercase text-neutral-900">
                        FashionKart
                    </span>

                    <div className="mt-auto">

                        <p className="text-4xl xl:text-6xl font-semibold leading-[1.1] mb-4 xl:mb-6 text-neutral-900">
                            Define your <br />
                            <span className="text-neutral-500">
                                style.
                            </span>
                        </p>

                        <p className="max-w-md text-base xl:text-lg leading-relaxed text-neutral-500">
                            Join the FashionKart community and
                            discover clothing you can swap with others.
                        </p>

                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-8 sm:px-8 sm:py-10 lg:p-8 xl:p-12 lg:h-screen lg:overflow-y-auto bg-white">

                <div className="w-full max-w-sm sm:max-w-md my-auto">

                    {/* Mobile Header */}
                    <div className="lg:hidden mb-8 flex items-center justify-between">

                        <span className="text-xs font-medium tracking-[0.32em] uppercase text-neutral-900">
                            FashionKart
                        </span>

                        <Link
                            to="/login"
                            className="text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors"
                        >
                            Sign In
                        </Link>

                    </div>

                    {/* Heading */}
                    <div className="mb-8">

                        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
                            <i className="ri-user-add-line text-2xl text-neutral-500"></i>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-[2.6rem] font-semibold leading-tight mb-3 text-neutral-900">
                            Create Account
                        </h1>

                        <p className="text-sm text-neutral-500">
                            Create your FashionKart account and start swapping.
                        </p>

                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5"
                    >

                        {/* Full Name */}
                        <div className="flex flex-col gap-2">

                            <label
                                htmlFor="fullName"
                                className="text-xs uppercase tracking-[3px] text-neutral-400"
                            >
                                Name
                            </label>

                            <input
                                id="fullName"
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                autoComplete="name"
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 rounded-lg bg-neutral-100 outline-none focus:ring-2 focus:ring-black transition"
                            />

                        </div>

                        {/* Contact */}
                        <div className="flex flex-col gap-2">

                            <label
                                htmlFor="contactNumber"
                                className="text-xs uppercase tracking-[3px] text-neutral-400"
                            >
                                Contact Number
                            </label>

                            <input
                                id="contactNumber"
                                type="tel"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                required
                                autoComplete="tel"
                                inputMode="numeric"
                                maxLength={10}
                                placeholder="Enter your phone number"
                                className="w-full px-4 py-3 rounded-lg bg-neutral-100 outline-none focus:ring-2 focus:ring-black transition"
                            />

                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-2">

                            <label
                                htmlFor="email"
                                className="text-xs uppercase tracking-[3px] text-neutral-400"
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
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 rounded-lg bg-neutral-100 outline-none focus:ring-2 focus:ring-black transition"
                            />

                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2">

                            <label
                                htmlFor="password"
                                className="text-xs uppercase tracking-[3px] text-neutral-400"
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
                                autoComplete="new-password"
                                minLength={6}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 rounded-lg bg-neutral-100 outline-none focus:ring-2 focus:ring-black transition"
                            />

                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full bg-black text-white py-3 rounded-full hover:bg-neutral-800 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
                                ? "Signing Up..."
                                : "Sign Up"}

                        </button>

                        {/* Google */}
                        <ContinueWithGoogle />

                        {/* Footer */}
                        <div className="text-center mt-2">

                            <span className="text-sm text-neutral-500">
                                Already have an account?{" "}
                            </span>

                            <Link
                                to="/login"
                                className="text-sm font-medium text-black hover:underline"
                            >
                                Sign In
                            </Link>

                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;