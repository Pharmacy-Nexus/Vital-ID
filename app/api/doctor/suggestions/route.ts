import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin";
import { verifyClinicianToken } from "@/lib/server/sessionToken";
import type { ClinicalSuggestionKind } from "@/lib/types";

export const dynamic = "force-dynamic";

const allowedKinds = new Set<ClinicalSuggestionKind>([
  "condition",
  "medication",
  "allergy",
  "lab",
  "radiology",
  "surgery",
  "vaccination",
  "note",
  "document",
]);

function safeText(value: FormDataEntryValue | null, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").slice(0, 120) || "file";
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "cloud_not_configured" }, { status: 503 });

  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "invalid_form" }, { status: 400 });

  const token = safeText(form.get("token"), 5000);
  const session = verifyClinicianToken(token);
  if (!session) return NextResponse.json({ error: "invalid_session" }, { status: 401 });

  const kind = safeText(form.get("kind"), 40) as ClinicalSuggestionKind;
  if (!allowedKinds.has(kind)) return NextResponse.json({ error: "invalid_kind" }, { status: 400 });

  const { data: patientRow, error: patientError } = await supabase
    .from("patients")
    .select("id,owner_id,slug")
    .eq("id", session.patientId)
    .single();

  if (patientError || !patientRow) return NextResponse.json({ error: "patient_not_found" }, { status: 404 });

  const { data: deviceRow } = await supabase
    .from("devices")
    .select("id,qr_slug,status")
    .eq("qr_slug", session.qrSlug)
    .eq("patient_id", session.patientId)
    .maybeSingle();

  if (!deviceRow || deviceRow.status !== "active") return NextResponse.json({ error: "device_not_active" }, { status: 403 });

  const payloadRaw = safeText(form.get("payload"), 12000);
  let payload: Record<string, string> = {};
  try {
    const parsed = JSON.parse(payloadRaw || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("invalid");
    payload = Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [String(key).slice(0, 80), String(value ?? "").trim().slice(0, 2000)])
    );
  } catch {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const suggestionId = crypto.randomUUID();
  let attachment: { fileKey: string; fileName: string; mimeType: string; size: number } | null = null;
  const maybeFile = form.get("file");
  if (maybeFile instanceof File && maybeFile.size > 0) {
    const allowedFile = maybeFile.type === "application/pdf" || maybeFile.type.startsWith("image/");
    if (!allowedFile) return NextResponse.json({ error: "unsupported_file" }, { status: 415 });
    if (maybeFile.size > 12 * 1024 * 1024) return NextResponse.json({ error: "file_too_large" }, { status: 413 });

    const path = `${patientRow.owner_id}/${patientRow.slug}/clinical-suggestions/${suggestionId}/${safeName(maybeFile.name)}`;
    const bytes = new Uint8Array(await maybeFile.arrayBuffer());
    const { error: uploadError } = await supabase.storage.from("medical-documents").upload(path, bytes, {
      upsert: false,
      contentType: maybeFile.type || "application/octet-stream",
    });
    if (uploadError) return NextResponse.json({ error: "upload_failed" }, { status: 500 });
    attachment = {
      fileKey: `cloud:${path}`,
      fileName: maybeFile.name,
      mimeType: maybeFile.type || "application/octet-stream",
      size: maybeFile.size,
    };
  }

  const { data: inserted, error: insertError } = await supabase
    .from("clinical_suggestions")
    .insert({
      id: suggestionId,
      owner_id: patientRow.owner_id,
      patient_id: patientRow.id,
      qr_slug: session.qrSlug,
      kind,
      status: "pending",
      payload,
      attachment,
    })
    .select("id,patient_id,qr_slug,kind,status,payload,attachment,created_at,reviewed_at")
    .single();

  if (insertError) {
    if (attachment?.fileKey.startsWith("cloud:")) {
      await supabase.storage.from("medical-documents").remove([attachment.fileKey.slice("cloud:".length)]).catch(() => null);
    }
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  await supabase.from("activity_logs").insert({
    owner_id: patientRow.owner_id,
    patient_id: patientRow.id,
    device_id: deviceRow.id,
    type: "update",
    title: "Clinician update suggested",
    detail: `${kind}: ${payload.title || payload.name || payload.allergen || payload.testName || "Clinical update"}`,
  });

  return NextResponse.json({
    suggestion: {
      id: inserted.id,
      patientId: inserted.patient_id,
      patientSlug: patientRow.slug,
      qrSlug: inserted.qr_slug,
      kind: inserted.kind,
      status: inserted.status,
      payload: inserted.payload,
      attachment: inserted.attachment,
      createdAt: inserted.created_at,
      reviewedAt: inserted.reviewed_at,
    },
  });
}
