"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/admin"); // Redirect to admin if token exists
    } else {
      router.push("/auth/login"); // Redirect to login if no token
    }
  }, [router]);

  return null; // Prevent rendering anything on this page
}
