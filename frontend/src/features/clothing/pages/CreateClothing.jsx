import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClothing } from "../hook/useClothing.js";

const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const categories = [
    "T-Shirt",
    "Shirt",
    "Jeans",
    "Trousers",
    "Dress",
    "Jacket",
    "Sweater",
    "Hoodie",
    "Skirt",
    "Shorts",
    "Other",
];

const sizes = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
];

const conditions = [
    "New",
    "Like New",
    "Excellent",
    "Good",
    "Fair",
];

const initialForm = {
    title: "",
    description: "",
    category: "",
    brand: "",
    size: "",
    condition: "",
    estimatedSwapValue: "",
    city: "",
    state: "",
    pincode: "",
};

const CreateClothing = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const {
        handleCreateClothing,
    } = useClothing();

    const [form, setForm] = useState(initialForm);

    const [images, setImages] = useState([]);

    const [previews, setPreviews] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    /* --------------------------------
       Cleanup object URLs
    -------------------------------- */

    useEffect(() => {
        return () => {
            previews.forEach((url) => {
                URL.revokeObjectURL(url);
            });
        };
    }, [previews]);

    /* --------------------------------
       Input Change
    -------------------------------- */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    /* --------------------------------
       Image Upload
    -------------------------------- */

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);

        if (!selectedFiles.length) {
            return;
        }

        setError("");

        const remainingSlots =
            MAX_IMAGES - images.length;

        if (remainingSlots <= 0) {
            setError(
                `You can upload maximum ${MAX_IMAGES} images.`
            );

            e.target.value = "";
            return;
        }

        const filesToAdd =
            selectedFiles.slice(0, remainingSlots);

        const invalidFiles = filesToAdd.filter(
            (file) => {
                const validType =
                    file.type.startsWith("image/");

                const validSize =
                    file.size <= MAX_FILE_SIZE;

                return !validType || !validSize;
            }
        );

        if (invalidFiles.length > 0) {
            setError(
                "Only image files up to 5MB are allowed."
            );

            e.target.value = "";
            return;
        }

        const newImages = [
            ...images,
            ...filesToAdd,
        ];

        const newPreviews = filesToAdd.map(
            (file) => URL.createObjectURL(file)
        );

        setImages(newImages);
        setPreviews((prev) => [
            ...prev,
            ...newPreviews,
        ]);

        e.target.value = "";
    };

    /* --------------------------------
       Remove Image
    -------------------------------- */

    const handleRemoveImage = (index) => {
        URL.revokeObjectURL(previews[index]);

        setImages((prev) =>
            prev.filter((_, i) => i !== index)
        );

        setPreviews((prev) =>
            prev.filter((_, i) => i !== index)
        );

        setError("");
    };

    /* --------------------------------
       Validation
    -------------------------------- */

    const validateForm = () => {
        if (!form.title.trim()) {
            return "Title is required";
        }

        if (!form.description.trim()) {
            return "Description is required";
        }

        if (!form.category) {
            return "Category is required";
        }

        if (!form.brand.trim()) {
            return "Brand is required";
        }

        if (!form.size) {
            return "Size is required";
        }

        if (!form.condition) {
            return "Condition is required";
        }

        if (
            form.estimatedSwapValue === "" ||
            Number(form.estimatedSwapValue) < 0
        ) {
            return "Enter a valid estimated swap value";
        }

        if (!form.city.trim()) {
            return "City is required";
        }

        if (!form.state.trim()) {
            return "State is required";
        }

        if (!form.pincode.trim()) {
            return "Pincode is required";
        }

        if (!/^\d{6}$/.test(form.pincode.trim())) {
            return "Pincode must be 6 digits";
        }

        if (images.length === 0) {
            return "Please upload at least one image";
        }

        if (images.length > MAX_IMAGES) {
            return `Maximum ${MAX_IMAGES} images are allowed`;
        }

        return "";
    };

    /* --------------------------------
       Submit
    -------------------------------- */

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const validationError =
            validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            /* Text fields */

            formData.append(
                "title",
                form.title.trim()
            );

            formData.append(
                "description",
                form.description.trim()
            );

            formData.append(
                "category",
                form.category
            );

            formData.append(
                "brand",
                form.brand.trim()
            );

            formData.append(
                "size",
                form.size
            );

            /*
             IMPORTANT:
             Exact backend enum values.
            */

            formData.append(
                "condition",
                form.condition
            );

            formData.append(
                "estimatedSwapValue",
                String(
                    Number(form.estimatedSwapValue)
                )
            );

            /*
             Current validator expects these
             fields directly.
            */

            formData.append(
                "city",
                form.city.trim()
            );

            formData.append(
                "state",
                form.state.trim()
            );

            formData.append(
                "pincode",
                form.pincode.trim()
            );

            /*
             Controller expects location as JSON.
            */

            formData.append(
                "location",
                JSON.stringify({
                    city: form.city.trim(),
                    state: form.state.trim(),
                    pincode: form.pincode.trim(),
                })
            );

            /*
             IMPORTANT:
             Append actual File objects.
             Backend multer reads req.files.
            */

            images.forEach((file) => {
                formData.append(
                    "images",
                    file
                );
            });

            await handleCreateClothing(
                formData
            );

            setSuccess(
                "Clothing listed successfully!"
            );

            setForm(initialForm);

            previews.forEach((url) => {
                URL.revokeObjectURL(url);
            });

            setImages([]);
            setPreviews([]);

            /*
             Give success message a moment
             before navigation.
            */

            setTimeout(() => {
                navigate("/my-clothes");
            }, 800);

        } catch (err) {
            console.error(
                "Create clothing error:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.response?.data?.errors
                    ?.map((item) => item.msg)
                    ?.join(", ") ||
                "Failed to create clothing";

            setError(message);

        } finally {
            setLoading(false);
        }
    };

    /* --------------------------------
       Render
    -------------------------------- */

    return (
        <div className="min-h-screen bg-white px-6 py-10">

            <div className="mx-auto max-w-5xl">

                {/* Header */}

                <div className="mb-10">

                    <p className="mb-3 text-sm tracking-[0.25em] text-gray-400">
                        FASHIONKART
                    </p>

                    <h1 className="text-4xl font-semibold tracking-tight">
                        List Your Clothing
                    </h1>

                    <p className="mt-3 text-gray-500">
                        Add details about your clothing item
                        and make it available for swapping.
                    </p>

                </div>

                {/* Error */}

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Success */}

                {success && (
                    <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-600">
                        {success}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-8"
                >

                    {/* --------------------------------
                        Images
                    -------------------------------- */}

                    <section className="rounded-3xl border border-gray-200 p-7">

                        <div className="mb-6">

                            <h2 className="text-xl font-semibold">
                                Clothing Images
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                Upload up to 6 images.
                                Maximum 5MB per image.
                            </p>

                        </div>

                        <div className="flex flex-wrap gap-5">

                            {/* Upload */}

                            {images.length < MAX_IMAGES && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="flex h-56 w-56 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-black hover:bg-gray-100"
                                >

                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black text-2xl text-white">
                                        ↑
                                    </div>

                                    <span className="font-medium">
                                        Upload Image
                                    </span>

                                    <span className="mt-1 text-xs text-gray-400">
                                        JPG, PNG, WEBP
                                    </span>

                                </button>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                hidden
                                onChange={
                                    handleImageChange
                                }
                            />

                            {/* Previews */}

                            {previews.map(
                                (preview, index) => (
                                    <div
                                        key={`${preview}-${index}`}
                                        className="relative h-56 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100"
                                    >

                                        <img
                                            src={preview}
                                            alt={`Clothing ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveImage(
                                                    index
                                                )
                                            }
                                            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/80 text-lg text-white"
                                        >
                                            ×
                                        </button>

                                        {index === 0 && (
                                            <div className="absolute bottom-3 left-3 rounded-full bg-black px-3 py-1 text-xs text-white">
                                                Main image
                                            </div>
                                        )}

                                    </div>
                                )
                            )}

                        </div>

                        <p className="mt-5 text-sm text-gray-400">
                            {images.length}/{MAX_IMAGES} images
                            {images.length > 0 &&
                                " • First image will be the main image."}
                        </p>

                    </section>

                    {/* --------------------------------
                        Basic Information
                    -------------------------------- */}

                    <section className="rounded-3xl border border-gray-200 p-7">

                        <h2 className="mb-6 text-xl font-semibold">
                            Basic Information
                        </h2>

                        <div className="grid gap-6 md:grid-cols-2">

                            {/* Title */}

                            <div className="md:col-span-2">

                                <label className="mb-2 block text-sm font-medium">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Black Denim Jacket"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-black"
                                />

                            </div>

                            {/* Category */}

                            <div>

                                <label className="mb-2 block text-sm font-medium">
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-black"
                                >

                                    <option value="">
                                        Select category
                                    </option>

                                    {categories.map(
                                        (category) => (
                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            {/* Brand */}

                            <div>

                                <label className="mb-2 block text-sm font-medium">
                                    Brand
                                </label>

                                <input
                                    type="text"
                                    name="brand"
                                    value={form.brand}
                                    onChange={handleChange}
                                    placeholder="e.g. Zara"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                />

                            </div>

                            {/* Size */}

                            <div>

                                <label className="mb-2 block text-sm font-medium">
                                    Size
                                </label>

                                <select
                                    name="size"
                                    value={form.size}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-black"
                                >

                                    <option value="">
                                        Select size
                                    </option>

                                    {sizes.map(
                                        (size) => (
                                            <option
                                                key={size}
                                                value={size}
                                            >
                                                {size}
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            {/* Condition */}

                            <div>

                                <label className="mb-2 block text-sm font-medium">
                                    Condition
                                </label>

                                <select
                                    name="condition"
                                    value={form.condition}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-black"
                                >

                                    <option value="">
                                        Select condition
                                    </option>

                                    {conditions.map(
                                        (condition) => (
                                            <option
                                                key={condition}
                                                value={condition}
                                            >
                                                {condition}
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            {/* Swap Value */}

                            <div>

                                <label className="mb-2 block text-sm font-medium">
                                    Estimated Swap Value
                                </label>

                                <input
                                    type="number"
                                    name="estimatedSwapValue"
                                    min="0"
                                    value={
                                        form.estimatedSwapValue
                                    }
                                    onChange={handleChange}
                                    placeholder="e.g. 1000"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                />

                            </div>

                        </div>

                    </section>

                    {/* --------------------------------
                        More Information
                    -------------------------------- */}

                    <section className="rounded-3xl border border-gray-200 p-7">

                        <h2 className="mb-6 text-xl font-semibold">
                            More Information
                        </h2>

                        {/* Description */}

                        <div className="mb-6">

                            <label className="mb-2 block text-sm font-medium">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={6}
                                placeholder="Describe your clothing..."
                                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                            />

                        </div>

                        {/* Location */}

                        <h3 className="mb-4 font-medium">
                            Location
                        </h3>

                        <div className="grid gap-5 md:grid-cols-3">

                            {/* City */}

                            <div>

                                <label className="mb-2 block text-sm font-medium">
                                    City
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    placeholder="Bhopal"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                />

                            </div>

                            {/* State */}

                            <div>

                                <label className="mb-2 block text-sm font-medium">
                                    State
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    value={form.state}
                                    onChange={handleChange}
                                    placeholder="Madhya Pradesh"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                />

                            </div>

                            {/* Pincode */}

                            <div>

                                <label className="mb-2 block text-sm font-medium">
                                    Pincode
                                </label>

                                <input
                                    type="text"
                                    name="pincode"
                                    value={form.pincode}
                                    onChange={handleChange}
                                    maxLength={6}
                                    placeholder="462001"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                                />

                            </div>

                        </div>

                    </section>

                    {/* --------------------------------
                        Actions
                    -------------------------------- */}

                    <div className="flex justify-end gap-4 pb-10">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(-1)
                            }
                            disabled={loading}
                            className="rounded-full border border-gray-200 px-8 py-3 font-medium transition hover:bg-gray-100 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-full bg-black px-8 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? "Listing..."
                                : "List Clothing"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default CreateClothing;