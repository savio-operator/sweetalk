/**
 * WhatsApp notification helpers.
 * Sends messages via whatsapp-web.js server (Railway/Render endpoint).
 * Falls back gracefully if WA_SERVER_URL is not set.
 */

const WA_URL = process.env.WA_SERVER_URL;
const WA_SECRET = process.env.WA_SERVER_SECRET;

async function sendWhatsApp(phone: string, message: string): Promise<void> {
  if (!WA_URL || !WA_SECRET) return; // WhatsApp server not configured — skip

  // Normalize to international format (add 91 if bare 10-digit Indian number)
  const normalized = phone.replace(/\D/g, "");
  const to = normalized.length === 10 ? `91${normalized}` : normalized;

  try {
    await fetch(`${WA_URL}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${WA_SECRET}`,
      },
      body: JSON.stringify({ to, message }),
    });
  } catch (err) {
    console.error("[WhatsApp] Failed to send message:", err);
  }
}

export async function notifyWelcome(phone: string, name: string, referralCode: string) {
  await sendWhatsApp(
    phone,
    `🎉 Welcome to *Sweet Circle*, ${name}!\n\nYou've earned *50 bonus Sweets* just for joining.\n\nShare your referral code *${referralCode}* with friends — you both get bonus Sweets when they visit!\n\n📍 Sweetalks Thrikkakara — Everyone Deserves Best`
  );
}

export async function notifyPointsEarned(
  phone: string,
  name: string,
  earned: number,
  total: number,
  tierName: string
) {
  await sendWhatsApp(
    phone,
    `✅ *${earned} Sweets* added, ${name}!\n\nYour balance: *${total} Sweets* 🍬\nTier: *${tierName}*\n\nRedeem your Sweets at sweetalks.vercel.app/loyalty`
  );
}

export async function notifyTierUpgrade(
  phone: string,
  name: string,
  newTier: string,
  total: number
) {
  await sendWhatsApp(
    phone,
    `🏆 Congratulations, ${name}! You've reached *${newTier}* tier!\n\nBalance: *${total} Sweets* 🍬\n\nThank you for being part of Sweet Circle 🎂`
  );
}

export async function notifyBirthday(phone: string, name: string) {
  await sendWhatsApp(
    phone,
    `🎂 Happy Birthday, ${name}!\n\nWe've added *100 bonus Sweets* to your account as a birthday gift from all of us at Sweetalks! 🎉\n\nCome celebrate with us — Thrikkakara's favourite dessert cafe awaits 🍰`
  );
}

export async function notifyRedemptionConfirmed(
  phone: string,
  name: string,
  rewardName: string,
  remaining: number
) {
  await sendWhatsApp(
    phone,
    `🎁 Redemption confirmed, ${name}!\n\n*${rewardName}* — enjoy!\n\nRemaining balance: *${remaining} Sweets* 🍬\n\nSee you again soon at Sweetalks 💛`
  );
}
