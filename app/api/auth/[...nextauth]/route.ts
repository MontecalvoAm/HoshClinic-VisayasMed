// HoshClinic/app/api/auth/[...nextauth]/route.ts
// HoshClinic/app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth"; // Import handlers from centralized auth.ts

export const { GET, POST } = handlers;
