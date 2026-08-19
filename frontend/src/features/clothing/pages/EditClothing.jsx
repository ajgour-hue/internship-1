import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useClothing } from "../hook/useClothing";

const categories = [
    "T-Shirt",
    "Shirt",
    "Jeans",
    "Trousers",
    "Jacket",
    "Hoodie",
    "Sweater",
    "Dress",
    "Skirt",
    "Shorts",
    "Saree",
    "Kurta",
    "Other",
];

const sizes = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "XXXL",
    "Free Size",
];

const conditions = [
    "New",
    "Like New",
    "Excellent",
    "Good",
    "Fair",
];

const EditClothing = () => {
    const { clothingId } = useParams();
    const navigate = useNavigate();

    const {
        handleGetClothingById,
        handleUpdateClothing,
        handleClearSelectedClothing,
    } = useClothing();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        brand: "",
        size: "",
        condition: "",
        images: "",
        estimatedSwapValue: "",
        city: "",
        state: "",
        pincode: "",
    });

    useEffect(() => {
        const loadClothing = async () => {
            try {
                const data =
                    await handleGetClothingById(clothingId);

                const clothing = data?.clothing;

                if (!clothing) {
                    toast.error("Clothing not found");
                    navigate("/my-clothes");
                    return;
                }

                setFormData({
                    title: clothing.title || "",
                    description: clothing.description || "",
                    category: clothing.category || "",
                    brand: clothing.brand || "",
                    size: clothing.size || "",
                    condition: clothing.condition || "",
                    images: Array.isArray(clothing.images)
                        ? clothing.images.join(", ")
                        : "",
                    estimatedSwapValue:
                        clothing.estimatedSwapValue ?? "",
                    city: clothing.location?.city || "",
                    state: clothing.location?.state || "",
                    pincode: clothing.location?.pincode || "",
                });

            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Failed to load clothing"
                );

                navigate("/my-clothes");
            } finally {
                setLoading(false);
            }
        };

        if (clothingId) {
            loadClothing();
        }

        return () => {
            handleClearSelectedClothing();
        };
    }, [clothingId]);


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const images = formData.images
            .split(",")
            .map((image) => image.trim())
            .filter(Boolean);

        if (images.length < 1 || images.length > 6) {
            toast.error(
                "Add between 1 and 6 image URLs"
            );
            return;
        }

        const payload = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            category: formData.category,
            brand: formData.brand.trim(),
            size: formData.size,
            condition: formData.condition,
            images,
            estimatedSwapValue: Number(
                formData.estimatedSwapValue
            ),
            location: {
                city: formData.city.trim(),
                state: formData.state.trim(),
                pincode: formData.pincode.trim(),
            },
        };

        try {
            setSaving(true);

            await handleUpdateClothing(
                clothingId,
                payload
            );

            toast.success(
                "Clothing updated successfully"
            );

            navigate(`/clothes/${clothingId}`);

        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Failed to update clothing"
            );
        } finally {
            setSaving(false);
        }
    };


    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-sm text-neutral-500">
                    Loading clothing...
                </p>
            </main>
        );
    }


    return (
        <main className="min-h-screen bg-white px-6 md:px-10 lg:px-20 py-10">

            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-10">

                    <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                        FashionKart
                    </p>

                    <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-black">
                        Edit Clothing
                    </h1>

                    <p className="mt-3 text-neutral-500">
                        Update the details of your listing.
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="border border-neutral-200 rounded-2xl p-6 md:p-8"
                >

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Title */}
                        <div className="md:col-span-2">
                            <label className="block text-xs uppercase tracking-wider font-medium text-neutral-600 mb-2">
                                Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                minLength={3}
                                maxLength={100}
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-black"
                            />
                        </div>


                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-xs uppercase tracking-wider font-medium text-neutral-600 mb-2">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                maxLength={1000}
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-black resize-none"
                            />
                        </div>


                        {/* Category */}
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-medium text-neutral-600 mb-2">
                                Category
                            </label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-black bg-white"
                            >
                                <option value="">
                                    Select category
                                </option>

                                {categories.map((category) => (
                                    <option
                                        key={category}
                                        value={category}
                                    >
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/* Brand */}
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-medium text-neutral-600 mb-2">
                                Brand
                            </label>

                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-black"
                            />
                        </div>


                        {/* Size */}
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-medium text-neutral-600 mb-2">
                                Size
                            </label>

                            <select
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-black bg-white"
                            >
                                <option value="">
                                    Select size
                                </option>

                                {sizes.map((size) => (
                                    <option
                                        key={size}
                                        value={size}
                                    >
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/* Condition */}
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-medium text-neutral-600 mb-2">
                                Condition
                            </label>

                            <select
                                name="condition"
                                value={formData.condition}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-black bg-white"
                            >
                                <option value="">
                                    Select condition
                                </option>

                                {conditions.map((condition) => (
                                    <option
                                        key={condition}
                                        value={condition}
                                    >
                                        {condition}
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/* Swap Value */}
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-medium text-neutral-600 mb-2">
                                Estimated Swap Value
                            </label>

                            <input
                                type="number"
                                name="estimatedSwapValue"
                                value={formData.estimatedSwapValue}
                                onChange={handleChange}
                                required
                                min="0"
                                step="1"
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-black"
                            />
                        </div>


                        {/* Images */}
                        <div className="md:col-span-2">

                            <label className="block text-xs uppercase tracking-wider font-medium text-neutral-600 mb-2">
                                Image URLs
                            </label>

                            <input
                                type="text"
                                name="images"
                                value={formData.images}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-black"
                            />

                            <p className="mt-2 text-xs text-neutral-400">
                                Add 1–6 image URLs separated by commas.
                            </p>

                        </div>


                        {/* City */}
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-medium text-neutral-600 mb-2">
                                City
                            </label>

                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-black"
                            />
                        </div>


                        {/* State */}
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-medium text-neutral-600 mb-2">
                                State
                            </label>

                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-black"
                            />
                        </div>


                        {/* Pincode */}
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-medium text-neutral-600 mb-2">
                                Pincode
                            </label>

                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-black"
                            />
                        </div>

                    </div>


                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-8">

                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-3.5 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(`/clothes/${clothingId}`)
                            }
                            className="px-8 py-3.5 rounded-full border border-neutral-200 text-sm hover:bg-neutral-50 transition"
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </div>

        </main>
    );
};

export default EditClothing;