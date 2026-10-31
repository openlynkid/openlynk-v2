import type { Metadata } from "next";
import { ResetPasswordForm } from "@/modules/auth";

export const metadata: Metadata = {
  title: "Reset Kata Sandi — OpenLynk",
  description: "Buat kata sandi baru untuk akun OpenLynk Anda.",
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-center items-center px-4 py-12 selection:bg-neutral-800 overflow-x-hidden w-full">
      <ResetPasswordForm />
    </div>
  );
}
