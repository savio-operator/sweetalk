import type { Metadata } from "next";
import CustomerPortal from "@/components/loyalty/CustomerPortal";

export const metadata: Metadata = {
  title: "Sweet Circle — Loyalty Program",
  description: "Earn Sweets with every visit. Redeem exclusive rewards. Join Sweet Circle, the loyalty program for Sweetalks Thrikkakara.",
  robots: { index: false }, // Members-only portal
};

export default function LoyaltyPage() {
  return <CustomerPortal />;
}
