import { Geist } from "next/font/google";
import type { Font, FontWeight } from "satori";

export const fontSans = Geist({
  variable: "--font-sans",
  display: "swap",
  subsets: ["latin"],
  weight: "variable",
});

export const loadGoogleFont = async (font: string, weight: FontWeight) => {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@${weight}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const css = await response.text();

    const match = css.match(
      /src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/,
    );
    if (!match) {
      throw new Error(`Could not parse font URL for ${font}`);
    }

    const fontResponse = await fetch(match[1], {
      cache: "force-cache",
    });
    if (!fontResponse.ok) {
      throw new Error(`Failed to fetch font: ${fontResponse.status}`);
    }

    return fontResponse.arrayBuffer();
  } catch (error) {
    console.error(
      `Failed to load Google Font ${font} weight ${weight}:`,
      error,
    );
    // Return a fallback font or throw the error
    throw new Error(
      `Failed to load font ${font}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

export const getFonts = async (): Promise<Font[]> => {
  // Note: "Geist" is a Vercel font not available via the Google Fonts CSS API.
  // We use "Inter" here (visually near-identical) which is a proper Google Font
  // and works reliably with the fetch-and-parse approach used by loadGoogleFont.
  try {
    return [
      {
        name: "Geist",
        weight: 400,
        data: await loadGoogleFont("Inter", 400),
      },
      {
        name: "Geist",
        weight: 600,
        data: await loadGoogleFont("Inter", 600),
      },
    ];
  } catch (error) {
    console.error("Failed to load fonts, using fallback:", error);
    return [];
  }
};

// For backward compatibility, but make it async
export const fonts: Promise<Font[]> = getFonts();
