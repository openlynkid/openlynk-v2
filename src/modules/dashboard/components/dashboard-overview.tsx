"use client";

import { useState } from "react";
import { CreatorHeroBanner } from "./creator-hero-banner";
import { DashboardStatsGrid } from "./dashboard-stats-grid";
import { QuickActionsBento } from "./quick-actions-bento";
import { RecentPagesBento } from "./recent-pages-bento";
import { QrShareCard } from "./qr-share-card";
import { CreatorAnalyticsCard } from "./creator-analytics-card";
import { CreatorChecklist } from "./creator-checklist";
import { CreatePageDialog } from "./create-page-dialog";
import type { DashboardOverviewData } from "../types";

interface DashboardOverviewProps {
  data: DashboardOverviewData;
  baseUrl?: string;
}

export function DashboardOverview({ data, baseUrl }: DashboardOverviewProps) {
  const { user, profile, pages, primaryPage, stats, checklist } = data;
  const [isCreatePageOpen, setIsCreatePageOpen] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 w-full min-w-0">
      {/* 1. Creator Hero Banner */}
      <CreatorHeroBanner
        profile={profile}
        name={user.name}
        baseUrl={baseUrl}
        onOpenCreatePage={() => setIsCreatePageOpen(true)}
      />

      {/* 2. Key Metrics Grid */}
      <DashboardStatsGrid stats={stats} />

      {/* 3. Fast Actions Bento */}
      <div>
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono mb-3">
          Aksi Cepat &amp; Alat Kreator
        </h2>
        <QuickActionsBento
          primaryPage={primaryPage}
          username={profile.username}
          baseUrl={baseUrl}
          onOpenCreatePage={() => setIsCreatePageOpen(true)}
        />
      </div>

      {/* 4. Asymmetrical 2-Column Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Recent Pages with Visual Theme Mockups */}
        <div className="lg:col-span-7 space-y-6">
          <RecentPagesBento
            pages={pages}
            profileUsername={profile.username}
            onOpenCreatePage={() => setIsCreatePageOpen(true)}
          />
        </div>

        {/* Right Column (5 cols): Live QR Share, Creator Analytics, and Checklist */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live QR Code & Bio Share Bento */}
          <QrShareCard
            username={profile.username}
            displayName={profile.displayName || user.name}
            baseUrl={baseUrl}
          />

          {/* Creator Analytics Pulse */}
          <CreatorAnalyticsCard
            totalPages={stats.totalPages}
            totalBlocks={stats.totalBlocks}
          />

          {/* Creator Setup Checklist */}
          <CreatorChecklist
            checklist={checklist}
            primaryPageId={primaryPage?.id}
          />
        </div>
      </div>

      {/* Create Page Modal Dialog */}
      <CreatePageDialog
        profileId={profile.id}
        isOpen={isCreatePageOpen}
        onClose={() => setIsCreatePageOpen(false)}
      />
    </div>
  );
}
