import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Cliente con service_role — bypasea RLS. Solo usar en API routes de servidor.
// NUNCA exponer en código cliente ni en variables NEXT_PUBLIC_*.
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
