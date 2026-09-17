import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin";
import { buildSharedPatient } from "@/lib/server/shareProfile";
import type { PatientProfile, ShareScope } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "cloud_not_configured" }, { status: 503 });

  const { data: share, error } = await supabase
    .from("share_links")
    .select("id,owner_id,patient_id,scope,expires_at,revoked_at")
    .eq("token", token)
    .maybeSingle();

  if (error) return NextResponse.json({ error: "share_lookup_failed" }, { status: 500 });
  if (!share) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (share.revoked_at) return NextResponse.json({ error: "revoked" }, { status: 410 });
  if (new Date(share.expires_at).getTime() <= Date.now()) return NextResponse.json({ error: "expired" }, { status: 410 });

  const { data: patientRow, error: patientError } = await supabase
    .from("patients")
    .select("data")
    .eq("id", share.patient_id)
    .single();
  if (patientError || !patientRow) return NextResponse.json({ error: "patient_not_found" }, { status: 404 });

  const source = patientRow.data as PatientProfile;
  const scope = share.scope as ShareScope;
  const patient = buildSharedPatient(source, scope);
  const documentUrls: Record<string, string> = {};

  if (scope === "full") {
    for (const doc of source.documents) {
      if (!doc.fileKey?.startsWith("cloud:")) continue;
      const path = doc.fileKey.slice("cloud:".length);
      const secondsRemaining = Math.max(60, Math.min(600, Math.floor((new Date(share.expires_at).getTime() - Date.now()) / 1000)));
      const { data: signed } = await supabase.storage.from("medical-documents").createSignedUrl(path, secondsRemaining);
      if (signed?.signedUrl) documentUrls[doc.id] = signed.signedUrl;
    }
  }

  await supabase.from("activity_logs").insert({
    owner_id: share.owner_id,
    patient_id: share.patient_id,
    device_id: null,
    type: "access",
    title: "Temporary record opened",
    detail: `${scope} share`,
  });

  return NextResponse.json({
    patient,
    scope,
    expiresAt: share.expires_at,
    documentUrls,
  }, { headers: { "Cache-Control": "no-store, max-age=0" } });
}
