import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sweet Circle Terms & Conditions",
  description: "Terms and conditions for the Sweetalks Sweet Circle loyalty program.",
};

const sections = [
  {
    title: "1. Earning Sweets",
    content: [
      "Sweets are earned at a rate of 10 Sweets per ₹100 spent at Sweetalks Thrikkakara.",
      "Sweets are credited to your account after staff confirms your transaction.",
      "Bonus Sweets: +50 on signup, +100 during your birthday month (daily), +75 when a referred friend completes their first visit.",
      "Sweets have no monetary value and cannot be exchanged for cash.",
      "Sweetalks reserves the right to adjust point values at any time with prior notice.",
    ],
  },
  {
    title: "2. Redemption",
    content: [
      "Redemption requires a valid 4-digit PIN set at the time of account creation.",
      "Redemption codes are 6 digits, valid for 5 minutes, and single-use only.",
      "Expired or used codes cannot be redeemed. No exceptions.",
      "Redemptions are subject to item availability.",
      "The 20% off bill discount reward is capped at ₹200 maximum saving.",
    ],
  },
  {
    title: "3. Tiers",
    content: [
      "Tiers are based on total lifetime Sweets accumulated (not current balance).",
      "Tiers: Biscuit (0–499), Brownie (500–1,499), Kunafa (1,500–3,499), Sweet Circle (3,500+).",
      "Tier upgrades are effective immediately and trigger a WhatsApp notification.",
      "Tier benefits are subject to change with 7 days' notice.",
    ],
  },
  {
    title: "4. Referrals",
    content: [
      "You receive +75 Sweets when a friend you referred completes their first visit.",
      "Your friend must use your referral code at the time of account creation.",
      "Referral bonuses are credited after the referred customer's first transaction is confirmed.",
      "Self-referrals or fraudulent referrals will result in account suspension.",
    ],
  },
  {
    title: "5. WhatsApp Communications",
    content: [
      "By creating an account, you consent to receive WhatsApp messages from Sweetalks regarding your account, transactions, tier upgrades, and occasional promotional messages.",
      "You can opt out by contacting us at info@sweetalks.in.",
    ],
  },
  {
    title: "6. Account Conduct",
    content: [
      "One account per phone number. Multiple accounts will be merged or suspended.",
      "Sweetalks reserves the right to suspend or terminate accounts for fraudulent activity.",
      "Sweets and tier status are non-transferable.",
    ],
  },
  {
    title: "7. Programme Changes",
    content: [
      "Sweetalks may modify, suspend, or terminate the Sweet Circle programme at any time.",
      "Reasonable notice will be given for material changes.",
      "Continued use of the programme constitutes acceptance of updated terms.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8F2F2] py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <Link
          href="/loyalty"
          className="inline-flex items-center gap-2 font-['Jost',sans-serif] text-[0.58rem] tracking-[2px] uppercase text-[#2BA8B2] hover:text-[#2BA8B2]/70 transition-colors mb-8"
        >
          ← Back to Sweet Circle
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="font-['Pacifico',cursive] text-[#BA1C0A] text-4xl mb-3">Terms & Conditions</h1>
          <p className="font-['Jost',sans-serif] text-[0.6rem] tracking-[3px] uppercase text-[#2BA8B2] mb-2">
            Sweet Circle Loyalty Programme
          </p>
          <p className="font-['Lora',serif] italic text-[#BA1C0A]/55 text-sm">
            Effective: April 2026 · Sweetalks Thrikkakara, Kakkanad, Kochi, Kerala
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-['Charlotte',cursive] text-[#991001] text-xl mb-3">{section.title}</h2>
              <ul className="flex flex-col gap-2">
                {section.content.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-[#BA1C0A]/40 mt-[3px] shrink-0">•</span>
                    <p className="font-['Lora',serif] text-[#0D0D0D]/70 text-sm leading-[1.8]">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 pt-8 border-t border-[#EDE5E5]">
          <p className="font-['Lora',serif] italic text-[#BA1C0A]/50 text-sm">
            Questions? Contact us at{" "}
            <a href="mailto:info@sweetalks.in" className="text-[#2BA8B2] hover:underline">
              info@sweetalks.in
            </a>{" "}
            or visit Sweetalks Thrikkakara, Kakkanad, Kochi.
          </p>
        </div>
      </div>
    </div>
  );
}
