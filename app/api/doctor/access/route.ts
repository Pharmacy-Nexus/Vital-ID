import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin";
import { signClinicianToken } from "@/lib/server/sessionToken";
import type { PatientProfile } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "cloud_not_configured" }, { status: 503 });

  const body = await request.json().catch(() => ({}));
  const qrSlug = String(body?.qrSlug ?? "");
  const otp = String(body?.otp ?? "");
  const expectedOtp = process.env.VITAL_ID_DEMO_OTP || "4827";

  if (!qrSlug) return NextResponse.json({ error: "missing_qr" }, { status: 400 });
  if (otp !== expectedOtp) return NextResponse.json({ error: "invalid_otp" }, { status: 401 });

  const { data: deviceRow, error: deviceError } = await supabase
    .from("devices")
    .select("id,owner_id,patient_id,status")
    .eq("qr_slug", qrSlug)
    .maybeSingle();

  if (deviceError) return NextResponse.json({ error: "device_lookup_failed" }, { status: 500 });
  if (!deviceRow || deviceRow.status !== "active") return NextResponse.json({ error: "not_found" }, { status: 404 });

  const { data: patientRow, error: patientError } = await supabase
    .from("patients")
    .select("data")
    .eq("id", deviceRow.patient_id)
    .single();

  if (patientError || !patientRow) return NextResponse.json({ error: "patient_not_found" }, { status: 404 });

  const expiresAt = Date.now() + 20 * 60 * 1000;
  const token = signClinicianToken({ qrSlug, patientId: deviceRow.patient_id, exp: expiresAt });

  await supabase.from("activity_logs").insert({
    owner_id: deviceRow.owner_id,
    patient_id: deviceRow.patient_id,
    device_id: deviceRow.id,
    type: "access",
    title: "Healthcare access granted",
    detail: "20-minute cloud session",
  });

  return NextResponse.json({
    token,
    expiresAt,
    patient: patientRow.data as PatientProfile,
  });
}
