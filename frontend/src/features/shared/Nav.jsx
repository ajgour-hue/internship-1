import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";

import { getUnreadCount } from "../clothing/service/notification.api.js";


const Nav = () => {

    const navigate = useNavigate();


    const user = useSelector(
        (state) => state.auth.user
    );


    const [unreadCount, setUnreadCount] = useState(0);


    // Get unread notification count
    const fetchUnreadCount = async () => {

        try {

            const data =
                await getUnreadCount();

            setUnreadCount(
                data?.count ??
                data?.unreadCount ??
                0
            );

        } catch (error) {

            console.error(
                "Unread notification count error:",
                error
            );

        }

    };


useEffect(() => {

    if (!user) {

        setUnreadCount(0);

        return;
    }


    fetchUnreadCount();


    const interval = setInterval(
        fetchUnreadCount,
        30000
    );


    const handleNotificationsUpdated = () => {
        fetchUnreadCount();
    };


    window.addEventListener(
        "notifications-updated",
        handleNotificationsUpdated
    );


    return () => {

        clearInterval(interval);

        window.removeEventListener(
            "notifications-updated",
            handleNotificationsUpdated
        );

    };

}, [user]);

    const handleLogout = () => {

        navigate("/login");

    };


    return (

        <nav
            className="
                sticky top-0 z-50 w-full h-[72px]
                px-6 md:px-10 lg:px-20
                flex items-center justify-between
                bg-white/80 backdrop-blur-xl
                border-b border-neutral-200/70
            "
        >

            {/* Logo */}

            <Link
                to="/"
                className="flex items-center gap-2.5 group"
            >

                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 100 60"
                    fill="none"
                    className="transition-transform duration-300 group-hover:-translate-y-0.5"
                >

                    <path
                        d="M50 18 L20 44 L80 44 L50 18 Z"
                        stroke="#000000"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />

                    <line
                        x1="20"
                        y1="44"
                        x2="80"
                        y2="44"
                        stroke="#000000"
                        strokeWidth="3"
                    />

                    <path
                        d="M50 18 C50 12 46 8 40 8"
                        fill="none"
                        stroke="#000000"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />

                </svg>


                <span className="text-lg font-semibold tracking-[0.2em] transition-opacity duration-300 group-hover:opacity-70">
                    FashionKart
                </span>

            </Link>



            {/* Right Side */}

            <div className="flex items-center gap-5 sm:gap-7">

                {user ? (

                    <>

                        {/* Navigation */}

                        <div className="hidden sm:flex items-center gap-7 uppercase tracking-[2px] text-xs font-medium text-neutral-500">

                            <Link
                                to="/"
                                className="hover:text-black transition-colors"
                            >
                                Explore
                            </Link>


                            <Link
                                to="/my-clothes"
                                className="hover:text-black transition-colors"
                            >
                                My Clothes
                            </Link>


                            <Link
                                to="/create-clothing"
                                className="hover:text-black transition-colors"
                            >
                                List Clothing
                            </Link>

                        </div>



                        {/* Divider */}

                        <div className="hidden sm:block w-px h-6 bg-neutral-200" />



                        {/* Notification */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/notifications"
                                )
                            }
                            className="
                                relative
                                w-10 h-10
                                rounded-full
                                flex items-center justify-center
                                text-neutral-500
                                hover:text-black
                                hover:bg-neutral-100
                                transition
                            "
                            aria-label="Notifications"
                        >

                            <i className="ri-notification-3-line text-xl" />


                            {unreadCount > 0 && (

                                <span
                                    className="
                                        absolute
                                        -top-0.5
                                        -right-0.5
                                        min-w-[18px]
                                        h-[18px]
                                        px-1
                                        rounded-full
                                        bg-black
                                        text-white
                                        text-[10px]
                                        font-semibold
                                        flex items-center justify-center
                                        border-2 border-white
                                    "
                                >
                                    {unreadCount > 99
                                        ? "99+"
                                        : unreadCount}
                                </span>

                            )}

                        </button>



                        {/* Profile */}

                        <ProfileMenu
                            user={user}
                            onLogout={handleLogout}
                        />

                    </>

                ) : (

                    <div className="flex items-center gap-3 uppercase tracking-[2px] text-xs font-medium">

                        <Link
                            to="/login"
                            className="text-neutral-500 hover:text-black transition-colors px-4 py-2"
                        >
                            Sign In
                        </Link>


                        <Link
                            to="/register"
                            className="bg-black text-white px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-colors"
                        >
                            Sign Up
                        </Link>

                    </div>

                )}

            </div>

        </nav>

    );

};


export default Nav;