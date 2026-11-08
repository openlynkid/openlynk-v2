import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProfileByUserId } from "@/modules/profile";
import { getPageById, PageStudioBuilder } from "@/modules/page";

interface PageEditorProps {
  params: Promise<{
    pageId: string;
  }>;
}

export const metadata: Metadata = {
  title: "Bento Studio Builder — OpenLynk",
  description: "Sesuaikan tata letak kartu bento dan visual halaman secara interaktif.",
};

async function PageStudioContent({ params }: PageEditorProps) {
  const { pageId } = await params;
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch {
    session = null;
  }

  if (!session) {
    redirect("/login");
  }

  const profile = await getProfileByUserId(session.user.id);
  if (!profile) {
    redirect("/dashboard/profile");
  }

  const { page, blocks } = await getPageById(pageId, profile.id);
  if (!page) {
    notFound();
  }

  return (
    <PageStudioBuilder
      profileId={profile.id}
      initialPage={page}
      profile={profile}
      initialBlocks={blocks}
    />
  );
}

export default function PageEditorPage(props: PageEditorProps) {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full bg-neutral-950 text-neutral-100 flex items-center justify-center">
          <div className="size-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PageStudioContent {...props} />
    </Suspense>
  );
}
