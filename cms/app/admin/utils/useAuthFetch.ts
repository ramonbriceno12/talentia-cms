"use client";

import { useRouter } from "next/navigation";

export const useAuthFetch = () => {
    const router = useRouter();

    const authFetch = async (url: string, options: RequestInit = {}) => {
        const token = localStorage.getItem("token");

        const headers = {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        };

        try {
            const response = await fetch(url, { ...options, headers });
            if (response.status === 403) {
                // Token is invalid or expired → Redirect to login
                localStorage.removeItem("token"); // Remove invalid token
                router.push("/auth/login");
                return null; // Stop execution
            }

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Something went wrong");

            return data;
        } catch (error: any) {
            console.error("Fetch error:", error.message);
            throw new Error(error.message || "Something went wrong");
        }
    };

    return authFetch;
};
