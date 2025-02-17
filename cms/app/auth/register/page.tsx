"use client";

import { useRouter } from "next/navigation";
import AuthForm from "@/app/components/auth/AuthForm";

export default function RegisterPage() {

  return <AuthForm title="Register" buttonText="Sign Up" onSubmitUrl="https://admin.talentiave.com/api/api/auth/register" showName={true}  />;
}
