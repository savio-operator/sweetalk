import { z } from "zod";

export const reservationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100)
    .trim(),
  occasion: z
    .string()
    .min(2, "Please select an occasion")
    .max(100)
    .trim(),
  preferred_date: z.string().optional(),
  serving_size: z.string().max(50).optional(),
  flavour_preference: z.string().max(200).optional(),
  phone: z
    .string()
    .regex(
      /^[+]?[\d\s\-()]{7,15}$/,
      "Please enter a valid phone number"
    ),
});

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100)
    .trim(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^[+]?[\d\s\-()]{7,15}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000)
    .trim(),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
