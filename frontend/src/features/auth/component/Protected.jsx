import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const Protected = ({ children, role }) => {

    const user = useSelector(
        (state) => state.auth.user
    );

    const loading = useSelector(
        (state) => state.auth.loading
    );

    const location = useLocation();


    if (loading) {
        return (
            <div
                className="min-h-screen flex flex-col items-center justify-center gap-4"
                style={{
                    backgroundColor: "#fbf9f6"
                }}
            >
                <div className="relative w-14 h-14">

                    <div
                        className="absolute inset-0 rounded-full border-2"
                        style={{
                            borderColor: "#e8e5e1"
                        }}
                    />

                    <div
                        className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"
                        style={{
                            borderColor: "#C9A96E",
                            borderTopColor: "transparent"
                        }}
                    />

                </div>

                <p
                    className="text-xs uppercase tracking-[0.3em]"
                    style={{
                        color: "#7A6E63",
                        fontFamily: "'Inter', sans-serif"
                    }}
                >
                    Loading
                </p>
            </div>
        );
    }


    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location
                }}
            />
        );
    }


    // Role protection only when a role is explicitly provided
    if (role && user.role !== role) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }


    return children;
};

export default Protected;