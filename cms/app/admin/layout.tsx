"use client";

import { useAuthRedirect } from "./utils/auth";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/NavBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useAuthRedirect(); // Protect route

  return (
    <div className="flex-1 p-6 pt-20 bg-gray-100 min-h-screen overflow-auto"> {/* Ensure full height */}
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Navbar />
        <main className="flex-1 p-6 bg-gray-100 min-h-screen"> {/* Fill available space */}
          {children}
        </main>
      </div>
    </div>
  );
}
