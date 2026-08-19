import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/hook/useAuth";

const LocationSetup = () => {
    const navigate = useNavigate();

    const { handleUpdateProfile } = useAuth();

    const [formData, setFormData] = useState({
        city: "",
        state: "",
        pincode: "",
    });

    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);

    const [coordinates, setCoordinates] = useState(null);


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleGetLocation = () => {

        if (!navigator.geolocation) {
            toast.error(
                "Geolocation is not supported by your browser"
            );
            return;
        }

        setLocationLoading(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {

                const {
                    latitude,
                    longitude,
                } = position.coords;

                setCoordinates({
                    latitude,
                    longitude,
                });

                setLocationLoading(false);

                toast.success(
                    "Location detected successfully"
                );
            },

            (error) => {

                console.error(
                    "Geolocation error:",
                    error
                );

                setLocationLoading(false);

                toast.error(
                    "Unable to get your location. Please allow location access."
                );
            },

            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!coordinates) {
            toast.error(
                "Please detect your location first"
            );
            return;
        }

        try {

            setLoading(true);

            const user = await handleUpdateProfile({
                location: {
                    city: formData.city.trim(),
                    state: formData.state.trim(),
                    pincode: formData.pincode.trim(),

                    coordinates: {
                        type: "Point",

                        // GeoJSON = [longitude, latitude]
                        coordinates: [
                            coordinates.longitude,
                            coordinates.latitude,
                        ],
                    },
                },
            });

            if (user) {
                toast.success(
                    "Location saved successfully"
                );
            }

            navigate("/nearby-clothes");

        } catch (error) {

            console.error(
                "Location update error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to save location"
            );

        } finally {
            setLoading(false);
        }
    };


    return (
        <main className="min-h-screen bg-white px-6 md:px-10 lg:px-20 py-12">

            <div className="max-w-xl mx-auto">

                {/* Header */}
                <div className="mb-8">

                    <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                        FashionKart
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold text-black">
                        Set Your Location
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-neutral-500">
                        Your location helps us find clothes available
                        for swapping near you.
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="border border-neutral-200 rounded-2xl p-6 md:p-8"
                >

                    {/* Detect Location */}
                    <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={locationLoading}
                        className="w-full py-3.5 rounded-full border border-black text-black text-sm font-medium hover:bg-black hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {locationLoading
                            ? "Detecting Location..."
                            : coordinates
                            ? "Location Detected ✓"
                            : "Detect My Location"}
                    </button>


                    {/* Coordinates */}
                    {coordinates && (
                        <div className="mt-4 p-4 rounded-xl bg-neutral-50">

                            <p className="text-xs uppercase tracking-wider text-neutral-400">
                                Coordinates
                            </p>

                            <p className="mt-2 text-sm text-neutral-700">
                                Latitude: {coordinates.latitude}
                            </p>

                            <p className="mt-1 text-sm text-neutral-700">
                                Longitude: {coordinates.longitude}
                            </p>

                        </div>
                    )}


                    {/* City */}
                    <div className="mt-6">

                        <label
                            htmlFor="city"
                            className="block text-xs uppercase tracking-wider font-medium text-neutral-600 mb-2"
                        >
                            City
                        </label>

                        <input
                            id="city"
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            placeholder="Bhopal"
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-black"
                        />

                    </div>


                    {/* State */}
                    <div className="mt-5">

                        <label
                            htmlFor="state"
                            className="block text-xs uppercase tracking-wider font-medium text-neutral-600 mb-2"
                        >
                            State
                        </label>

                        <input
                            id="state"
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                            placeholder="Madhya Pradesh"
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-black"
                        />

                    </div>


                    {/* Pincode */}
                    <div className="mt-5">

                        <label
                            htmlFor="pincode"
                            className="block text-xs uppercase tracking-wider font-medium text-neutral-600 mb-2"
                        >
                            Pincode
                        </label>

                        <input
                            id="pincode"
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            required
                            placeholder="462001"
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-black"
                        />

                    </div>


                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading || !coordinates}
                        className="mt-8 w-full py-3.5 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading
                            ? "Saving Location..."
                            : "Save Location"}
                    </button>

                </form>

            </div>

        </main>
    );
};

export default LocationSetup;