import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../../auth/hook/useAuth.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getOptimizedImageUrl } from "../../shared/image.util.js";

const MAX_IMAGE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const Profile = () => {
    const navigate = useNavigate();
    const { handleUpdateProfile, handleGetMe } = useAuth();

    const user = useSelector((s) => s.auth.user);
    const authLoading = useSelector((s) => s.auth.loading);

    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        fullname: "",
        contact: "",
        profileImage: "",
        city: "",
        state: "",
        pincode: "",
    });

    /* ── Image upload state ─────────────────────── */
    const fileInputRef = useRef(null);
    const [imageFile, setImageFile] = useState(null);       // File object to upload
    const [imagePreview, setImagePreview] = useState("");   // local object URL for instant preview
    const [isDragging, setIsDragging] = useState(false);
    const [uploadError, setUploadError] = useState("");

    /* ── Seed form from Redux user ──────────────── */
    useEffect(() => {
        if (user) {
            setForm({
                fullname: user.fullname || "",
                contact: user.contact || "",
                profileImage: user.profileImage || "",
                city: user.location?.city || "",
                state: user.location?.state || "",
                pincode: user.location?.pincode || "",
            });
        }
    }, [user]);

    /* ── Redirect if not logged in ──────────────── */
    useEffect(() => {
        if (!authLoading && !user) navigate("/login");
    }, [authLoading, user]);

    /* ── Cleanup object URL on unmount / change ─── */
    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    /* ── Handlers ───────────────────────────────── */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const validateAndSetFile = (file) => {
        setUploadError("");
        if (!file) return;

        if (!ACCEPTED_TYPES.includes(file.type)) {
            setUploadError("Please upload a JPG, PNG, WEBP or GIF image.");
            return;
        }
        if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
            setUploadError(`Image must be under ${MAX_IMAGE_MB}MB.`);
            return;
        }

        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleFileSelect = (e) => {
        validateAndSetFile(e.target.files?.[0]);
        e.target.value = ""; // allow re-selecting the same file
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        validateAndSetFile(e.dataTransfer.files?.[0]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleRemoveImage = () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImageFile(null);
        setImagePreview("");
        setUploadError("");
        setForm((p) => ({ ...p, profileImage: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Build a multipart payload when a new image was picked, otherwise
            // fall back to the existing stored profileImage value.
            let payload;
            if (imageFile) {
                payload = new FormData();
                payload.append("fullname", form.fullname);
                payload.append("contact", form.contact);
                payload.append("city", form.city);
                payload.append("state", form.state);
                payload.append("pincode", form.pincode);
                payload.append("profileImage", imageFile);
            } else {
                payload = {
                    fullname: form.fullname,
                    contact: form.contact,
                    profileImage: form.profileImage,
                    location: {
                        city: form.city,
                        state: form.state,
                        pincode: form.pincode,
                    },
                };
            }

            await handleUpdateProfile(payload);

            // Re-fetch latest user data
            await handleGetMe();
            setImageFile(null);
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            setImagePreview("");
            toast.success("Profile updated successfully");
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to update profile"
            );
        } finally {
            setSaving(false);
        }
    };

    /* ── Avatar helpers ─────────────────────────── */
    const initials = (user?.fullname || "U")
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const bannerAvatarUrl = form.profileImage
        ? getOptimizedImageUrl(form.profileImage, 160, 160)
        : null;

    // What the upload widget itself should preview: freshly picked file first,
    // then whatever is already saved on the profile.
    const widgetPreviewUrl =
        imagePreview || (form.profileImage
            ? getOptimizedImageUrl(form.profileImage, 96, 96)
            : "");

    /* ── Input classes ──────────────────────────── */
    const inputCls =
        "w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/5 transition";
    const labelCls =
        "block text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-1.5";

    /* ── Loading skeleton ───────────────────────── */
    if (authLoading) {
        return (
            <main className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 animate-pulse" />
            </main>
        );
    }

    /* ═══════════════════════════════════════════════
       Render
       ═══════════════════════════════════════════════ */
    return (
        <main className="min-h-screen bg-[#fafafa]">

            {/* ── Header ─────────────────────────── */}
            <section className="px-4 sm:px-6 md:px-10 lg:px-20 pt-8 sm:pt-14 pb-2">
                <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400 font-medium mb-3 sm:mb-4">
                    FashionKart · Account
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 leading-tight">
                    My Profile
                </h1>
                <p className="mt-3 text-neutral-500 text-sm sm:text-[15px] max-w-lg">
                    Manage your personal information and location settings.
                </p>
            </section>

            {/* ── Card ───────────────────────────── */}
            <section className="px-4 sm:px-6 md:px-10 lg:px-20 py-6 sm:py-10">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-2xl mx-auto sm:mx-0 bg-white rounded-2xl border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
                >

                    {/* ── Avatar banner ──────────── */}
                    <div className="relative bg-gradient-to-br from-neutral-100 to-neutral-50 px-6 sm:px-8 pt-8 sm:pt-10 pb-12 sm:pb-16 flex flex-col items-center">
                        {/* Avatar */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden shrink-0">
                            {(imagePreview || bannerAvatarUrl) ? (
                                <img
                                    src={imagePreview || bannerAvatarUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-xl sm:text-2xl font-bold text-neutral-400">
                                    {initials}
                                </span>
                            )}
                        </div>

                        <h2 className="mt-4 text-base sm:text-lg font-semibold text-neutral-900 text-center break-words">
                            {user?.fullname || "User"}
                        </h2>
                        <p className="text-xs text-neutral-400 mt-0.5 text-center break-all px-4">
                            {user?.email}
                        </p>

                        {/* Role badge */}
                        {user?.role && (
                            <span className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-neutral-500 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                                <i className="ri-shield-check-line text-xs" />
                                {user.role}
                            </span>
                        )}
                    </div>

                    {/* ── Form fields ────────────── */}
                    <div className="px-5 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">

                        {/* Personal Info section */}
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-neutral-900 font-bold mb-5 flex items-center gap-2">
                                <i className="ri-user-line text-sm text-neutral-400" />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelCls}>Full Name</label>
                                    <input
                                        type="text"
                                        name="fullname"
                                        value={form.fullname}
                                        onChange={handleChange}
                                        placeholder="Your full name"
                                        className={inputCls}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>Contact</label>
                                    <div className="relative">
                                        <i className="ri-phone-line absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-sm" />
                                        <input
                                            type="text"
                                            name="contact"
                                            value={form.contact}
                                            onChange={handleChange}
                                            placeholder="+91 9876543210"
                                            className={`${inputCls} pl-10`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Image upload */}
                        <div>
                            <label className={labelCls}>Profile Image</label>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={ACCEPTED_TYPES.join(",")}
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => fileInputRef.current?.click()}
                                className={`flex flex-col sm:flex-row items-center gap-4 border-2 border-dashed rounded-xl px-4 py-5 cursor-pointer transition
                                    ${isDragging
                                        ? "border-neutral-900 bg-neutral-50"
                                        : "border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50/60"}`}
                            >
                                {/* Preview / placeholder */}
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0">
                                    {widgetPreviewUrl ? (
                                        <img
                                            src={widgetPreviewUrl}
                                            alt="Selected"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <i className="ri-user-3-line text-2xl text-neutral-300" />
                                    )}
                                </div>

                                <div className="text-center sm:text-left flex-1">
                                    <p className="text-sm font-medium text-neutral-700 flex items-center justify-center sm:justify-start gap-1.5">
                                        <i className="ri-upload-cloud-2-line text-neutral-400" />
                                        {imageFile ? imageFile.name : "Click to upload or drag & drop"}
                                    </p>
                                    <p className="text-[11px] text-neutral-400 mt-1">
                                        JPG, PNG, WEBP or GIF — up to {MAX_IMAGE_MB}MB
                                    </p>
                                </div>

                                {(imageFile || form.profileImage) && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveImage();
                                        }}
                                        className="text-xs font-medium text-neutral-400 hover:text-red-500 transition inline-flex items-center gap-1 shrink-0 cursor-pointer"
                                    >
                                        <i className="ri-close-circle-line" />
                                        Remove
                                    </button>
                                )}
                            </div>

                            {uploadError && (
                                <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                                    <i className="ri-error-warning-line" />
                                    {uploadError}
                                </p>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-neutral-100" />

                        {/* Location section */}
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-neutral-900 font-bold mb-5 flex items-center gap-2">
                                <i className="ri-map-pin-2-line text-sm text-neutral-400" />
                                Location
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                <div>
                                    <label className={labelCls}>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        placeholder="e.g. Mumbai"
                                        className={inputCls}
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={form.state}
                                        onChange={handleChange}
                                        placeholder="e.g. Maharashtra"
                                        className={inputCls}
                                    />
                                </div>
                                <div className="sm:col-span-2 lg:col-span-1">
                                    <label className={labelCls}>Pincode</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={form.pincode}
                                        onChange={handleChange}
                                        placeholder="e.g. 400001"
                                        className={inputCls}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email (read-only) */}
                        <div>
                            <label className={labelCls}>Email (cannot be changed)</label>
                            <div className="relative">
                                <i className="ri-mail-line absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300 text-sm" />
                                <input
                                    type="email"
                                    value={user?.email || ""}
                                    disabled
                                    className="w-full bg-neutral-100 border border-neutral-100 rounded-xl pl-10 pr-4 py-3 text-sm text-neutral-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Footer actions ─────────── */}
                    <div className="px-5 sm:px-8 py-5 bg-neutral-50/50 border-t border-neutral-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition cursor-pointer text-center"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 transition cursor-pointer"
                        >
                            {saving ? (
                                <>
                                    <i className="ri-loader-4-line animate-spin" />
                                    Saving…
                                </>
                            ) : (
                                <>
                                    <i className="ri-check-line" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
};

export default Profile;