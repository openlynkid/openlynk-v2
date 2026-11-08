"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SocialIcon } from "@/components/ui/social-icon";
import { RuneIcon } from "@/components/ui/rune-icon";
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

  const socialFields = [
    {
      platform: "instagram" as const,
      label: "Instagram",
      placeholder: "@username",
      value: instagram,
      setter: setInstagram,
    },
    {
      platform: "tiktok" as const,
      label: "TikTok",
      placeholder: "@username",
      value: tiktok,
      setter: setTiktok,
    },
    {
      platform: "youtube" as const,
      label: "YouTube",
      placeholder: "https://youtube.com/@channel",
      value: youtube,
      setter: setYoutube,
    },
    {
      platform: "whatsapp" as const,
      label: "WhatsApp",
      placeholder: "6281234567890",
      value: whatsapp,
      setter: setWhatsapp,
    },
    {
      platform: "twitter" as const,
      label: "X / Twitter",
      placeholder: "@username",
      value: twitter,
      setter: setTwitter,
    },
    {
      platform: "github" as const,
      label: "GitHub",
      placeholder: "@username",
      value: github,
      setter: setGithub,
    },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl rune-glass border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6 w-full min-w-0"
    >
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 size-80 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Header */}
      <div className="flex items-start gap-3.5 pb-4 border-b border-white/10">
        <div className="size-11 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
          <RuneIcon name="glass-circle-person" type="glass" size={24} />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Profil &amp; Identitas Kreator
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Atur username publik, bio pengenalan, avatar profil, serta seluruh tautan media sosial resmi.
          </p>
        </div>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
          <Check size={16} className="text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="space-y-5">
        {/* Username Handle */}
        <div className="space-y-1.5">
          <Label htmlFor="profile-username" className="text-xs font-medium text-neutral-300">
            Handle Akun (Username) <span className="text-red-400">*</span>
          </Label>
          <div className="flex items-center rounded-xl border border-white/10 bg-black/40 focus-within:border-indigo-500/80 focus-within:ring-1 focus-within:ring-indigo-500/80 transition overflow-hidden min-w-0 w-full h-10">
            <span className="px-3 text-xs text-neutral-500 bg-white/[0.02] border-r border-white/5 select-none font-mono shrink-0 h-full flex items-center">
              openlynk.id/@
            </span>
            <input
              id="profile-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
              placeholder="username"
              required
              minLength={3}
              maxLength={30}
              className="w-full min-w-0 bg-transparent px-3 py-2 text-xs font-mono text-white placeholder:text-neutral-600 outline-none"
            />
          </div>
          <p className="text-[11px] text-neutral-500">
            Alamat unik akun profil publik Anda. Huruf kecil, angka, dan underscore.
          </p>
        </div>

        {/* Display Name */}
        <div className="space-y-1.5">
          <Label htmlFor="profile-display-name" className="text-xs font-medium text-neutral-300">
            Nama Lengkap / Brand <span className="text-red-400">*</span>
          </Label>
          <Input
            id="profile-display-name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="misal: Budi Santoso"
            required
            maxLength={50}
            className="border-white/10 bg-black/40 text-white placeholder:text-neutral-600 rounded-xl text-xs h-10"
          />
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <Label htmlFor="profile-bio" className="text-xs font-medium text-neutral-300">
              Bio Kreator
            </Label>
            <span className="text-[10px] font-mono text-neutral-500">
              {bio.length}/160
            </span>
          </div>
          <Textarea
            id="profile-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 160))}
            rows={3}
            placeholder="Deskripsi singkat tentang diri Anda, bidang karya, portofolio, atau penawaran produk..."
            className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white placeholder:text-neutral-600 outline-none focus-visible:border-indigo-500/80 transition resize-none leading-relaxed"
          />
        </div>

        {/* Avatar URL with Live Preview */}
        <div className="space-y-1.5">
          <Label htmlFor="profile-avatar" className="text-xs font-medium text-neutral-300">
            Foto Profil / Avatar
          </Label>
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-neutral-900 border-2 border-white/15 overflow-hidden flex items-center justify-center shrink-0 shadow-lg relative group">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName || "Avatar Preview"}
                  width={64}
                  height={64}
                  className="size-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="size-full bg-gradient-to-br from-indigo-600/40 to-violet-600/40 flex items-center justify-center text-white font-bold text-base">
                  {displayName ? displayName.slice(0, 2).toUpperCase() : "@"}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Input
                id="profile-avatar"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://ik.imagekit.io/... atau url gambar publik"
                className="border-white/10 bg-black/40 text-white placeholder:text-neutral-600 text-xs rounded-xl h-10"
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                Masukkan URL gambar avatar atau logo brand Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Social Media Links Section */}
        <div className="pt-4 border-t border-white/5 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-indigo-400" />
            <h3 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider font-mono">
              Tautan Media Sosial Resmi
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {socialFields.map(({ platform, label, placeholder, value, setter }) => (
              <div key={platform} className="space-y-1">
                <Label htmlFor={`social-${platform}`} className="text-[11px] text-neutral-400">
                  {label}
                </Label>
                <div className="flex items-center rounded-xl border border-white/10 bg-black/40 focus-within:border-indigo-500/80 transition overflow-hidden h-9 px-2.5 gap-2">
                  <SocialIcon platform={platform} size={15} />
                  <input
                    id={`social-${platform}`}
                    type="text"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-transparent text-xs text-white placeholder:text-neutral-600 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-white/10 flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl px-5 h-10 text-xs min-h-[40px] flex items-center gap-1.5 shadow-lg"
        >
          {isPending ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Check size={14} />
              <span>Simpan Perubahan Profil</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
