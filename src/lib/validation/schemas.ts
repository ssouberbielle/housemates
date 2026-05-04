import { z } from "zod";
import { isValidEmail } from "./email";
import { validateCI } from "./document";

export const emailSchema = z
  .string()
  .min(1, "Email requerido")
  .refine(isValidEmail, "Email inválido");

export const documentSchema = z
  .string()
  .min(1, "Cédula requerida")
  .refine(validateCI, "Cédula uruguaya inválida");

export const phoneSchema = z
  .string()
  .min(8, "Teléfono inválido")
  .regex(/^[\d\s\+\-\(\)]+$/, "Teléfono inválido");

export const buyerSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  email: emailSchema,
  phone: phoneSchema,
  document: documentSchema,
});

export const gateSchema = z.object({
  password: z.string().min(1, "Password requerido"),
});

export const whitelistBulkSchema = z.object({
  emails_raw: z.string().min(1),
  tags: z.array(z.string()).optional().default([]),
  notes: z.string().optional().default(""),
});

export const checkoutSchema = z.object({
  event_id: z.string().uuid(),
  tier_id: z.string().uuid(),
  buyer: buyerSchema,
});

export type Buyer = z.infer<typeof buyerSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type WhitelistBulkInput = z.infer<typeof whitelistBulkSchema>;
