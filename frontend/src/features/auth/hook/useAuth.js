import {
    register,
    login,
    getMe,
    updateProfile
} from "../service/auth.api.js";

import {
    setError,
    setLoading,
    setUser
} from "../state/auth.slice.js";

import { useDispatch } from "react-redux";


export const useAuth = () => {

    const dispatch = useDispatch();


    // Register
    async function handleRegister({
        email,
        contact,
        password,
        fullname
    }) {

        try {

            dispatch(setLoading(true));
            dispatch(setError(null));

            const data = await register(
                email,
                contact,
                password,
                fullname
            );

            dispatch(
                setUser(data.user)
            );

            return data.user;

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Registration failed";

            dispatch(
                setError(message)
            );

            throw error;

        } finally {

            dispatch(
                setLoading(false)
            );
        }
    }


    // Login
    async function handleLogin({
        email,
        password
    }) {

        try {

            dispatch(setLoading(true));
            dispatch(setError(null));

            const data = await login(
                email,
                password
            );

            dispatch(
                setUser(data.user)
            );

            return data.user;

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Login failed";

            dispatch(
                setError(message)
            );

            throw error;

        } finally {

            dispatch(
                setLoading(false)
            );
        }
    }


    // Get logged-in user
    async function handleGetMe() {

        try {

            dispatch(
                setLoading(true)
            );

            dispatch(
                setError(null)
            );

            const data = await getMe();

            dispatch(
                setUser(data.user)
            );

            return data.user;

        } catch (error) {

            dispatch(
                setUser(null)
            );

            const status =
                error.response?.status;

            if (status !== 401) {

                const message =
                    error.response?.data?.message ||
                    "Failed to fetch user";

                dispatch(
                    setError(message)
                );
            }

            return null;

        } finally {

            dispatch(
                setLoading(false)
            );
        }
    }

    async function handleUpdateProfile(profileData) {
    try {
        const data = await updateProfile(profileData);

        dispatch(setUser(data.user));

        return data.user;

    } catch (error) {
        throw error;
    }
}

 return {
    handleRegister,
    handleLogin,
    handleGetMe,
    handleUpdateProfile
};
};