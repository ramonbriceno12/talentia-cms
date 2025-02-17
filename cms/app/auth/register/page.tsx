"use client";

import { useRouter } from "next/navigation";
import AuthForm from "@/app/components/auth/AuthForm";

export default function RegisterPage() {

  return <AuthForm title="Register" buttonText="Sign Up" onSubmitUrl="http://localhost:5000/api/auth/register" showName={true}  />;
}
