# Sweet Circle — Loyalty Program Master Plan

## 1. Authentication
**Staff Login**
- Username + Password (bcrypt hashed in Supabase).
- Session expires after 8 hours (one shift).
- 5 wrong attempts = 30 min lockout.
- Only admin can create/revoke staff accounts; no self-registration.

**Customer Login**
- Phone number → OTP → Set 4-digit PIN on first login.
- PIN required to generate redemption code.
- Session stored in Supabase Auth.

---

## 2. Earning Sweets
**Staff Flow**
- Staff enters phone number → loads profile → inputs bill amount (₹) + PetPooja ref + note.
- Conversion: ₹100 = 10 Sweets.

**Automated System Actions**
- Insert to `points_ledger` (customer_id, sweets, amount, bill_ref, staff_id, timestamp).
- Update tier via `customer_balance` view.
- Trigger automated WhatsApp notification.

**Bonus Sweets**
- Signup: +50 (on profile creation).
- Birthday Month: +100 (daily cron at 9 AM).
- Referral: +75 (when referred friend completes first visit).

---

## 3. Tiers
| Tier | Sweets Range |
| --- | --- |
| Biscuit | 0 – 499 |
| Brownie | 500 – 1,499 |
| Kunafa | 1,500 – 3,499 |
| Sweet Circle | 3,500+ |
- Live tier calculation; upgrades trigger automated WhatsApp notifications.

---

## 4. Redemption (Two-Step, Fraud-Proof)
**Customer Step**
- Initiates at `/loyalty` via PIN → chooses reward → generates 6-digit code (valid 5 mins).

**Staff Step**
- Enters customer's code in admin panel → verifies status → confirms deduction.

**Rewards Table**
- 200: Free Coffee
- 400: Free Belgium Brownie
- 600: Free Milkshake
- 1,000: Free Falooda
- 1,500: 20% off bill (max ₹200)
- 2,500: Free Chocoberry Mess + thank you note

---

## 5. WhatsApp Automation
- **Service:** `whatsapp-web.js` on free tier hosting (Railway/Render).
- **Triggers:** Visit completion, Tier upgrade, Birthday (daily 9 AM), Welcome (signup), Redemption confirmed.
- **Cost:** Zero subscription/per-message fees.

---

## 6. Admin Panel (Bibin Only)
- **Features:** Dashboard (KPIs), Staff Management, Customer Management (History, Manual adjustments), Reports (CSV export), and Manual Broadcasts (Secret Sweets).

---

## 7. Infrastructure (Zero Subscription)
- **Supabase:** DB + Auth.
- **Vercel:** Frontend hosting.
- **cron-job.org:** Pinging/Birthday automation.
- **Railway/Render:** WhatsApp server.

---

## 8. Physical Counter Setup
- **Hardware:** Android tablet with `sweetalks.vercel.app/admin` as home screen app.
- **Efficiency:** ~10s per customer.

---

## 9. Database Schema
- `profiles`: id, phone, name, role, birthday_month, created_at
- `points_ledger`: id, customer_id, points, reason, bill_amount, bill_reference, note, created_by, created_at
- `customer_balance` (view): customer_id, total_points
- `redemption_codes`: id, customer_id, code, reward_id, expires_at, used, used_at, confirmed_by

---

## 10. Terms & Conditions Summary
- Mandatory acceptance via checkbox on signup.
- Terms at `/loyalty/terms`.
- Covers earning, redemption, referrals, and WhatsApp consent.
- Version: April 2026.
