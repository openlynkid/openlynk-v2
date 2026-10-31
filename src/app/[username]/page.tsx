import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPageBySlug, PublicPageView } from "@/modules/page";

interface PublicPageRouteProps {
  params: Promise<{
    username: string; // Dynamic path slug
  }>;
}

export async function generateMetadata({
  params,
}: PublicPageRouteProps): Promise<Metadata> {
  const { username } = await params;
  const page = await getPageBySlug(username);

  if (!page) {
    return {
      title: "Halaman Tidak Ditemukan | OpenLynk",
      description: "Halaman ini belum tersedia atau telah dinonaktifkan.",
    };
  }

  const metaTitle = `${page.title} (@${page.profile.username}) | OpenLynk`;
  const metaDesc =
    page.description ||
    page.profile.bio ||
    `Lihat tautan dan profil resmi ${page.title} di OpenLynk.`;
  const image = page.avatarUrl || page.profile.avatarUrl;

  return {
    title: metaTitle,
    description: metaDesc,
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: `/${page.slug}`,
      siteName: "OpenLynk",
      images: image ? [{ url: image }] : [],
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: metaTitle,
      description: metaDesc,
      images: image ? [image] : [],
    },
  };
}

async function PageContent({ params }: PublicPageRouteProps) {
  const { username } = await params;
  const pageData = await getPageBySlug(username);

  if (!pageData) {
    notFound();
  }

  return <PublicPageView data={pageData} />;
}

export default function PublicPage(props: PublicPageRouteProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
          <div className="size-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PageContent {...props} />
    </Suspense>
  );
}
