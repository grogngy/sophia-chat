import type { Metadata } from "next";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    template: "%s | Sophia by IdentIA Lab",
    default: "Sophia: Tu Mentora Virtual Gen-AI - IdentIA Lab",
  },
  description:
    "Descubre cómo la Inteligencia Artificial Generativa puede transformar tu negocio. Sophia te ayuda a explorar oportunidades de IA para microempresas colombianas y latinoamericanas.",
  keywords: [
    "Sophia",
    "IdentIA Lab",
    "Gen-AI",
    "Inteligencia Artificial",
    "Microempresas Colombia",
    "Chatbot Educativo",
    "IA para Negocios",
    "Mentor Virtual",
    "Capacitación IA",
    "Productividad Empresarial",
  ],
  openGraph: {
    title: "Sophia: Tu Mentora Virtual Gen-AI - IdentIA Lab",
    description:
      "Descubre cómo la Inteligencia Artificial Generativa puede transformar tu negocio con Sophia, tu mentora virtual.",
    url: new URL(defaultUrl),
    siteName: "Sophia by IdentIA Lab",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Sophia - Mentora Virtual Gen-AI de IdentIA Lab para microempresas.",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sophia: Tu Mentora Virtual Gen-AI - IdentIA Lab",
    description:
      "Descubre cómo la IA Generativa puede transformar tu microempresa con Sophia, tu mentora virtual.",
    images: ["/twitter-image.png"],
  },
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
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export const generateLegalMetadata = (
  title: string,
  description: string
): Metadata => {
  return {
    title: `${title} | Sophia by IdentIA Lab`,
    description,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${title} | Sophia by IdentIA Lab`,
      description,
      type: "website",
    },
  };
};
