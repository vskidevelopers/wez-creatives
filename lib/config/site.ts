export const siteConfig = {
  name: "Wez Creatives",
  description:
    "Kenya-based creative agency for branding, printing, and merchandise.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og.png",
  links: {
    whatsapp: "", // To be configured in Phase 14
  },
};

export type SiteConfig = typeof siteConfig;
