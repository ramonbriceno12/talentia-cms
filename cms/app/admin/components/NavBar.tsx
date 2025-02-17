"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove token
        router.push("/auth/login"); // Redirect to login
    };

    return (
        <header className="w-full h-16 bg-white shadow-md flex items-center justify-between px-6 fixed top-0 left-64 right-0">
            <h1 className="text-lg text-[#244c56] font-semibold">Admin Dashboard</h1>
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
                Logout
            </button>
        </header>
    );
}
