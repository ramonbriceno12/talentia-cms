"use client";

import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default function LineChart({ data }: { data: any }) {
    const chartData = {
        labels: ["Talents", "Proposals", "Companies", "Jobs"],
        datasets: [
            {
                label: "New Entries",
                data: [data.talents, data.proposals, data.companies, data.jobs],
                borderColor: "#244c56",
                backgroundColor: "rgba(36, 76, 86, 0.2)",
                fill: true,
            },
        ],
    };

    return (
        <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-[#244c56] mb-4">Trends</h3>
            <Line data={chartData} />
        </div>
    );
}
