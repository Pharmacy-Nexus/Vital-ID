import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin";
import { verifyClinicianToken } from "@/lib/server/sessionToken";
import type { PatientProfile } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "cloud_not_configured" }, { status: 503 });

  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";
  const documentId = url.searchParams.get("documentId") ?? "";
  const payload = verifyClinicianToken(token);
  if (!payload) return NextResponse.json({ error: "invalid_session" }, { status: 401 });

  const { data: patientRow, error } = await supabase
    .from("patients")
    .select("data")
    .eq("id", payload.patientId)
    .single();

  if (error || !patientRow) return NextResponse.json({ error: "patient_not_found" }, { status: 404 });
  const patient = patientRow.data as PatientProfile;
  const doc = patient.documents.find((item) => item.id === documentId);
  if (!doc?.fileKey?.startsWith("cloud:")) return NextResponse.json({ error: "file_not_found" }, { status: 404 });

  const path = doc.fileKey.slice("cloud:".length);
  const { data, error: signedError } = await supabase.storage.from("medical-documents").createSignedUrl(path, 300);
  if (signedError || !data?.signedUrl) return NextResponse.json({ error: "sign_failed" }, { status: 500 });

  return NextResponse.json({ url: data.signedUrl });
}
