import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin";
import type { LinkedDevice } from "@/lib/types";

export const dynamic = "force-dynamic";

type Body = {
  event?: "scan" | "location";
  latitude?: number;
  longitude?: number;
};

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "cloud_not_configured" }, { status: 503 });

  const body = (await request.json().catch(() => ({}))) as Body;
  const { data: deviceRow, error } = await supabase
    .from("devices")
    .select("id,owner_id,patient_id,status,data")
    .eq("qr_slug", slug)
    .maybeSingle();

  if (error) return NextResponse.json({ error: "device_lookup_failed" }, { status: 500 });
  if (!deviceRow || deviceRow.status !== "active") return NextResponse.json({ error: "not_found" }, { status: 404 });

  const event = body.event === "location" ? "location" : "scan";
  const device = deviceRow.data as LinkedDevice;
  const now = new Date().toISOString();

  if (event === "scan") {
    await supabase
      .from("devices")
      .update({ data: { ...device, lastScanned: now } })
      .eq("id", deviceRow.id);
  }

  const detail = event === "location" && Number.isFinite(body.latitude) && Number.isFinite(body.longitude)
    ? `${device.name} · ${Number(body.latitude).toFixed(4)}, ${Number(body.longitude).toFixed(4)}`
    : `${device.name} · ${slug}`;

  let shouldInsert = true;
  if (event === "scan") {
    const since = new Date(Date.now() - 30_000).toISOString();
    const { data: recent } = await supabase
      .from("activity_logs")
      .select("id")
      .eq("device_id", deviceRow.id)
      .eq("title", "Medical ID scanned")
      .gte("created_at", since)
      .limit(1);
    shouldInsert = !recent?.length;
  }

  if (shouldInsert) {
    await supabase.from("activity_logs").insert({
      owner_id: deviceRow.owner_id,
      patient_id: deviceRow.patient_id,
      device_id: deviceRow.id,
      type: event === "location" ? "access" : "scan",
      title: event === "location" ? "Location shared" : "Medical ID scanned",
      detail,
    });
  }

  return NextResponse.json({ ok: true });
}
