import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useClothing } from "../hook/useClothing";
import { useSwap } from "../hook/useSwap";
import { useSelector } from "react-redux";

const ClothingDetail = () => {

    const { clothingId } = useParams();
    const navigate = useNavigate();

    const {
        handleGetClothingById,
        handleClearSelectedClothing,
        handleGetMyListings,
    } = useClothing();

    const {
        handleCreateSwapRequest,
        handleCompareSwapValues,
    } = useSwap();


    const clothing = useSelector(
        (state) => state.clothing.selectedClothing
    );

    const myListings = useSelector(
        (state) => state.clothing.myListings
    );

    const user = useSelector(
        (state) => state.auth.user
    );

    const loading = useSelector(
        (state) => state.clothing.loading
    );

    const error = useSelector(
        (state) => state.clothing.error
    );


    const [swapModalOpen, setSwapModalOpen] = useState(false);

    const [selectedOfferedItem, setSelectedOfferedItem] =
        useState("");

    const [message, setMessage] = useState("");

    const [swapLoading, setSwapLoading] =
        useState(false);

    const [comparison, setComparison] =
        useState(null);

    const [comparisonLoading, setComparisonLoading] =
        useState(false);

    const [comparisonError, setComparisonError] =
        useState("");


    // Get clothing details
    useEffect(() => {

        if (!clothingId) {
            return;
        }

        handleGetClothingById(clothingId);

        return () => {
            handleClearSelectedClothing();
        };

    }, [clothingId]);


    // Open swap modal
    const handleOpenSwapModal = async () => {

        try {

            await handleGetMyListings();

            setSwapModalOpen(true);

            setSelectedOfferedItem("");

            setComparison(null);

            setComparisonError("");

            setMessage("");

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Failed to load your clothes"
            );
        }
    };


    // Compare values
    const handleSelectOfferedItem = async (
        offeredItemId
    ) => {

        setSelectedOfferedItem(
            offeredItemId
        );

        setComparison(null);

        setComparisonError("");


        if (!offeredItemId || !clothingId) {
            return;
        }


        try {

            setComparisonLoading(true);


            const data =
                await handleCompareSwapValues({

                    requestedItem:
                        clothingId,

                    offeredItem:
                        offeredItemId,

                });


            setComparison(
                data.comparison || null
            );


        } catch (error) {

            setComparisonError(
                error?.response?.data?.message ||
                "Failed to compare swap values"
            );

        } finally {

            setComparisonLoading(false);
        }
    };


    // Send swap request
    const handleSendSwapRequest = async () => {

        if (!selectedOfferedItem) {

            toast.error(
                "Please select a clothing item to offer"
            );

            return;
        }


        if (comparisonLoading) {

            toast.error(
                "Please wait for value comparison"
            );

            return;
        }


        if (!comparison) {

            toast.error(
                "Swap value comparison is required"
            );

            return;
        }


        try {

            setSwapLoading(true);


            await handleCreateSwapRequest({

                requestedItem:
                    clothingId,

                offeredItem:
                    selectedOfferedItem,

                message:
                    message.trim(),

            });


            toast.success(
                "Swap request sent successfully"
            );


            setSwapModalOpen(false);

            setSelectedOfferedItem("");

            setComparison(null);

            setComparisonError("");

            setMessage("");


        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Failed to send swap request"
            );

        } finally {

            setSwapLoading(false);
        }
    };


    // Loading
    if (loading && !clothing) {

        return (
            <main className="min-h-screen flex items-center justify-center">

                <p className="text-sm text-neutral-500">
                    Loading clothing...
                </p>

            </main>
        );
    }


    // Error
    if (error && !clothing) {

        return (
            <main className="min-h-screen flex flex-col items-center justify-center px-6">

                <h1 className="text-2xl font-semibold">
                    Unable to load clothing
                </h1>

                <p className="mt-2 text-sm text-neutral-500">
                    {error}
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="mt-6 px-6 py-3 rounded-full bg-black text-white text-sm"
                >
                    Back to Explore
                </button>

            </main>
        );
    }


    // Not found
    if (!clothing) {

        return (
            <main className="min-h-screen flex flex-col items-center justify-center px-6">

                <h1 className="text-2xl font-semibold">
                    Clothing not found
                </h1>

                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="mt-6 px-6 py-3 rounded-full bg-black text-white text-sm"
                >
                    Back to Explore
                </button>

            </main>
        );
    }


    const currentUserId =
        user?.id || user?._id;

    const ownerId =
        clothing?.owner?._id ||
        clothing?.owner;

    const isOwner =
        currentUserId &&
        ownerId &&
        String(currentUserId) ===
        String(ownerId);


    // Available clothes for swap
    const availableListings =
        (myListings || []).filter(
            (item) =>
                item.status === "available" &&
                String(item._id) !==
                String(clothing._id)
        );


    const recommendationText = {
        excellent_match:
            "Excellent Match",

        good_match:
            "Good Match",

        fair_match:
            "Fair Match",

        large_value_difference:
            "Large Value Difference",
    };


    return (
        <main className="min-h-screen bg-white">

            {/* Back */}
            <div className="px-6 md:px-10 lg:px-20 pt-8">

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition"
                >
                    <i className="ri-arrow-left-line" />
                    Back to Explore
                </Link>

            </div>


            {/* Main Content */}
            <section className="px-6 md:px-10 lg:px-20 py-10">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 max-w-7xl mx-auto">

                    {/* Images */}
                    <div className="grid grid-cols-2 gap-3">

                        {clothing.images?.length > 0 ? (

                            clothing.images.map(
                                (image, index) => (

                                    <div
                                        key={`${image}-${index}`}
                                        className="aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100"
                                    >

                                        <img
                                            src={image}
                                            alt={`${clothing.title} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />

                                    </div>

                                )
                            )

                        ) : (

                            <div className="col-span-2 aspect-[4/5] rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">

                                No Image

                            </div>

                        )}

                    </div>


                    {/* Details */}
                    <div className="lg:sticky lg:top-28 lg:self-start">

                        <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                            {clothing.category ||
                                "Clothing"}
                        </p>


                        <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-black">
                            {clothing.title}
                        </h1>


                        {clothing.brand && (

                            <p className="mt-3 text-neutral-500">
                                {clothing.brand}
                            </p>

                        )}


                        {/* Size / Condition */}
                        <div className="grid grid-cols-2 gap-3 mt-8">

                            <div className="p-4 rounded-xl bg-neutral-50">

                                <p className="text-xs uppercase tracking-wider text-neutral-400">
                                    Size
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {clothing.size}
                                </p>

                            </div>


                            <div className="p-4 rounded-xl bg-neutral-50">

                                <p className="text-xs uppercase tracking-wider text-neutral-400">
                                    Condition
                                </p>

                                <p className="mt-1 text-sm font-medium">
                                    {clothing.condition}
                                </p>

                            </div>

                        </div>


                        {/* Swap Value */}
                        <div className="mt-5 p-4 rounded-xl bg-neutral-50">

                            <p className="text-xs uppercase tracking-wider text-neutral-400">
                                Estimated Swap Value
                            </p>

                            <p className="mt-1 text-lg font-semibold">
                                ₹{clothing.estimatedSwapValue}
                            </p>

                        </div>


                        {/* Description */}
                        {clothing.description && (

                            <div className="mt-8">

                                <h2 className="text-sm font-semibold uppercase tracking-wider">
                                    Description
                                </h2>

                                <p className="mt-3 text-sm leading-7 text-neutral-500">
                                    {clothing.description}
                                </p>

                            </div>

                        )}


                        {/* Location */}
                        {(clothing.location?.city ||
                            clothing.location?.state) && (

                            <div className="mt-8">

                                <h2 className="text-sm font-semibold uppercase tracking-wider">
                                    Location
                                </h2>

                                <div className="flex items-center gap-2 mt-3 text-sm text-neutral-500">

                                    <i className="ri-map-pin-line" />

                                    <span>
                                        {[
                                            clothing.location?.city,
                                            clothing.location?.state,
                                        ]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </span>

                                </div>

                            </div>

                        )}


                        {/* Owner */}
                        {clothing.owner && (

                            <div className="mt-8 pt-8 border-t border-neutral-200">

                                <h2 className="text-sm font-semibold uppercase tracking-wider">
                                    Listed By
                                </h2>

                                <div className="flex items-center gap-3 mt-4">

                                    <div className="w-11 h-11 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center">

                                        {clothing.owner.profileImage ? (

                                            <img
                                                src={clothing.owner.profileImage}
                                                alt={
                                                    clothing.owner.fullname
                                                }
                                                className="w-full h-full object-cover"
                                            />

                                        ) : (

                                            <i className="ri-user-3-line text-lg text-neutral-500" />

                                        )}

                                    </div>


                                    <div>

                                        <p className="text-sm font-medium text-black">
                                            {clothing.owner.fullname}
                                        </p>

                                        {(clothing.owner.location?.city ||
                                            clothing.owner.location?.state) && (

                                            <p className="text-xs text-neutral-500 mt-1">

                                                {[
                                                    clothing.owner.location?.city,
                                                    clothing.owner.location?.state,
                                                ]
                                                    .filter(Boolean)
                                                    .join(", ")}

                                            </p>

                                        )}

                                    </div>

                                </div>

                            </div>

                        )}


                        {/* Request Swap */}
                        {!isOwner &&
                            clothing.status === "available" && (

                            <button
                                type="button"
                                onClick={
                                    handleOpenSwapModal
                                }
                                className="mt-8 w-full py-4 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition"
                            >
                                Request Swap
                            </button>

                        )}

                    </div>

                </div>

            </section>


            {/* Swap Modal */}
            {swapModalOpen && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center px-5">

                    {/* Overlay */}
                    <button
                        type="button"
                        onClick={() => {
                            if (!swapLoading) {
                                setSwapModalOpen(false);
                            }
                        }}
                        className="absolute inset-0 bg-black/40"
                        aria-label="Close modal"
                    />


                    {/* Modal */}
                    <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">

                            <div>

                                <h2 className="text-xl font-semibold">
                                    Request Swap
                                </h2>

                                <p className="mt-1 text-xs text-neutral-500">
                                    Choose one of your clothes to offer.
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() => {
                                    if (!swapLoading) {
                                        setSwapModalOpen(false);
                                    }
                                }}
                                disabled={swapLoading}
                                className="w-9 h-9 rounded-full hover:bg-neutral-100 transition disabled:opacity-50"
                            >
                                <i className="ri-close-line text-lg" />
                            </button>

                        </div>


                        {/* Body */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto">

                            {availableListings.length === 0 ? (

                                <div className="py-10 text-center">

                                    <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 flex items-center justify-center">

                                        <i className="ri-t-shirt-line text-xl text-neutral-500" />

                                    </div>

                                    <h3 className="mt-4 text-sm font-medium">
                                        No available clothes
                                    </h3>

                                    <p className="mt-2 text-xs text-neutral-500">
                                        You need an available clothing item to make a swap offer.
                                    </p>

                                    <Link
                                        to="/create-clothing"
                                        onClick={() =>
                                            setSwapModalOpen(
                                                false
                                            )
                                        }
                                        className="inline-flex mt-5 px-5 py-2.5 rounded-full bg-black text-white text-xs"
                                    >
                                        List Clothing
                                    </Link>

                                </div>

                            ) : (

                                <>

                                    {/* My Clothes */}
                                    <div className="grid grid-cols-2 gap-3">

                                        {availableListings.map(
                                            (item) => {

                                                const selected =
                                                    selectedOfferedItem ===
                                                    item._id;

                                                return (

                                                    <button
                                                        key={
                                                            item._id
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            handleSelectOfferedItem(
                                                                item._id
                                                            )
                                                        }
                                                        disabled={
                                                            comparisonLoading ||
                                                            swapLoading
                                                        }
                                                        className={`
                                                            text-left rounded-xl overflow-hidden border-2 transition
                                                            ${
                                                                selected
                                                                    ? "border-black"
                                                                    : "border-neutral-200 hover:border-neutral-400"
                                                            }
                                                            disabled:opacity-60
                                                        `}
                                                    >

                                                        <div className="aspect-[4/5] bg-neutral-100">

                                                            {item.images?.[0] ? (

                                                                <img
                                                                    src={
                                                                        item.images[0]
                                                                    }
                                                                    alt={
                                                                        item.title
                                                                    }
                                                                    className="w-full h-full object-cover"
                                                                />

                                                            ) : (

                                                                <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
                                                                    No Image
                                                                </div>

                                                            )}

                                                        </div>


                                                        <div className="p-3">

                                                            <p className="text-sm font-medium truncate">
                                                                {
                                                                    item.title
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs text-neutral-500">
                                                                ₹
                                                                {
                                                                    item.estimatedSwapValue
                                                                }
                                                            </p>

                                                        </div>

                                                    </button>

                                                );

                                            }
                                        )}

                                    </div>


                                    {/* Comparison */}
                                    {selectedOfferedItem && (

                                        <div className="mt-6">

                                            {comparisonLoading ? (

                                                <div className="p-5 rounded-xl bg-neutral-50 text-center">

                                                    <div className="flex items-center justify-center gap-2">

                                                        <span className="w-4 h-4 border-2 border-neutral-300 border-t-black rounded-full animate-spin" />

                                                        <p className="text-sm text-neutral-500">
                                                            Comparing swap values...
                                                        </p>

                                                    </div>

                                                </div>

                                            ) : comparisonError ? (

                                                <div className="p-5 rounded-xl border border-red-200 bg-red-50">

                                                    <p className="text-sm font-medium text-red-700">
                                                        Comparison failed
                                                    </p>

                                                    <p className="mt-1 text-xs text-red-600">
                                                        {comparisonError}
                                                    </p>

                                                </div>

                                            ) : comparison ? (

                                                <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200">

                                                    <div className="flex items-center justify-between">

                                                        <h3 className="text-sm font-semibold">
                                                            Swap Value Comparison
                                                        </h3>

                                                        <span
                                                            className={`
                                                                px-3 py-1 rounded-full text-[11px] font-medium
                                                                ${
                                                                    comparison.recommendation ===
                                                                    "excellent_match"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : comparison.recommendation ===
                                                                          "good_match"
                                                                        ? "bg-blue-100 text-blue-700"
                                                                        : comparison.recommendation ===
                                                                          "fair_match"
                                                                        ? "bg-yellow-100 text-yellow-700"
                                                                        : "bg-red-100 text-red-700"
                                                                }
                                                            `}
                                                        >
                                                            {
                                                                recommendationText[
                                                                    comparison.recommendation
                                                                ] ||
                                                                "Value Difference"
                                                            }
                                                        </span>

                                                    </div>


                                                    <div className="grid grid-cols-2 gap-3 mt-4">

                                                        <div className="p-3 rounded-lg bg-white">

                                                            <p className="text-[11px] uppercase tracking-wider text-neutral-400">
                                                                Your Item
                                                            </p>

                                                            <p className="mt-1 text-base font-semibold">
                                                                ₹
                                                                {
                                                                    comparison.offeredValue
                                                                }
                                                            </p>

                                                        </div>


                                                        <div className="p-3 rounded-lg bg-white">

                                                            <p className="text-[11px] uppercase tracking-wider text-neutral-400">
                                                                Requested Item
                                                            </p>

                                                            <p className="mt-1 text-base font-semibold">
                                                                ₹
                                                                {
                                                                    comparison.requestedValue
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>


                                                    <div className="grid grid-cols-2 gap-3 mt-3">

                                                        <div className="p-3 rounded-lg bg-white">

                                                            <p className="text-[11px] uppercase tracking-wider text-neutral-400">
                                                                Difference
                                                            </p>

                                                            <p className="mt-1 text-sm font-semibold">
                                                                ₹
                                                                {
                                                                    comparison.difference
                                                                }
                                                            </p>

                                                        </div>


                                                        <div className="p-3 rounded-lg bg-white">

                                                            <p className="text-[11px] uppercase tracking-wider text-neutral-400">
                                                                Difference %
                                                            </p>

                                                            <p className="mt-1 text-sm font-semibold">
                                                                {
                                                                    comparison.differencePercentage
                                                                }
                                                                %
                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>

                                            ) : null}

                                        </div>

                                    )}


                                    {/* Message */}
                                    <div className="mt-6">

                                        <label
                                            htmlFor="swap-message"
                                            className="block text-xs uppercase tracking-wider font-medium text-neutral-600 mb-2"
                                        >
                                            Message
                                        </label>

                                        <textarea
                                            id="swap-message"
                                            value={message}
                                            onChange={(e) =>
                                                setMessage(
                                                    e.target.value
                                                )
                                            }
                                            maxLength={500}
                                            rows={4}
                                            placeholder="Add a message..."
                                            disabled={
                                                swapLoading
                                            }
                                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-none resize-none text-sm focus:border-black disabled:bg-neutral-50"
                                        />

                                        <p className="mt-1 text-right text-[11px] text-neutral-400">
                                            {message.length}/500
                                        </p>

                                    </div>

                                </>

                            )}

                        </div>


                        {/* Footer */}
                        {availableListings.length > 0 && (

                            <div className="px-6 py-5 border-t border-neutral-200 flex gap-3">

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!swapLoading) {
                                            setSwapModalOpen(
                                                false
                                            );
                                        }
                                    }}
                                    disabled={swapLoading}
                                    className="flex-1 py-3 rounded-full border border-neutral-200 text-sm font-medium hover:bg-neutral-50 transition disabled:opacity-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        handleSendSwapRequest
                                    }
                                    disabled={
                                        swapLoading ||
                                        comparisonLoading ||
                                        !selectedOfferedItem ||
                                        !comparison
                                    }
                                    className="flex-1 py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {swapLoading
                                        ? "Sending..."
                                        : comparisonLoading
                                        ? "Comparing..."
                                        : "Send Request"}
                                </button>

                            </div>

                        )}

                    </div>

                </div>

            )}

        </main>
    );
};

export default ClothingDetail;