import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useClothing } from "../hook/useClothing";
import { getOptimizedImageUrl } from "../../shared/image.util.js";

const NearbyClothes = () => {
    const navigate = useNavigate();

    const {
        handleGetNearbyClothesForUser,
    } = useClothing();

    const nearbyClothes = useSelector(
        (state) => state.clothing.nearbyClothes
    );

    const loading = useSelector(
        (state) => state.clothing.loading
    );

    const error = useSelector(
        (state) => state.clothing.error
    );

    const [radius, setRadius] = useState(10);


    useEffect(() => {
        loadNearbyClothes();
    }, [radius]);


    const loadNearbyClothes = async () => {
        try {

            await handleGetNearbyClothesForUser({
                radius,
            });

        } catch (error) {

            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to load nearby clothes";

            if (
                message ===
                "Please update your location first"
            ) {
                navigate("/location-setup");
                return;
            }

            toast.error(message);
        }
    };


    return (
        <main className="min-h-screen bg-white">

            {/* Header */}
            <section className="px-6 md:px-10 lg:px-20 pt-12 pb-8">

                <div className="max-w-7xl mx-auto">

                    <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                        FashionKart
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">

                        <div>

                            <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-black">
                                Nearby Clothes
                            </h1>

                            <p className="mt-3 text-neutral-500">
                                Discover available clothes near you.
                            </p>

                        </div>


                        {/* Radius */}
                        <div className="flex items-center gap-3">

                            <label
                                htmlFor="radius"
                                className="text-xs uppercase tracking-wider text-neutral-500"
                            >
                                Radius
                            </label>

                            <select
                                id="radius"
                                value={radius}
                                onChange={(e) =>
                                    setRadius(
                                        Number(e.target.value)
                                    )
                                }
                                className="px-4 py-2.5 rounded-full border border-neutral-200 bg-white text-sm outline-none focus:border-black"
                            >
                                <option value={5}>
                                    5 km
                                </option>

                                <option value={10}>
                                    10 km
                                </option>

                                <option value={25}>
                                    25 km
                                </option>

                                <option value={50}>
                                    50 km
                                </option>
                            </select>

                        </div>

                    </div>

                </div>

            </section>


            {/* Content */}
            <section className="px-6 md:px-10 lg:px-20 pb-16">

                <div className="max-w-7xl mx-auto">

                    {/* Loading */}
                    {loading && (
                        <div className="py-20 text-center text-sm text-neutral-500">
                            Finding clothes near you...
                        </div>
                    )}


                    {/* Error */}
                    {!loading && error && (
                        <div className="py-20 text-center">

                            <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center">
                                <i className="ri-map-pin-line text-xl text-red-500" />
                            </div>

                            <h2 className="mt-5 text-xl font-semibold text-black">
                                Unable to find nearby clothes
                            </h2>

                            <p className="mt-2 text-sm text-neutral-500">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={loadNearbyClothes}
                                className="mt-6 px-6 py-3 rounded-full bg-black text-white text-sm"
                            >
                                Try Again
                            </button>

                        </div>
                    )}


                    {/* Empty */}
                    {!loading &&
                        !error &&
                        nearbyClothes.length === 0 && (

                            <div className="py-20 text-center border border-dashed border-neutral-200 rounded-2xl">

                                <div className="w-14 h-14 mx-auto rounded-full bg-neutral-100 flex items-center justify-center">
                                    <i className="ri-map-pin-line text-2xl text-neutral-500" />
                                </div>

                                <h2 className="mt-5 text-xl font-semibold text-black">
                                    No clothes nearby
                                </h2>

                                <p className="mt-2 text-sm text-neutral-500">
                                    Try increasing your search radius.
                                </p>

                            </div>
                        )
                    }


                    {/* Clothes */}
                    {!loading &&
                        !error &&
                        nearbyClothes.length > 0 && (

                            <>

                                <div className="flex items-center justify-between mb-6">

                                    <p className="text-sm text-neutral-500">
                                        {nearbyClothes.length} clothes found
                                    </p>

                                    <p className="text-sm text-neutral-400">
                                        Within {radius} km
                                    </p>

                                </div>


                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                                    {nearbyClothes.map(
                                        (clothing) => (

                                            <Link
                                                key={clothing._id}
                                                to={`/clothes/${clothing._id}`}
                                                className="block"
                                            >

                                                <article className="border border-neutral-200 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition">

                                                    {/* Image */}
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


                                                    {/* Details */}
                                                    <div className="p-4">

                                                        <h2 className="font-medium text-black truncate">
                                                            {clothing.title}
                                                        </h2>


                                                        {clothing.brand && (
                                                            <p className="mt-1 text-sm text-neutral-500 truncate">
                                                                {clothing.brand}
                                                            </p>
                                                        )}


                                                        <div className="flex items-center justify-between mt-4 text-xs text-neutral-500">

                                                            <span>
                                                                {clothing.category}
                                                            </span>

                                                            <span>
                                                                Size {clothing.size}
                                                            </span>

                                                        </div>


                                                        <div className="flex items-center justify-between mt-3">

                                                            <span className="text-xs text-neutral-500">
                                                                {clothing.condition}
                                                            </span>

                                                            <span className="text-sm font-medium text-black">
                                                                ₹{clothing.estimatedSwapValue}
                                                            </span>

                                                        </div>


                                                        {/* Owner */}
                                                        {clothing.owner && (

                                                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-100">

                                                                <div className="w-7 h-7 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center">

                                                                    {clothing.owner.profileImage ? (

                                                                        <img
                                                                            src={getOptimizedImageUrl(clothing.owner.profileImage, 100, 100)}
                                                                            alt=""
                                                                            className="w-full h-full object-cover"
                                                                        />

                                                                    ) : (

                                                                        <i className="ri-user-line text-sm text-neutral-500" />

                                                                    )}

                                                                </div>

                                                                <span className="text-xs text-neutral-500 truncate">
                                                                    {clothing.owner.fullname}
                                                                </span>

                                                            </div>

                                                        )}

                                                    </div>

                                                </article>

                                            </Link>

                                        )
                                    )}

                                </div>

                            </>
                        )}

                </div>

            </section>

        </main>
    );
};

export default NearbyClothes;