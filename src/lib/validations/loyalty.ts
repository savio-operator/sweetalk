import { z } from "zod";

const phoneRegex = /^[+]?[\d\s\-(). ]{7,15}$/;

// ---- Customer auth ----

export const otpRequestSchema = z.object({
  phone: z.string().regex(phoneRegex, "Please enter a valid phone number"),
});

export const otpVerifySchema = z.object({
  phone: z.string().regex(phoneRegex, "Invalid phone number"),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),
});

export const setPinSchema = z.object({
  pin: z
    .string()
    .length(4, "PIN must be exactly 4 digits")
    .regex(/^\d{4}$/, "PIN must contain only digits"),
});

export const verifyPinSchema = z.object({
  customer_id: z.string().uuid("Invalid customer"),
  pin: z
    .string()
    .length(4, "PIN must be 4 digits")
    .regex(/^\d{4}$/, "PIN must be numeric"),
});

// ---- Staff: earn points ----

export const earnSchema = z.object({
  customer_phone: z.string().regex(phoneRegex, "Invalid phone number"),
  bill_amount: z
    .number()
    .positive("Bill amount must be positive")
    .max(100000, "Unreasonably large bill amount"),
  bill_reference: z.string().max(100).optional(),
  note: z.string().max(200).optional(),
});

// ---- Customer: generate redemption code ----

export const redeemRequestSchema = z.object({
  reward_id: z.number().int().positive("Invalid reward"),
  pin: z
    .string()
    .length(4, "PIN must be 4 digits")
    .regex(/^\d{4}$/),
});

// ---- Staff: confirm redemption ----

export const confirmRedeemSchema = z.object({
  code: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^\d{6}$/, "Code must be numeric"),
});

// ---- Admin: create staff account ----

export const createStaffSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_]+$/, "Username: lowercase letters, numbers, underscores only"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["staff", "admin"]).default("staff"),
});

// ---- Admin: manual point adjustment ----

export const adjustPointsSchema = z.object({
  customer_id: z.string().uuid("Invalid customer ID"),
  points: z
    .number()
    .int("Must be whole number")
    .min(-10000)
    .max(10000)
    .refine((n) => n !== 0, "Adjustment cannot be zero"),
  note: z.string().min(3, "Please add a note for audit purposes").max(200),
});

// ---- Admin: manual broadcast ----

export const broadcastSchema = z.object({
  message: z.string().min(10).max(500),
  filter: z.enum(["all", "biscuit", "brownie", "kunafa", "sweet_circle"]).default("all"),
});

// ---- Types ----

export type OTPRequestInput    = z.infer<typeof otpRequestSchema>;
export type OTPVerifyInput     = z.infer<typeof otpVerifySchema>;
export type SetPinInput        = z.infer<typeof setPinSchema>;
export type EarnInput          = z.infer<typeof earnSchema>;
export type RedeemRequestInput = z.infer<typeof redeemRequestSchema>;
export type ConfirmRedeemInput = z.infer<typeof confirmRedeemSchema>;
export type CreateStaffInput   = z.infer<typeof createStaffSchema>;
export type AdjustPointsInput  = z.infer<typeof adjustPointsSchema>;
export type BroadcastInput     = z.infer<typeof broadcastSchema>;
