"use client";

import { useRouter } from "next/navigation";
import AuthForm from "@/app/components/auth/AuthForm";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const handleForgotPassword = async (formData: { email: string }) => {
    console.log("Requesting password reset for", formData);
    // Call backend API later
  };

  return (
    <AuthForm title="Forgot Password" buttonText="Reset Password" onSubmit={handleForgotPassword} showPassword={false} showName={false} />
  );
}
