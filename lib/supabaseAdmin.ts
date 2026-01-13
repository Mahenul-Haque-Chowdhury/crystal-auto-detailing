import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const getSupabaseAdmin = (): SupabaseClient => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};

export const getDiscountsTableName = () =>
  process.env.SUPABASE_DISCOUNTS_TABLE ?? "discounts";

export const getBookingsTableName = () =>
  process.env.SUPABASE_BOOKINGS_TABLE ?? "booking_appointments";
