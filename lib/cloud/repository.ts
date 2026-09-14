"use client";

import type { LinkedDevice, PatientProfile } from "@/lib/types";
import { getSupabaseBrowser, isCloudConfigured } from "@/lib/cloud/supabaseBrowser";

export type CloudActivity = {
  id: string;
  type: "scan" | "access" | "update";
  title: string;
  detail: string;
  created_at: string;
};

export async function getCloudUser() {
  const supabase = getSupabaseBrowser();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user ?? null;
}

export async function loadCloudState() {
  const supabase = getSupabaseBrowser();
  const user = await getCloudUser();
  if (!supabase || !user) return { user: null, patients: [] as PatientProfile[], devices: [] as LinkedDevice[], activity: [] as CloudActivity[] };

  const [patientsResult, devicesResult, activityResult] = await Promise.all([
    supabase.from("patients").select("data").eq("owner_id", user.id).order("updated_at", { ascending: false }),
    supabase.from("devices").select("data").eq("owner_id", user.id).order("updated_at", { ascending: false }),
    supabase.from("activity_logs").select("id,type,title,detail,created_at").eq("owner_id", user.id).order("created_at", { ascending: false }).limit(100),
  ]);

  if (patientsResult.error) throw patientsResult.error;
  if (devicesResult.error) throw devicesResult.error;
  if (activityResult.error) throw activityResult.error;

  return {
    user,
    patients: (patientsResult.data ?? []).map((row: any) => row.data as PatientProfile),
    devices: (devicesResult.data ?? []).map((row: any) => row.data as LinkedDevice),
    activity: (activityResult.data ?? []) as CloudActivity[],
  };
}

export async function upsertCloudPatient(patient: PatientProfile) {
  if (!isCloudConfigured()) return false;
  const supabase = getSupabaseBrowser();
  const user = await getCloudUser();
  if (!supabase || !user) return false;
  const { error } = await supabase.from("patients").upsert(
    { owner_id: user.id, slug: patient.slug, data: patient },
    { onConflict: "owner_id,slug" }
  );
  if (error) throw error;
  return true;
}

async function getCloudPatientId(patientSlug: string) {
  const supabase = getSupabaseBrowser();
  const user = await getCloudUser();
  if (!supabase || !user) return null;
  const { data, error } = await supabase
    .from("patients")
    .select("id")
    .eq("owner_id", user.id)
    .eq("slug", patientSlug)
    .maybeSingle();
  if (error) throw error;
  return data?.id as string | undefined ?? null;
}

export async function upsertCloudDevice(device: LinkedDevice) {
  if (!isCloudConfigured()) return false;
  const supabase = getSupabaseBrowser();
  const user = await getCloudUser();
  if (!supabase || !user) return false;
  let patientId = await getCloudPatientId(device.patientSlug);
  if (!patientId) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    patientId = await getCloudPatientId(device.patientSlug);
  }
  if (!patientId) return false;
  const { error } = await supabase.from("devices").upsert(
    {
      owner_id: user.id,
      patient_id: patientId,
      client_id: device.id,
      qr_slug: device.qrSlug,
      status: device.status,
      data: device,
    },
    { onConflict: "owner_id,client_id" }
  );
  if (error) throw error;
  return true;
}

export async function pushLocalStateToCloud(patients: PatientProfile[], devices: LinkedDevice[]) {
  for (const patient of patients) await upsertCloudPatient(patient);
  for (const device of devices) await upsertCloudDevice(device);
}

export async function signOutCloud() {
  const supabase = getSupabaseBrowser();
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function insertCloudActivity(type: "scan" | "access" | "update", title: string, detail: string, patientSlug?: string) {
  if (!isCloudConfigured()) return false;
  const supabase = getSupabaseBrowser();
  const user = await getCloudUser();
  if (!supabase || !user) return false;
  let patientId: string | null = null;
  if (patientSlug) patientId = await getCloudPatientId(patientSlug);
  const { error } = await supabase.from("activity_logs").insert({
    owner_id: user.id,
    patient_id: patientId,
    device_id: null,
    type,
    title,
    detail,
  });
  if (error) throw error;
  return true;
}
