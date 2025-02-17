"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Talent {
    id: number;
    full_name: string;
    email: string;
    bio: string;
    profile_picture: string | null;
    resume_file: string | null;
    is_featured: boolean;
    createdAt: string;
    job_title?: { name: string };
}

export default function TalentsPage() {

    const router = useRouter();

    const [talents, setTalents] = useState<Talent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchTalents();
    }, [search, page]);

    const fetchTalents = async () => {
        setLoading(true);
        try {

            const response = await fetch(
                `http://localhost:5000/api/talents?search=${search}&page=${page}&limit=10`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                }
            );

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to load talents");

            setTalents(data.talents);
            setTotalPages(data.totalPages);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const deactivateTalent = async (id: number) => {

        if (!confirm("Are you sure you want to deactivate this talent?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/talents/deactivate/${id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to deactivate talent");

            setTalents((prevTalents) =>
                prevTalents.map((talent) =>
                    talent.id === id ? { ...talent, is_featured: false } : talent
                )
            );

        } catch (err: any) {
            setError(err.message);
        }
    }

    const activateTalent = async (id: number) => {

        if (!confirm("Are you sure you want to activate this talent?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/talents/activate/${id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to activate talent");

            setTalents((prevTalents) =>
                prevTalents.map((talent) =>
                    talent.id === id ? { ...talent, is_featured: true } : talent
                )
            );

        } catch (err: any) {
            setError(err.message);
        }
    }

    return (
        <div className="bg-white shadow-md p-6 rounded-lg h-full flex flex-col">
            <h2 className="text-2xl font-bold text-[#244c56]">Talents</h2>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search talents by name..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value.toLowerCase());
                    setPage(1); // Reset to first page on search
                }}
                className="border p-2 rounded-md w-full my-4 text-[#10282c]"
            />

            {loading ? (
                <p>Loading talents...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 text-gray-800">
                            <thead>
                                <tr className="bg-gray-200 text-gray-900 font-semibold">
                                    <th className="border p-3 text-left">Profile</th>
                                    <th className="border p-3 text-left">Full Name</th>
                                    <th className="border p-3 text-left">Email</th>
                                    <th className="border p-3 text-left">Job Title</th>
                                    <th className="border p-3 text-left">Resume</th>
                                    <th className="border p-3 text-left">Created At</th>
                                    <th className="border p-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {talents.map((talent) => (
                                    <tr key={talent.id} className="hover:bg-gray-100 text-gray-900">
                                        <td className="border p-3">
                                            {talent.profile_picture ? (
                                                <img
                                                    src={talent.profile_picture}
                                                    alt="Profile"
                                                    className="w-10 h-10 rounded-full"
                                                />
                                            ) : (
                                                "N/A"
                                            )}
                                        </td>
                                        <td className="border p-3">{talent.full_name}</td>
                                        <td className="border p-3">{talent.email}</td>
                                        <td className="border p-3">{talent.job_title?.title || "N/A"}</td>
                                        <td className="border p-3">
                                            {talent.resume_file ? (
                                                <a
                                                    href={talent.resume_file}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-[#244c56] hover:underline"
                                                >
                                                    View Resume
                                                </a>
                                            ) : (
                                                "N/A"
                                            )}
                                        </td>
                                        <td className="border p-3">
                                            {new Date(talent.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="border p-3">
                                            <button onClick={() => router.push(`/admin/talents/${talent.id}`)} className="text-[#244c56] hover:underline mr-2">🖊️</button>
                                            {talent.is_featured ? (
                                                <button onClick={() => deactivateTalent(talent.id)} className="text-red-500 hover:underline">🗙</button>
                                            ) : (
                                                <button onClick={() => activateTalent(talent.id)} className="text-gray-500 hover:underline">⭐</button>
                                            )}

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            className={`px-4 py-2 rounded-md ${page === 1
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-[#244c56] text-white hover:bg-[#10282c]"
                                }`}
                        >
                            Previous
                        </button>
                        <span className="text-gray-700">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages}
                            className={`px-4 py-2 rounded-md ${page === totalPages
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-[#244c56] text-white hover:bg-[#10282c]"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
