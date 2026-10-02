import { Hero } from "@/components/public/home/hero";
import { WhatWeDo } from "@/components/public/home/what-we-do";
import { FeaturedWork } from "@/components/public/home/featured-work";
import { ShopPreview } from "@/components/public/home/shop-preview";
import { CustomWork } from "@/components/public/home/custom-work";
import { EventsBulk } from "@/components/public/home/events-bulk";
import { WhyWez } from "@/components/public/home/why-wez";
import { FinalCTA } from "@/components/public/home/final-cta";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
    title: `${siteConfig.name} — Creative Agency & Branded Merchandise`,
    description: siteConfig.description,
};

export default function HomePage() {
    return (
        <>
            <Hero />
            <WhatWeDo />
            <FeaturedWork />
            <ShopPreview />
            <CustomWork />
            <EventsBulk />
            <WhyWez />
            <FinalCTA />
        </>
    );
}