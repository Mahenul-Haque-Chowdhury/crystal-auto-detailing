import { NextResponse } from "next/server";

import { getBookingsTableName, getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const FORMSPREE_BOOKING_ENDPOINT =
  process.env.FORMSPREE_BOOKING_ENDPOINT ?? "https://formspree.io/f/mkoonadg";

const SERVICE_OPTIONS = new Set([
  "Basic Wash",
  "Super Wash & Interior",
  "Single-Stage Polish",
  "Glass Polish",
  "Basic Ceramic (6-9 Months)",
  "Ceramic Care+ (18-24 Months)",
]);

const CAR_TYPE_OPTIONS = new Set(["Sedan", "SUV", "Microbus"]);

type RequestBody = {
  service?: unknown;
  carType?: unknown;
  fullName?: unknown;
  phone?: unknown;
  address?: unknown;
  dateTimeLocal?: unknown;
  remarks?: unknown;
  sourcePage?: unknown;
};

const normalizeText = (value: string) => value.trim();
const normalizePhone = (value: string) => value.replace(/\D/g, "");

const toIsoFromLocalDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

const safeJson = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return (await response.json()) as unknown;
    } catch {
      return null;
    }
  }

  try {
    const text = await response.text();
    return text ? { raw: text } : null;
  } catch {
    return null;
  }
};

export async function POST(request: Request) {
  let supabaseAdmin: ReturnType<typeof getSupabaseAdmin>;
  let bookingsTableName: string;

  try {
    supabaseAdmin = getSupabaseAdmin();
    bookingsTableName = getBookingsTableName();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server misconfigured";
    return NextResponse.json(
      { status: "misconfigured", message },
      { status: 500 }
    );
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ status: "invalid_json" }, { status: 400 });
  }

  const serviceRaw = typeof body.service === "string" ? body.service : "";
  const carTypeRaw = typeof body.carType === "string" ? body.carType : "";
  const fullNameRaw = typeof body.fullName === "string" ? body.fullName : "";
  const phoneRaw = typeof body.phone === "string" ? body.phone : "";
  const addressRaw = typeof body.address === "string" ? body.address : "";
  const dateTimeLocalRaw =
    typeof body.dateTimeLocal === "string" ? body.dateTimeLocal : "";
  const remarksRaw = typeof body.remarks === "string" ? body.remarks : "";
  const sourcePageRaw =
    typeof body.sourcePage === "string" ? body.sourcePage : "";

  const service = normalizeText(serviceRaw);
  const car_type = normalizeText(carTypeRaw);
  const full_name = normalizeText(fullNameRaw);
  const phone = normalizePhone(phoneRaw);
  const address = normalizeText(addressRaw);
  const remarks = normalizeText(remarksRaw).slice(0, 1000) || null;
  const requested_datetime_iso = normalizeText(dateTimeLocalRaw)
    ? toIsoFromLocalDateTime(dateTimeLocalRaw)
    : null;

  if (!service || !car_type || !full_name || !phone || !address || !requested_datetime_iso) {
    return NextResponse.json(
      { status: "missing_fields", message: "Please fill out all required fields." },
      { status: 400 }
    );
  }

  if (!SERVICE_OPTIONS.has(service)) {
    return NextResponse.json(
      { status: "invalid_fields", message: "Invalid service selected." },
      { status: 400 }
    );
  }

  if (!CAR_TYPE_OPTIONS.has(car_type)) {
    return NextResponse.json(
      { status: "invalid_fields", message: "Invalid car type selected." },
      { status: 400 }
    );
  }

  const user_agent = request.headers.get("user-agent");
  const xForwardedFor = request.headers.get("x-forwarded-for");
  const ip = xForwardedFor ? xForwardedFor.split(",")[0]?.trim() : null;
  const referer = request.headers.get("referer");
  const source_page = normalizeText(sourcePageRaw) || referer || null;

  const insertPayload = {
    service,
    car_type,
    full_name,
    phone,
    address,
    requested_datetime: requested_datetime_iso,
    remarks,
    source_page,
    user_agent,
    ip,
  };

  const { data: bookingRow, error: bookingError } = await supabaseAdmin
    .from(bookingsTableName)
    .upsert(insertPayload, {
      onConflict: "phone,requested_datetime,service,car_type",
    })
    .select("id")
    .single();

  if (bookingError || !bookingRow?.id) {
    return NextResponse.json(
      {
        status: "error",
        message: bookingError?.message ?? "Failed to save booking request.",
      },
      { status: 500 }
    );
  }

  const formBody = new URLSearchParams();
  formBody.set("service", service);
  formBody.set("car_type", car_type);
  formBody.set("full_name", full_name);
  formBody.set("phone", phone);
  formBody.set("address", address);
  formBody.set("requested_datetime", requested_datetime_iso);
  if (remarks) formBody.set("remarks", remarks);
  if (source_page) formBody.set("source_page", source_page);
  formBody.set("_subject", `New booking request: ${service} (${car_type})`);

  let formspreeStatus: number | null = null;
  let formspreeResponse: unknown = null;

  try {
    const formspreeRes = await fetch(FORMSPREE_BOOKING_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: formBody.toString(),
    });

    formspreeStatus = formspreeRes.status;
    formspreeResponse = await safeJson(formspreeRes);

    await supabaseAdmin
      .from(bookingsTableName)
      .update({
        formspree_status: formspreeStatus,
        formspree_response: formspreeResponse,
      })
      .eq("id", bookingRow.id);

    if (!formspreeRes.ok) {
      return NextResponse.json(
        {
          status: "formspree_error",
          message: "Booking saved, but email notification failed. Please try again.",
          bookingId: bookingRow.id,
        },
        { status: 502 }
      );
    }
  } catch {
    await supabaseAdmin
      .from(bookingsTableName)
      .update({
        formspree_status: formspreeStatus,
        formspree_response: formspreeResponse,
      })
      .eq("id", bookingRow.id);

    return NextResponse.json(
      {
        status: "formspree_error",
        message: "Booking saved, but email notification failed. Please try again.",
        bookingId: bookingRow.id,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ status: "ok", bookingId: bookingRow.id });
}
