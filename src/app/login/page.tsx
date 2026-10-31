import type { Metadata } from "next";
import { LoginForm } from "@/modules/auth";

export const metadata: Metadata = {
  title: "Masuk / Daftar — OpenLynk",
  description: "Masuk ke akun OpenLynk Anda atau daftarkan akun baru.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-center items-center px-4 py-12 selection:bg-neutral-800">
      <LoginForm />
    </div>
  );
}
