import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadPlayfairItalic(text: string) {
  const url = `https://fonts.googleapis.com/css2?family=Playfair+Display:ital@1&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\(([^)]+)\) format\('(opentype|truetype)'\)/);
  if (match) {
    const response = await fetch(match[1]);
    if (response.ok) return response.arrayBuffer();
  }
  return null;
}

export default async function OpengraphImage() {
  const eyebrow = "Frizerski salon";
  const headline = "Tress Studio";
  const slogan = "Umijeće pramena.";
  const fontData = await loadPlayfairItalic(eyebrow + headline + slogan);
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
