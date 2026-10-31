import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPublicProfile, PublicBioView } from "@/modules/bio";

interface BioPageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({
  params,
}: BioPageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getPublicProfile(username);

  if (!profile) {
    return {
      title: "Profil Tidak Ditemukan | OpenLynk",
      description: "Halaman bio ini belum tersedia atau telah dinonaktifkan.",
    };
  }

  const metaTitle = `${profile.displayName} (@${profile.username}) | OpenLynk`;
  const metaDesc =
    profile.bio ||
    `Lihat tautan dan profil resmi ${profile.displayName} di OpenLynk.`;

  return {
    title: metaTitle,
    description: metaDesc,
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: `/${profile.username}`,
      siteName: "OpenLynk",
      images: profile.avatarUrl ? [{ url: profile.avatarUrl }] : [],
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: metaTitle,
      description: metaDesc,
      images: profile.avatarUrl ? [profile.avatarUrl] : [],
    },
  };
}

async function BioContent({ params }: BioPageProps) {
  const { username } = await params;
  const profile = await getPublicProfile(username);

  if (!profile) {
    notFound();
  }

  return <PublicBioView data={profile} />;
}

export default function BioPage(props: BioPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
          <div className="size-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BioContent {...props} />
    </Suspense>
  );
}
