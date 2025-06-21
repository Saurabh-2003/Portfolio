import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { getAuthSession } from "@/lib/auth";
import { createDefaultUser, seedDatabase } from "@/lib/db";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Portfolio - Saurabh Thapliyal",
    template: "%s | Developer Portfolio",
  },
  description:
    "Full Stack Developer passionate about creating innovative solutions and exceptional user experiences.",
  keywords: [
    "developer",
    "portfolio",
    "full stack",
    "React",
    "Next.js",
    "TypeScript",
    "web development",
  ],
  authors: [{ name: "Saurabh Thapliyal" }],
  creator: "Saurabh Thapliyal",
  publisher: "Saurabh Thapliyal",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    title: "Developer Portfolio - Saurabh Thapliyal",
    description:
      "Full Stack Developer passionate about creating innovative solutions and exceptional user experiences.",
    siteName: "Developer Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Portfolio - Saurabh Thapliyal",
    description:
      "Full Stack Developer passionate about creating innovative solutions and exceptional user experiences.",
    creator: "@yourusername",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

// Initialize database on app start
async function initializeApp() {
  try {
    await createDefaultUser();
    await seedDatabase();
  } catch (error) {
    console.error("Failed to initialize app:", error);
  }
}

// Initialize on server start
if (typeof window === "undefined") {
  initializeApp();
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  // Config for blurred circles (organized layout)
  const blurredCircles = [
    // Large background circles in corners
    {
      className: "absolute -top-32 -left-32 w-[36rem] h-[36rem] bg-pink-400/40",
      style: { filter: "blur(120px)", opacity: 0.6 },
    },
    {
      className: "absolute -top-32 right-0 w-[32rem] h-[32rem] bg-blue-400/30",
      style: { filter: "blur(120px)", opacity: 0.5 },
    },
    {
      className:
        "absolute bottom-0 left-0 w-[32rem] h-[32rem] bg-purple-400/30",
      style: { filter: "blur(120px)", opacity: 0.5 },
    },
    {
      className:
        "absolute bottom-0 right-0 w-[36rem] h-[36rem] bg-yellow-400/35",
      style: { filter: "blur(120px)", opacity: 0.5 },
    },
    // Medium circles at midpoints
    {
      className:
        "absolute top-1/4 left-1/4 w-[20rem] h-[20rem] bg-green-400/35",
      style: { filter: "blur(80px)", opacity: 0.5 },
    },
    {
      className:
        "absolute top-1/4 right-1/4 w-[18rem] h-[18rem] bg-orange-400/35",
      style: { filter: "blur(80px)", opacity: 0.5 },
    },
    {
      className:
        "absolute bottom-1/4 left-1/4 w-[16rem] h-[16rem] bg-cyan-400/30",
      style: { filter: "blur(70px)", opacity: 0.5 },
    },
    {
      className:
        "absolute bottom-1/4 right-1/4 w-[16rem] h-[16rem] bg-rose-400/30",
      style: { filter: "blur(70px)", opacity: 0.5 },
    },
    // Small accent circles near center
    {
      className:
        "absolute top-1/2 left-1/2 w-[10rem] h-[10rem] bg-indigo-400/30",
      style: {
        filter: "blur(40px)",
        opacity: 0.4,
        transform: "translate(-50%, -50%)",
      },
    },
    {
      className: "absolute top-1/2 left-1/3 w-[8rem] h-[8rem] bg-lime-400/30",
      style: {
        filter: "blur(30px)",
        opacity: 0.4,
        transform: "translateY(-50%)",
      },
    },
    {
      className:
        "absolute top-1/2 right-1/3 w-[8rem] h-[8rem] bg-fuchsia-400/30",
      style: {
        filter: "blur(30px)",
        opacity: 0.4,
        transform: "translateY(-50%)",
      },
    },
  ];

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${inter.variable} ${geist.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground transition-colors duration-300 relative`}
        suppressHydrationWarning
      >
        {/* Decorative blurred color circles */}
        {blurredCircles.map((circle, i) => (
          <div
            key={i}
            className={`pointer-events-none rounded-full blur-3xl z-0 ${circle.className}`}
            style={circle.style}
          />
        ))}
        <Providers session={session}>
          <div className="relative flex min-h-screen flex-col z-10">
            <div className="flex-1 pb-8">{children}</div>
          </div>
          <Toaster
            position="top-right"
            expand={false}
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
              style: {
                background: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border))",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
