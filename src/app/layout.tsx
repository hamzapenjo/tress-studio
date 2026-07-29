import type { Metadata } from "next";
import { Manrope, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Tress Studio",
  description: "Zakazivanje termina, usluge i cjenovnik - Tress Studio.",
  openGraph: {
    title: "Tress Studio",
    description: "Zakazivanje termina, usluge i cjenovnik - Tress Studio.",
    locale: "bs_BA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tress Studio",
    description: "Zakazivanje termina, usluge i cjenovnik - Tress Studio.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bs"
      className={`${manrope.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
