import { ObsidianHeader } from "./obsidian-header";
import { ObsidianHero } from "./obsidian-hero";
import { ObsidianLogoSection } from "./obsidian-logo-section";
import { ObsidianColorsSection } from "./obsidian-colors-section";
import { ObsidianThemePlayground } from "./obsidian-theme-playground";
import { ObsidianTypographySection } from "./obsidian-typography-section";
import { ObsidianSurfacesSection } from "./obsidian-surfaces-section";
import { ObsidianComponentsSection } from "./obsidian-components-section";
import { ObsidianIconsSection } from "./obsidian-icons-section";
import { ObsidianFooter } from "./obsidian-footer";
import { ObsidianToastProvider } from "./obsidian-toast";

export function ObsidianDesignSystemView() {
  return (
    <ObsidianToastProvider>
      <div className="min-h-screen bg-[#09090b] text-neutral-100 selection:bg-violet-500/30 selection:text-white">
        <ObsidianHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 space-y-0">
          <ObsidianHero />
          <ObsidianLogoSection />
          <ObsidianColorsSection />
          <ObsidianThemePlayground />
          <ObsidianTypographySection />
          <ObsidianSurfacesSection />
          <ObsidianComponentsSection />
          <ObsidianIconsSection />
        </main>

        <ObsidianFooter />
      </div>
    </ObsidianToastProvider>
  );
}
