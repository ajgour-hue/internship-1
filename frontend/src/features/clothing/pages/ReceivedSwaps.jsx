import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useSwap } from "../hook/useSwap";
import { getOptimizedImageUrl } from "../../shared/image.util.js";

const ReceivedSwaps = () => {

    const {
        handleGetReceivedSwapRequests,
        handleAcceptSwapRequest,
        handleRejectSwapRequest,
    } = useSwap();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);


    useEffect(() => {

        const fetchRequests = async () => {

            try {

                setLoading(true);

                const data =
                    await handleGetReceivedSwapRequests();

                setRequests(
                    data.requests || []
                );

            } catch (error) {

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to load received requests"
                );

            } finally {

                setLoading(false);
            }
        };

        fetchRequests();

    }, []);


    const handleAccept = async (swapId) => {

        const confirmed = window.confirm(
            "Are you sure you want to accept this swap request?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(swapId);

            await handleAcceptSwapRequest(swapId);

            setRequests((prev) =>
                prev.map((request) =>
                    request._id === swapId
                        ? {
                            ...request,
                            status: "accepted",
                        }
                        : request
                )
            );

            toast.success(
                "Swap request accepted"
            );

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Failed to accept request"
            );

        } finally {

            setActionLoading(null);
        }
    };


    const handleReject = async (swapId) => {

        const confirmed = window.confirm(
            "Are you sure you want to reject this swap request?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(swapId);

            await handleRejectSwapRequest(swapId);

            setRequests((prev) =>
                prev.map((request) =>
                    request._id === swapId
                        ? {
                            ...request,
                            status: "rejected",
                        }
                        : request
                )
            );

            toast.success(
                "Swap request rejected"
            );

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Failed to reject request"
            );

        } finally {

            setActionLoading(null);
        }
    };


    if (loading) {

        return (
            <main className="min-h-screen bg-white px-6 md:px-10 lg:px-20 py-12">

                <div className="max-w-6xl mx-auto">

                    <p className="text-sm text-neutral-500">
                        Loading received requests...
                    </p>

                </div>

            </main>
        );
    }


    return (
        <main className="min-h-screen bg-white">

            <section className="px-6 md:px-10 lg:px-20 py-12">

                <div className="max-w-6xl mx-auto">

                    {/* Header */}
                    <div className="mb-10">

                        <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                            My Swaps
                        </p>

                        <h1 className="mt-3 text-4xl md:text-5xl font-semibold">
                            Received Requests
                        </h1>

                        <p className="mt-3 text-neutral-500">
                            Manage swap requests sent to you.
                        </p>

                    </div>


                    {/* Empty */}
                    {requests.length === 0 ? (

                        <div className="border border-dashed border-neutral-200 rounded-2xl py-20 text-center">

                            <div className="w-14 h-14 mx-auto rounded-full bg-neutral-100 flex items-center justify-center">

                                <i className="ri-inbox-line text-xl text-neutral-500" />

                            </div>

                            <h2 className="mt-5 text-lg font-medium">
                                No received requests
                            </h2>

                            <p className="mt-2 text-sm text-neutral-500">
                                You don't have any swap requests yet.
                            </p>

                            <Link
                                to="/"
                                className="inline-flex mt-6 px-6 py-3 rounded-full bg-black text-white text-sm"
                            >
                                Explore Clothes
                            </Link>

                        </div>

                    ) : (

                        <div className="space-y-5">

                            {requests.map((request) => {

                                const isActionLoading =
                                    actionLoading === request._id;

                                return (

                                    <div
                                        key={request._id}
                                        className="border border-neutral-200 rounded-2xl p-5 md:p-6"
                                    >

                                        {/* Requester */}
                                        <div className="flex items-center justify-between gap-4 mb-6">

                                            <div className="flex items-center gap-3">

                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center">

                                                    {request.requester?.profileImage ? (

                                                        <img
                                                            src={getOptimizedImageUrl(request.requester.profileImage, 100, 100)}
                                                            alt={request.requester.fullname}
                                                            className="w-full h-full object-cover"
                                                        />

                                                    ) : (

                                                        <i className="ri-user-3-line text-neutral-500" />

                                                    )}

                                                </div>

                                                <div>

                                                    <p className="text-xs text-neutral-400">
                                                        Request from
                                                    </p>

                                                    <p className="text-sm font-medium">
                                                        {request.requester?.fullname || "Unknown user"}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* Status */}
                                            <span
                                                className={`
                                                    px-3 py-1.5 rounded-full text-xs font-medium
                                                    ${
                                                        request.status === "pending"
                                                            ? "bg-amber-50 text-amber-700"
                                                            : request.status === "accepted"
                                                                ? "bg-green-50 text-green-700"
                                                                : request.status === "rejected"
                                                                    ? "bg-red-50 text-red-700"
                                                                    : "bg-neutral-100 text-neutral-600"
                                                    }
                                                `}
                                            >
                                                {request.status}
                                            </span>

                                        </div>


                                        {/* Swap Items */}
                                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-5 items-center">

                                            {/* Offered by requester */}
                                            <div className="flex gap-4">

                                                <div className="w-24 h-28 rounded-xl overflow-hidden bg-neutral-100 shrink-0">

                                                    {request.offeredItem?.images?.[0] ? (

                                                        <img
                                                            src={getOptimizedImageUrl(request.offeredItem.images[0], 200, 250)}
                                                            alt={request.offeredItem.title}
                                                            className="w-full h-full object-cover"
                                                        />

                                                    ) : (

                                                        <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
                                                            No Image
                                                        </div>

                                                    )}

                                                </div>

                                                <div>

                                                    <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                                                        They Offer
                                                    </p>

                                                    <h3 className="mt-2 font-medium">
                                                        {request.offeredItem?.title || "Unknown item"}
                                                    </h3>

                                                    <p className="mt-1 text-sm text-neutral-500">
                                                        ₹{request.offeredItem?.estimatedSwapValue ?? 0}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* Swap icon */}
                                            <div className="hidden md:flex w-10 h-10 rounded-full bg-neutral-100 items-center justify-center">

                                                <i className="ri-arrow-left-right-line text-neutral-500" />

                                            </div>


                                            {/* Your requested item */}
                                            <div className="flex gap-4">

                                                <div className="w-24 h-28 rounded-xl overflow-hidden bg-neutral-100 shrink-0">

                                                    {request.requestedItem?.images?.[0] ? (

                                                        <img
                                                            src={getOptimizedImageUrl(request.requestedItem.images[0], 200, 250)}
                                                            alt={request.requestedItem.title}
                                                            className="w-full h-full object-cover"
                                                        />

                                                    ) : (

                                                        <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
                                                            No Image
                                                        </div>

                                                    )}

                                                </div>

                                                <div>

                                                    <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                                                        They Want
                                                    </p>

                                                    <h3 className="mt-2 font-medium">
                                                        {request.requestedItem?.title || "Unknown item"}
                                                    </h3>

                                                    <p className="mt-1 text-sm text-neutral-500">
                                                        ₹{request.requestedItem?.estimatedSwapValue ?? 0}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>


                                        {/* Message */}
                                        {request.message && (

                                            <div className="mt-6 p-4 rounded-xl bg-neutral-50">

                                                <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                                                    Message
                                                </p>

                                                <p className="mt-2 text-sm text-neutral-600">
                                                    {request.message}
                                                </p>

                                            </div>

                                        )}


                                        {/* Actions */}
                                        {request.status === "pending" && (

                                            <div className="mt-6 pt-5 border-t border-neutral-100 flex flex-col sm:flex-row gap-3 sm:justify-end">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleReject(request._id)
                                                    }
                                                    disabled={isActionLoading}
                                                    className="px-6 py-3 rounded-full border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-black transition disabled:opacity-50"
                                                >
                                                    {isActionLoading
                                                        ? "Processing..."
                                                        : "Reject"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleAccept(request._id)
                                                    }
                                                    disabled={isActionLoading}
                                                    className="px-6 py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition disabled:opacity-50"
                                                >
                                                    {isActionLoading
                                                        ? "Processing..."
                                                        : "Accept Swap"}
                                                </button>

                                            </div>

                                        )}

                                    </div>
                                );
                            })}

                        </div>

                    )}

                </div>

            </section>

        </main>
    );
};

export default ReceivedSwaps;