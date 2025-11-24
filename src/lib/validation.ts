import { z } from "zod";

export const memberSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters long"),
  membershipType: z
    .string()
    .min(2, "Membership type must be at least 2 characters long"),
  status: z.enum(["ACTIVE", "PAUSED", "CANCELLED"]),
  startDate: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid start date"),
  endDate: z
    .string()
    .optional()
    .nullable()
    .refine(
      (value) => !value || !Number.isNaN(Date.parse(value)),
      "Invalid end date",
    )
    .transform((value) => value || null),
});

export type MemberSchema = z.infer<typeof memberSchema>;

