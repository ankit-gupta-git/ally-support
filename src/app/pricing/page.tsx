import { Pricing } from "@/components/Pricing";
import type { Metadata } from "next";
import { getSession } from "@/lib/getSession";

export const metadata: Metadata = {
    title: "Pricing - Support.ai",
    description: "Simple, transparent pricing for AI-powered customer support.",
};

export default async function PricingPage() {
    const session = await getSession();
    return <Pricing email={session?.user?.email || ""} />;
}
