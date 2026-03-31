import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const reservationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  date: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Reservation date must be in the future",
  }),
  service: z.enum(["General Medicine", "Specialist Consultation", "Emergency Services"]),
  message: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ReservationInput = z.infer<typeof reservationSchema>;
