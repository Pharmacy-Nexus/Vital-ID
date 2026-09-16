import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin";
import { buildEmergencyPatient, sanitizeDeviceForPublic } from "@/lib/server/publicProfile";
import type { LinkedDevice, PatientProfile } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "cloud_not_configured" }, { status: 503 });

  const { data: deviceRow, error: deviceError } = await supabase
    .from("devices")
    .select("id,owner_id,patient_id,status,data")
    .eq("qr_slug", slug)
    .maybeSingle();

  if (deviceError) return NextResponse.json({ error: "device_lookup_failed" }, { status: 500 });
  if (!deviceRow) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (deviceRow.status !== "active") return NextResponse.json({ error: "disabled" }, { status: 410 });

  const { data: patientRow, error: patientError } = await supabase
    .from("patients")
    .select("data")
    .eq("id", deviceRow.patient_id)
    .single();

  if (patientError || !patientRow) return NextResponse.json({ error: "patient_not_found" }, { status: 404 });

  const device = sanitizeDeviceForPublic(deviceRow.data as LinkedDevice);
  const sourcePatient = patientRow.data as PatientProfile;
  const patient = buildEmergencyPatient(sourcePatient, device);

  if (sourcePatient.photoEmergencyVisible && device.display.basicInfo && sourcePatient.photoFileKey?.startsWith("cloud:")) {
    const path = sourcePatient.photoFileKey.slice("cloud:".length);
    const { data: signed } = await supabase.storage.from("medical-documents").createSignedUrl(path, 300);
    if (signed?.signedUrl) patient.photoUrl = signed.signedUrl;
  }

  return NextResponse.json(
    { patient, device },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
