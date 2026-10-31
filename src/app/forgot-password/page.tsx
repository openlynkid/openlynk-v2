import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/modules/auth";

export const metadata: Metadata = {
  title: "Lupa Kata Sandi — OpenLynk",
  description: "Kirim tautan reset kata sandi ke alamat email Anda.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-center items-center px-4 py-12 selection:bg-neutral-800 overflow-x-hidden w-full">
      <ForgotPasswordForm />
    </div>
  );
}
