"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface LinkData {
    id: number;
    label: string;
    url: string;
    click_count: number;
}

export default function LinksDashboard() {
    const [links, setLinks] = useState<LinkData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // Main state for fetching data
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    // Temporary state for input selection
    const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
    const [tempEndDate, setTempEndDate] = useState<Date | null>(null);

    // Fetch when "Apply Filter" is clicked
    useEffect(() => {
        fetchLinks();
    }, [startDate, endDate]);

    const fetchLinks = async () => {
        setLoading(true);
        try {
            let url = "http://localhost:5000/api/links";
            if (startDate && endDate) {
                url += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
            }

            const response = await fetch(url);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to load links");

            setLinks(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔗 Links Performance</h2>

            {/* Date Filter */}
            <div className="flex gap-4 mb-4">
                <DatePicker
                    selected={tempStartDate}
                    onChange={(date) => setTempStartDate(date)}
                    className="border p-2 rounded text-[#244c56]"
                    placeholderText="Start Date"
                />
                <DatePicker
                    selected={tempEndDate}
                    onChange={(date) => setTempEndDate(date)}
                    className="border p-2 rounded text-[#244c56]"
                    placeholderText="End Date"
                />
                <button
                    className="px-4 py-2 bg-[#244c56] text-white rounded"
                    onClick={() => {
                        setStartDate(tempStartDate);
                        setEndDate(tempEndDate);
                    }}
                >
                    Apply Filter
                </button>
            </div>

            {loading ? (
                <p>Loading links...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 text-gray-800">
                        <thead>
                            <tr className="bg-gray-200 text-gray-900 font-semibold">
                                <th className="border p-3 text-left">Label</th>
                                <th className="border p-3 text-left">URL</th>
                                <th className="border p-3 text-left">Clicks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {links.map((link) => (
                                <tr key={link.id} className="hover:bg-gray-100 text-gray-900">
                                    <td className="border p-3">{link.label}</td>
                                    <td className="border p-3">
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {link.url}
                                        </a>
                                    </td>
                                    <td className="border p-3 font-bold text-gray-700">{link.click_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
