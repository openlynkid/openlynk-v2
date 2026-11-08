# Obsidian Design System — Developer & AI Agent Specification

> **Obsidian** is an independent, modern tactile design system inspired by high-precision design engineering (such as Vercel Geist). It pairs infinite dark depth with tactile glassmorphism, responsive ergonomics, and razor-sharp typography.

---

## 💎 1. Core Design Philosophy

1. **Obsidian Clarity**: A true dark void canvas (`oklch(0.12 0.012 260)` / `#09090b`) provides resting negative space with high contrast that elevates primary content without visual fatigue.
2. **Tactile Glassmorphism**: Multilayered frosted glass surfaces (`.rune-glass`) featuring precise 1px borders (`border-white/10`), multi-layer backdrop diffusion (`backdrop-blur-xl`), and accent refraction edges.
3. **Engineered Ergonomics**: Instant visual and physical feedback on hover, drag, tap, and state mutation, backed by smooth cubic-bezier transitions.
4. **Intentional Iconography**: A structured 5-style icon hierarchy through RuneIcon (`runeicons-react`) mapping cleanly to semantic interface layers.

---

## 🏛️ 2. Tech Stack & Primitives

| Component | Library / Tool | Implementation |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) + React 19 | Server Component by default |
| **Styling** | Tailwind CSS v4 | Token-based CSS Variables & OKLCH |
| **Primitives** | Base UI (`@base-ui/react`) | Unstyled, accessible, full slot preservation |
| **Typography** | Geist Sans & Geist Mono | Next.js font loader (`var(--font-sans)`, `var(--font-mono)`) |
| **Icons** | RuneIcon (`runeicons-react`) | 5 distinct visual variants (`glass`, `duotone`, `normal`, `fill`, `pixelated`) |
| **Helper** | `cn()` | Always import from `"cn"` |

---

## 🎨 3. Color Tokens

### 3.1 Core Obsidian Palette
```css
:root {
  --background: oklch(0.12 0.012 260);        /* #09090b - Obsidian Canvas */
  --card: oklch(0.16 0.012 260 / 60%);        /* #121218 - Obsidian Surface */
  --border: rgba(255, 255, 255, 0.08);         /* Subtle Glass Edge */
  --border-hover: rgba(255, 255, 255, 0.20);   /* Active Hover Glow Edge */
  --foreground: oklch(0.985 0 0);              /* #fcfcfd - Primary High-Contrast Text */
  --muted-foreground: oklch(0.68 0.01 260);    /* #a1a1aa - Muted Secondary Text */
}
```

### 3.2 5 Official Theme Accents
1. **Obsidian Violet** (`#6366f1` / `oklch(0.585 0.233 277)`) — Default studio indigo-violet accent.
2. **Emerald Luxe** (`#10b981` / `oklch(0.696 0.17 162)`) — Prestigious emerald botanical sheen.
3. **Cyberpunk Neon** (`#ec4899` / `oklch(0.656 0.24 354)`) — High-contrast magenta fuchsia.
4. **Sunset Amber** (`#f59e0b` / `oklch(0.769 0.188 70)`) — Warm golden twilight and rose amber.
5. **Monochrome Stealth** (`#ffffff` / `oklch(1 0 0)`) — Pure silver-white and obsidian monochrome.

---

## ✍️ 4. Typography Hierarchy

| Scale | Tailwind Token | Size / LH | Usage |
| :--- | :--- | :--- | :--- |
| **Display Giant** | `text-4xl sm:text-6xl font-extrabold tracking-tight` | 60px / 1.1 | Hero titles, landing slogans |
| **Heading 1 (H1)**| `text-2xl sm:text-4xl font-bold tracking-tight` | 36px / 1.2 | Page titles, primary entity names |
| **Heading 2 (H2)**| `text-xl sm:text-2xl font-bold tracking-tight` | 24px / 1.3 | Bento section headers, modal titles |
| **Heading 3 (H3)**| `text-base sm:text-lg font-semibold tracking-tight` | 18px / 1.4 | 2x1 bento card headers |
| **Body Regular**  | `text-sm sm:text-base font-normal leading-relaxed` | 15px / 1.6 | Description paragraphs, bio copy |
| **Body Compact**  | `text-xs sm:text-sm font-normal leading-normal` | 13px / 1.5 | Button labels, secondary prompts |
| **Micro / Mono**  | `text-xs font-mono tracking-wide` | 12px / 1.4 | Code, tokens, slugs, telemetry |

---

## 🔮 5. Surface & Glass Classes

- **`.rune-glass`**: Standard static translucent card with `backdrop-blur-xl` and `border-white/10`.
- **`.rune-glass .rune-glass-hover`**: Interactive hover effect applying `-translate-y-[2px]` and glowing border transition.
- **`.rune-pill`**: Fully rounded pill capsule with 12px blur, ideal for status indicators and micro-badges.

---

## 🔮 6. Iconography: RuneIcon Styles

1. **`glass`**: Hero visual headers and primary cards (`<RuneIcon name="glass-chain-link-3-1" type="glass" size={24} />`).
2. **`duotone`**: Entity status, verification, and settings (`<RuneIcon name="identity-shield-check" type="duotone" size={20} />`).
3. **`normal`**: Navigation tabs, button prefixes, and inputs (`<RuneIcon name="identity-shield" type="normal" size={18} />`).
4. **`fill`**: High-emphasis active tabs and favorites (`<RuneIcon name="interface-star" type="fill" size={18} />`).
5. **`pixelated`**: Badges, gaming, and retro achievements (`<RuneIcon name="devices-gamepad" type="pixelated" size={20} />`).

---

## 🛑 7. AI Agent Implementation Rules

1. **Server Component by Default**: Add `"use client"` only when interactive state, hooks, or browser event listeners are strictly needed.
2. **No Dynamic `new Date()` During Static Render**: Never call `new Date().getFullYear()` directly in static client component renders, as it violates Next.js 16 PPR deterministic prerendering. Use a constant year (e.g. `2026`).
3. **Window-Safe Scroll**: In sticky headers or sub-navs, never call `element.scrollIntoView()`. Always use `container.scrollTo()` on the overflow container to prevent window scroll jumping.
4. **Modular Monolith Public API**: Always import from `src/modules/<module-name>/index.ts` (e.g., `import { ... } from "@/modules/obsidian"`). Deep imports into internal files are forbidden.
