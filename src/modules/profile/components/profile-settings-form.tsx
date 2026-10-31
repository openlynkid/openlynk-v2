"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Profile } from "@/db/schema";
import type { SocialLinks } from "../types";
import { upsertProfile } from "../server/profile-service";

interface ProfileSettingsFormProps {
  userId: string;
  initialProfile: Profile | null;
}

export function ProfileSettingsForm({
  userId,
  initialProfile,
}: ProfileSettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const initialSocial = (initialProfile?.socialLinks ?? {}) as SocialLinks;

  const [username, setUsername] = useState(initialProfile?.username ?? "");
  const [displayName, setDisplayName] = useState(
    initialProfile?.displayName ?? ""
  );
  const [bio, setBio] = useState(initialProfile?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatarUrl ?? "");
  const [instagram, setInstagram] = useState(initialSocial.instagram ?? "");
  const [tiktok, setTiktok] = useState(initialSocial.tiktok ?? "");
  const [youtube, setYoutube] = useState(initialSocial.youtube ?? "");
  const [twitter, setTwitter] = useState(initialSocial.twitter ?? "");
  const [whatsapp, setWhatsapp] = useState(initialSocial.whatsapp ?? "");
  const [github, setGithub] = useState(initialSocial.github ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const res = await upsertProfile(userId, {
        username,
        displayName,
        bio,
        avatarUrl,
        socialLinks: {
          instagram: instagram ? instagram.trim() : undefined,
          tiktok: tiktok ? tiktok.trim() : undefined,
          youtube: youtube ? youtube.trim() : undefined,
          twitter: twitter ? twitter.trim() : undefined,
          whatsapp: whatsapp ? whatsapp.trim() : undefined,
          github: github ? github.trim() : undefined,
        },
      });

      if (!res.success) {
        setErrorMessage(res.error);
      } else {
        setSuccessMessage("Profil akun berhasil diperbarui!");
        router.refresh();
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 sm:p-6 rounded-2xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl shadow-xl space-y-5 w-full min-w-0"
    >
      <div>
        <h2 className="text-lg font-semibold text-white tracking-tight">
          Profil Akun Kreator
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
          Kelola identitas utama akun Anda. Akun ini dapat memiliki beberapa halaman micro-site publik.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm">
          {successMessage}
        </div>
      )}

      <div className="space-y-4">
        {/* Username Handle */}
        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1.5">
            Handle Akun (Username) <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center rounded-xl border border-white/10 bg-neutral-950/60 focus-within:border-indigo-500/80 transition overflow-hidden min-w-0 w-full">
            <span className="px-3 py-2.5 text-xs sm:text-sm text-neutral-500 bg-white/[0.02] border-r border-white/5 select-none font-mono shrink-0">
              @
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
              placeholder="username"
              required
              minLength={3}
              maxLength={30}
              className="w-full min-w-0 bg-transparent px-3 py-2 text-sm text-white placeholder:text-neutral-600 outline-none font-mono"
            />
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">
            Identitas akun Anda di platform OpenLynk.
          </p>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1.5">
            Nama Lengkap / Brand <span className="text-red-400">*</span>
          </label>
          <Input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="misal: Budi Santoso"
            required
            maxLength={50}
            className="border-white/10 bg-neutral-950/60 text-white placeholder:text-neutral-600"
          />
        </div>

        {/* Bio */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-medium text-neutral-300">
              Bio Diri
            </label>
            <span className="text-[10px] text-neutral-500">
              {bio.length}/160
            </span>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 160))}
            rows={3}
            placeholder="Deskripsi singkat tentang diri Anda, bidang keahlian, atau visi karya Anda..."
            className="w-full rounded-xl border border-white/10 bg-neutral-950/60 p-3 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-indigo-500/80 transition resize-none"
          />
        </div>

        {/* Avatar URL */}
        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1.5">
            URL Foto Profil / Avatar
          </label>
          <Input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://ik.imagekit.io/... atau url gambar publik"
            className="border-white/10 bg-neutral-950/60 text-white placeholder:text-neutral-600"
          />
        </div>

        {/* Social Media Links */}
        <div className="pt-2 border-t border-white/5">
          <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-3">
            Media Sosial Resmi
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">
                Instagram (@username)
              </label>
              <Input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@username"
                className="border-white/10 bg-neutral-950/60 text-white text-xs placeholder:text-neutral-600"
              />
            </div>

            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">
                TikTok (@username)
              </label>
              <Input
                type="text"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                placeholder="@username"
                className="border-white/10 bg-neutral-950/60 text-white text-xs placeholder:text-neutral-600"
              />
            </div>

            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">
                YouTube (URL / channel)
              </label>
              <Input
                type="text"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="https://youtube.com/@channel"
                className="border-white/10 bg-neutral-950/60 text-white text-xs placeholder:text-neutral-600"
              />
            </div>

            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">
                WhatsApp (No. HP kode 62)
              </label>
              <Input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="6281234567890"
                className="border-white/10 bg-neutral-950/60 text-white text-xs placeholder:text-neutral-600"
              />
            </div>

            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">
                X / Twitter (@username)
              </label>
              <Input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="@username"
                className="border-white/10 bg-neutral-950/60 text-white text-xs placeholder:text-neutral-600"
              />
            </div>

            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">
                GitHub (@username)
              </label>
              <Input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="@username"
                className="border-white/10 bg-neutral-950/60 text-white text-xs placeholder:text-neutral-600"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl px-5 h-10 text-xs sm:text-sm min-h-[44px]"
        >
          {isPending ? "Menyimpan..." : "Simpan Profil Akun"}
        </Button>
      </div>
    </form>
  );
}
