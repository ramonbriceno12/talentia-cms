"use client";

import AuthForm from "@/app/components/auth/AuthForm";

export default function LoginPage() {
  return <AuthForm title="Login" buttonText="Sign In" onSubmitUrl="http://localhost:5000/api/auth/login" showName={false} />;
}
