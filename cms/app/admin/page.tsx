"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import LinksDashboard from "./components/links/Links";

// Import charts dynamically (to prevent SSR issues)
const LineChart = dynamic(() => import("./components/charts/LineChart"), { ssr: false });

export default function Dashboard() {
    const [selectedRange, setSelectedRange] = useState<string>("7days");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [showCustomPicker, setShowCustomPicker] = useState(false);
    const [stats, setStats] = useState({
        talents: 0,
        proposals: 0,
        companies: 0,
        jobs: 0,
    });

    // Handle Date Selection
    const handleDateRange = (range: string) => {
        setSelectedRange(range);
        setShowCustomPicker(false); // Hide manual picker

        let start, end;
        const today = dayjs();

        switch (range) {
            case "day":
                start = today.startOf("day").toDate();
                end = today.endOf("day").toDate();
                break;
            case "week":
                start = today.startOf("week").toDate();
                end = today.endOf("week").toDate();
                break;
            case "7days":
                start = today.subtract(7, "days").toDate();
                end = today.toDate();
                break;
            case "month":
                start = today.startOf("month").toDate();
                end = today.endOf("month").toDate();
                break;
            case "30days":
                start = today.subtract(30, "days").toDate();
                end = today.toDate();
                break;
            case "custom":
                setShowCustomPicker(true);
                return;
            default:
                return;
        }

        setStartDate(start);
        setEndDate(end);
    };

    // Simulate fetching data
    useEffect(() => {
        generateRandomData();
    }, [startDate, endDate]);

    const generateRandomData = () => {
        setStats({
            talents: Math.floor(Math.random() * 100),
            proposals: Math.floor(Math.random() * 100),
            companies: Math.floor(Math.random() * 50),
            jobs: Math.floor(Math.random() * 70),
        });
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-[#244c56] mb-4">Dashboard</h2>

            {/* Date Range Buttons */}
            <div className="mb-6 flex flex-wrap gap-2">
                {["day", "week", "7days", "month", "30days", "custom"].map((range) => (
                    <button
                        key={range}
                        onClick={() => handleDateRange(range)}
                        className={`px-4 py-2 rounded-md text-white ${
                            selectedRange === range ? "bg-[#244c56]" : "bg-gray-400"
                        }`}
                    >
                        {range === "day"
                            ? "Today"
                            : range === "week"
                            ? "Week"
                            : range === "7days"
                            ? "Last 7 Days"
                            : range === "month"
                            ? "Month"
                            : range === "30days"
                            ? "Last 30 Days"
                            : "Custom"}
                    </button>
                ))}
            </div>

            {/* Custom Date Picker */}
            {showCustomPicker && (
                <div className="mb-6 flex space-x-4">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Start Date"
                        className="border p-2 rounded-md text-[#244c56]"
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="End Date"
                        className="border p-2 rounded-md text-[#244c56]"
                    />
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="New Talents" value={stats.talents} />
                <StatCard title="New Proposals" value={stats.proposals} />
                <StatCard title="New Companies" value={stats.companies} />
                <StatCard title="New Job Offers" value={stats.jobs} />
            </div>

            {/* Charts */}
            <div className="mt-8 mb-6">
                <LineChart data={stats} />
            </div>

            {/* Links Performance */}
            <div className="mb-6">
                <LinksDashboard />
            </div>

        </div>
    );
}

// Reusable Card Component
const StatCard = ({ title, value }: { title: string; value: number }) => {
    return (
        <div className="bg-white shadow-md p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-[#244c56]">{title}</h3>
            <p className="text-3xl font-bold text-[#10282c]">{value}</p>
        </div>
    );
};
