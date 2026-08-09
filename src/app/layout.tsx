import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/commons/theme/provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://zeropost.netlify.app"),
  title: {
    default: "Zeropost",
    template: "%s | Zeropost",
  },

  description:
    "Curhat, tulisan, dan omon omon saya dari Zeropost.",

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "Zeropost",

    title: "Zeropost",

    description:
      "Curhat, tulisan, dan omon omon saya dari Zeropost.",

    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Zeropost",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Zeropost",
    description:
      "Curhat, tulisan, dan omon omon saya dari Zeropost.",
    images: ["/og-default.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
