import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useClothing } from "../hook/useClothing";
import { getOptimizedImageUrl } from "../../shared/image.util.js";

const MyClothes = () => {
    const {
        handleGetMyListings,
        handleDeleteClothing,
    } = useClothing();

    const myListings = useSelector(
        (state) => state.clothing.myListings
    );

    const loading = useSelector(
        (state) => state.clothing.loading
    );

    const error = useSelector(
        (state) => state.clothing.error
    );


    useEffect(() => {
        handleGetMyListings().catch(() => {});
    }, []);


    const handleDelete = async (clothingId) => {

        const confirmed = window.confirm(
            "Are you sure you want to remove this clothing?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await handleDeleteClothing(
                clothingId
            );

            toast.success(
                "Clothing removed successfully"
            );

          

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Failed to remove clothing"
            );
        }
    };


    return (
        <main className="min-h-screen bg-white">

            {/* Header */}
            <section className="px-6 md:px-10 lg:px-20 pt-12 pb-8">

                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">

                    <div>

                        <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                            FashionKart
                        </p>

                        <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-black">
                            My Clothes
                        </h1>

                        <p className="mt-3 text-neutral-500">
                            Manage the clothes you have listed for swapping.
                        </p>

                    </div>

                    <Link
                        to="/create-clothing"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition"
                    >
                        + List Clothing
                    </Link>

                </div>

            </section>


            {/* Content */}
            <section className="px-6 md:px-10 lg:px-20 pb-16">

                <div className="max-w-7xl mx-auto">

                    {/* Loading */}
                    {loading && (
                        <div className="py-20 text-center text-sm text-neutral-500">
                            Loading your clothes...
                        </div>
                    )}


                    {/* Error */}
                    {!loading && error && (
                        <div className="py-20 text-center">

                            <h2 className="text-xl font-medium text-black">
                                Unable to load your clothes
                            </h2>

                            <p className="mt-2 text-sm text-red-500">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    handleGetMyListings()
                                }
                                className="mt-5 px-6 py-3 rounded-full bg-black text-white text-sm"
                            >
                                Try Again
                            </button>

                        </div>
                    )}


                    {/* Empty */}
                    {!loading &&
                        !error &&
                        myListings.length === 0 && (
                            <div className="py-20 text-center border border-dashed border-neutral-200 rounded-2xl">

                                <div className="w-14 h-14 mx-auto rounded-full bg-neutral-100 flex items-center justify-center">
                                    <i className="ri-t-shirt-line text-2xl text-neutral-500" />
                                </div>

                                <h2 className="mt-5 text-xl font-semibold text-black">
                                    No clothes listed yet
                                </h2>

                                <p className="mt-2 text-sm text-neutral-500">
                                    Add your first clothing item to start swapping.
                                </p>

                                <Link
                                    to="/create-clothing"
                                    className="inline-flex mt-6 px-6 py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition"
                                >
                                    List Your First Clothing
                                </Link>

                            </div>
                        )
                    }


                    {/* Listings */}
                    {!loading &&
                        !error &&
                        myListings.length > 0 && (

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                                {myListings.map((clothing) => (

                                    <article
                                        key={clothing._id}
                                        className="border border-neutral-200 rounded-2xl overflow-hidden bg-white"
                                    >

                                        {/* Image */}
                                        <Link
                                            to={`/clothes/${clothing._id}`}
                                            className="block"
                                        >

                                            <div className="aspect-[4/5] bg-neutral-100 overflow-hidden">

                                                {clothing.images?.[0] ? (
                                                    <img
                                                        src={getOptimizedImageUrl(clothing.images[0], 400, 500)}
                                                        alt={clothing.title}
                                                        className="w-full h-full object-cover hover:scale-105 transition duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                                        No Image
                                                    </div>
                                                )}

                                            </div>

                                        </Link>


                                        {/* Details */}
                                        <div className="p-4">

                                            <div className="flex items-start justify-between gap-3">

                                                <div className="min-w-0">

                                                    <h2 className="font-medium text-black truncate">
                                                        {clothing.title}
                                                    </h2>

                                                    {clothing.brand && (
                                                        <p className="mt-1 text-sm text-neutral-500 truncate">
                                                            {clothing.brand}
                                                        </p>
                                                    )}

                                                </div>


                                                {/* Status */}
                                                <span
                                                    className={`
                                                        shrink-0
                                                        px-2.5 py-1
                                                        rounded-full
                                                        text-[10px]
                                                        uppercase
                                                        tracking-wider
                                                        ${
                                                            clothing.status === "available"
                                                                ? "bg-green-50 text-green-700"
                                                                : clothing.status === "pending"
                                                                ? "bg-yellow-50 text-yellow-700"
                                                                : clothing.status === "swapped"
                                                                ? "bg-blue-50 text-blue-700"
                                                                : "bg-neutral-100 text-neutral-500"
                                                        }
                                                    `}
                                                >
                                                    {clothing.status}
                                                </span>

                                            </div>


                                            {/* Meta */}
                                            <div className="flex items-center justify-between mt-4 text-xs text-neutral-500">

                                                <span>
                                                    {clothing.category}
                                                </span>

                                                <span>
                                                    Size {clothing.size}
                                                </span>

                                            </div>


                                            {/* Condition + Value */}
                                            <div className="flex items-center justify-between mt-3">

                                                <span className="text-xs text-neutral-500">
                                                    {clothing.condition}
                                                </span>

                                                <span className="text-sm font-medium text-black">
                                                    ₹{clothing.estimatedSwapValue}
                                                </span>

                                            </div>


                                            {/* Actions */}
                                          <div className="grid grid-cols-3 gap-2 mt-5">

    <Link
        to={`/clothes/${clothing._id}`}
        className="flex items-center justify-center py-2.5 rounded-full border border-neutral-200 text-xs font-medium hover:bg-neutral-50 transition"
    >
        View
    </Link>

    <Link
        to={`/clothes/${clothing._id}/edit`}
        className="flex items-center justify-center py-2.5 rounded-full border border-neutral-200 text-xs font-medium hover:bg-neutral-50 transition"
    >
        Edit
    </Link>

    <button
        type="button"
        onClick={() =>
            handleDelete(clothing._id)
        }
        className="py-2.5 rounded-full border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition"
    >
        Remove
    </button>

</div>

                                        </div>

                                    </article>

                                ))}

                            </div>

                        )}

                </div>

            </section>

        </main>
    );
};

export default MyClothes;