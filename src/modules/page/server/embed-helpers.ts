// --- MEDIA EMBED HELPERS: src/modules/page/server/embed-helpers.ts ---

export type DetectedEmbed =
  | {
      platform: "youtube";
      videoId: string;
      embedUrl: string;
    }
  | {
      platform: "spotify";
      spotifyType: "track" | "album" | "playlist" | "episode";
      embedUrl: string;
    };

/**
 * Ekstraksi video ID dari URL YouTube (standard, youtu.be, shorts, atau embed).
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();

  try {
    const parsed = new URL(cleanUrl);
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.searchParams.has("v")) {
        return parsed.searchParams.get("v");
      }
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "v") {
        return parts[1] ?? null;
      }
    } else if (parsed.hostname === "youtu.be") {
      const parts = parsed.pathname.split("/").filter(Boolean);
      return parts[0] ?? null;
    }
  } catch {
    // Regex fallback
    const match = cleanUrl.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
    );
    return match ? match[1] : null;
  }

  return null;
}

/**
 * Ekstraksi embed URL dari tautan Spotify.
 */
export function extractSpotifyEmbed(
  url: string
): { embedUrl: string; spotifyType: "track" | "album" | "playlist" | "episode" } | null {
  if (!url) return null;
  const cleanUrl = url.trim();

  try {
    const parsed = new URL(cleanUrl);
    if (!parsed.hostname.includes("spotify.com")) return null;

    const parts = parsed.pathname.split("/").filter(Boolean);
    const validTypes = ["track", "album", "playlist", "episode"] as const;

    const typeIndex = parts.findIndex((p) =>
      validTypes.includes(p as (typeof validTypes)[number])
    );

    if (typeIndex !== -1 && parts[typeIndex + 1]) {
      const spotifyType = parts[typeIndex] as (typeof validTypes)[number];
      const id = parts[typeIndex + 1];
      return {
        spotifyType,
        embedUrl: `https://open.spotify.com/embed/${spotifyType}/${id}`,
      };
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Deteksi otomatis apakah sebuah URL merupakan media embed yang didukung.
 */
export function detectMediaEmbed(url: string): DetectedEmbed | null {
  const ytId = extractYouTubeId(url);
  if (ytId) {
    return {
      platform: "youtube",
      videoId: ytId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}`,
    };
  }

  const spotify = extractSpotifyEmbed(url);
  if (spotify) {
    return {
      platform: "spotify",
      spotifyType: spotify.spotifyType,
      embedUrl: spotify.embedUrl,
    };
  }

  return null;
}
