import axios from "axios";

const authApiInstance = axios.create({
    baseURL: `${
        import.meta.env.VITE_BACKEND_URL ||
        "https://internship-1-vafq.onrender.com"
    }/api/auth`,
    withCredentials: true,
});


export async function register(
    email,
    contact,
    password,
    fullname
) {

    const response =
        await authApiInstance.post(
            "/register",
            {
                email,
                contact,
                password,
                fullname
            }
        );

    return response.data;
}


export async function login(
    email,
    password
) {

    const response =
        await authApiInstance.post(
            "/login",
            {
                email,
                password
            }
        );

    return response.data;
}


export async function getMe() {

    const response =
        await authApiInstance.get("/me");

    return response.data;
}

export async function updateProfile(profileData) {
    const response = await authApiInstance.patch(
        "/profile",
        profileData
    );

    return response.data;
}