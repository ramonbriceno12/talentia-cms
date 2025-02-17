import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-[#244c56] via-[#244c56] to-[#349390] p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image src="/img/LOGO-04.png" alt="Logo" width={150} height={50} />
        </div>
        {children}
      </div>
    </div>
  );
}
