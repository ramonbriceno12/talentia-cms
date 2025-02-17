"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AuthFormProps {
    title: string;
    buttonText: string;
    onSubmitUrl: string; // API URL (login or register)
    showPassword?: boolean;
    showName?: boolean;
}

export default function AuthForm({
    title,
    buttonText,
    onSubmitUrl,
    showPassword = true,
    showName = true,
}: AuthFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: "", password: "", name: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setLoading(true);
        setError("");

        formData.role = "admin";

        try {
            const response = await fetch(onSubmitUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) {
                // Login: User exists but no password is set
                if (response.status === 400 && data.message.includes("no password set")) {
                    return setError("This email exists, but no password is set. Please go to register.");
                }

                // Register: User already registered
                if (response.status === 409) {
                    return setError("User already registered. Please login instead.");
                }

                // Invalid credentials
                if (response.status === 401) {
                    return setError("Invalid email or password.");
                }

                throw new Error(data.message || "Something went wrong");
            }

            // Store token and redirect
            localStorage.setItem("token", data.user.token);
            router.push("/admin");
            console.log(data)
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                {showName && (
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-[#244c56] text-[#10282c]"
                        required
                    />
                )}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-[#244c56] text-[#10282c]"
                    required
                />
                {showPassword && (
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-[#244c56] text-[#10282c]"
                        required
                    />
                )}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="w-full rounded-lg bg-[#244c56] p-3 text-white hover:bg-[#10282c]"
                    disabled={loading}
                >
                    {loading ? "Processing..." : buttonText}
                </button>
            </form>

            {/* Conditional Links */}
            <div className="text-center text-sm text-gray-600">
                {title === "Login" ? (
                    <>
                        <p>
                            <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
                                Forgot Password?
                            </Link>
                        </p>
                        <p>
                            Don't have an account?{" "}
                            <Link href="/auth/register" className="text-blue-600 hover:underline">
                                Register
                            </Link>
                        </p>
                    </>
                ) : title === "Register" ? (
                    <p>
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-blue-600 hover:underline">
                            Login
                        </Link>
                    </p>
                ) : null}
            </div>
        </div>
    );
}
