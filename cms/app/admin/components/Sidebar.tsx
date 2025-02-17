"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Talents", href: "/admin/talents" },
    // { name: "Companies", href: "/admin/companies" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-screen bg-[#244c56] text-white fixed top-0 left-0 flex flex-col">
            <div className="p-6 text-xl font-bold">Admin Panel</div>
            <nav className="flex flex-col flex-1 space-y-2 p-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`p-3 rounded-md ${pathname === item.href ? "bg-[#349390]" : "hover:bg-[#2d5a64]"}`}
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
