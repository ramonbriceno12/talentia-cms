"use client";

import AuthForm from "@/app/components/auth/AuthForm";

export default function LoginPage() {
  return <AuthForm title="Login" buttonText="Sign In" onSubmitUrl="https://admin.talentiave.com/api/api/auth/login" showName={false} />;
}
