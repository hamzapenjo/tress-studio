import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Font je bundlovan lokalno (src/assets/fonts) umjesto fetch-ovanja sa Google Fonts
// u trenutku generisanja - fetch tokom build-a je nepouzdan (vidjeli smo ETIMEDOUT
// na Vercel build serverima) i nepotrebno spor za nesto sto se nikad ne mijenja.
async function loadPlayfairItalic() {
  try {
    return await readFile(
      join(process.cwd(), "src/assets/fonts/PlayfairDisplay-Italic.ttf")
    );
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const eyebrow = "Frizerski salon";
  const headline = "Tress Studio";
  const slogan = "Umijeće pramena.";
  const fontData = await loadPlayfairItalic();
  const fontFamily = fontData ? "Playfair" : "serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#131113",
          padding: "0 90px",
        }}
      >
        <div
          style={{
            fontFamily,
            fontStyle: "italic",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#ab8a50",
            marginBottom: 28,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontFamily,
            fontStyle: "italic",
            fontSize: 108,
            color: "#ede9e2",
            lineHeight: 1,
          }}
        >
          {headline}
        </div>
        <div
          style={{
            width: 90,
            height: 2,
            background: "#ab8a50",
            margin: "34px 0",
          }}
        />
        <div
          style={{
            fontFamily,
            fontStyle: "italic",
            fontSize: 26,
            color: "#a8a29a",
          }}
        >
          {slogan}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: "Playfair", data: fontData, style: "italic", weight: 400 }]
        : undefined,
    }
  );
}
