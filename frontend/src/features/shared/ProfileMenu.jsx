import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const ProfileMenu = ({ user, onLogout }) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const handleLogout = () => {
        setOpen(false);
        onLogout();
    };

    return (
        <div
            className="relative"
            ref={menuRef}
        >
            {/* Profile Button */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="
                    w-9 h-9 rounded-full
                    bg-neutral-100
                    flex items-center justify-center
                    hover:bg-neutral-200
                    transition
                "
                aria-label="Open profile menu"
                aria-expanded={open}
            >
                <i className="ri-user-3-line text-lg text-neutral-600" />
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    className="
                        absolute right-0 mt-2
                        w-60 py-2
                        rounded-xl
                        bg-white
                        border border-neutral-200
                        shadow-lg
                        z-50
                    "
                >

                    {/* User Information */}
                    <div className="px-4 py-3 border-b border-neutral-100">

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    w-10 h-10 rounded-full
                                    bg-neutral-100
                                    flex items-center justify-center
                                    shrink-0
                                "
                            >
                                <i className="ri-user-3-line text-lg text-neutral-500" />
                            </div>

                            <div className="min-w-0">

                                <p className="text-sm font-medium text-neutral-900 truncate">
                                    {user?.fullname || "User"}
                                </p>

                                <p className="text-xs text-neutral-500 truncate">
                                    {user?.email || ""}
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Profile */}
                    <Link
                        to="/profile"
                        onClick={() => setOpen(false)}
                        className="
                            w-full flex items-center gap-2
                            px-4 py-2.5
                            text-sm text-neutral-600
                            hover:bg-neutral-50
                            hover:text-black
                            transition
                        "
                    >
                        <i className="ri-user-line text-base" />
                        Profile
                    </Link>

                    {/* My Clothes */}
                    <Link
                        to="/my-clothes"
                        onClick={() => setOpen(false)}
                        className="
                            w-full flex items-center gap-2
                            px-4 py-2.5
                            text-sm text-neutral-600
                            hover:bg-neutral-50
                            hover:text-black
                            transition
                        "
                    >
                        <i className="ri-t-shirt-line text-base" />
                        My Clothes
                    </Link>

                    {/* Logout */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="
                            w-full flex items-center gap-2
                            text-left
                            px-4 py-2.5 mt-1
                            border-t border-neutral-100
                            text-sm text-neutral-600
                            hover:bg-neutral-50
                            hover:text-black
                            transition
                        "
                    >
                        <i className="ri-logout-box-r-line text-base" />
                        Logout
                    </button>

                </div>
            )}
        </div>
    );
};

export default ProfileMenu;