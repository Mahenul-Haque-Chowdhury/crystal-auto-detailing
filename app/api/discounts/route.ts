import { NextResponse } from "next/server";

import { getDiscountsTableName, getSupabaseAdmin } from "@/lib/supabaseAdmin";

const MIN_DISCOUNT = 21;
const MAX_DISCOUNT = 31;

type RequestBody = {
  name?: unknown;
  phone?: unknown;
  carModel?: unknown;
};

const normalizeName = (value: string) => value.trim();
const normalizePhone = (value: string) => value.replace(/\D/g, "");
const normalizeCarModel = (value: string) => value.trim();

export async function POST(request: Request) {
  const supabaseAdmin = getSupabaseAdmin();
  const discountsTableName = getDiscountsTableName();

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ status: "invalid_json" }, { status: 400 });
  }

  const nameRaw = typeof body.name === "string" ? body.name : "";
  const phoneRaw = typeof body.phone === "string" ? body.phone : "";
  const carModelRaw = typeof body.carModel === "string" ? body.carModel : "";

  const name = normalizeName(nameRaw);
  const phone = normalizePhone(phoneRaw);
  const car_model = normalizeCarModel(carModelRaw);

  if (!name || !phone || !car_model) {
    return NextResponse.json({ status: "missing_fields" }, { status: 400 });
  }

  const { data: existing, error: existingError } = await supabaseAdmin
    .from(discountsTableName)
    .select("id")
    .or(`name.ilike.${name},phone.eq.${phone}`)
    .limit(1);

  if (existingError) {
    return NextResponse.json(
      { status: "error", message: existingError.message },
      { status: 500 }
    );
  }

  if (existing && existing.length > 0) {
    return NextResponse.json({ status: "duplicate" }, { status: 409 });
  }

  const discount =
    Math.floor(Math.random() * (MAX_DISCOUNT - MIN_DISCOUNT + 1)) + MIN_DISCOUNT;

  const { error: insertError } = await supabaseAdmin.from(discountsTableName).insert({
    name,
    phone,
    car_model,
    discount,
  });

  if (insertError) {
    return NextResponse.json(
      { status: "error", message: insertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ status: "ok", discount });
}
