"use client";

import { getSupabaseBrowser } from "@/lib/cloud/supabaseBrowser";
import { getCloudUser } from "@/lib/cloud/repository";

const DB_NAME = "vital-id-files";
const STORE = "files";
const VERSION = 1;
const CLOUD_PREFIX = "cloud:";
const BUCKET = "medical-documents";

type StoredFile = { key: string; blob: Blob; name: string; type: string; size: number; savedAt: string };

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") return reject(new Error("IndexedDB is not available"));
    const request = indexedDB.open(DB_NAME, VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "key" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open file storage"));
  });
}

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").slice(0, 120) || "file";
}

async function saveIndexedDb(file: File, key: string) {
  const db = await openDb();
  const item: StoredFile = { key, blob: file, name: file.name, type: file.type || "application/octet-stream", size: file.size, savedAt: new Date().toISOString() };
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Could not save file"));
  });
  db.close();
  return key;
}

export async function saveLocalFile(file: File, key = crypto.randomUUID(), patientSlug = "patient") {
  const supabase = getSupabaseBrowser();
  const user = await getCloudUser();
  if (supabase && user) {
    const path = `${user.id}/${patientSlug}/${key}/${safeName(file.name)}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      upsert: false,
      contentType: file.type || "application/octet-stream",
    });
    if (!error) return `${CLOUD_PREFIX}${path}`;
  }
  return saveIndexedDb(file, key);
}

export async function getLocalFile(key: string): Promise<StoredFile | null> {
  if (key.startsWith(CLOUD_PREFIX)) {
    const supabase = getSupabaseBrowser();
    const user = await getCloudUser();
    if (!supabase || !user) return null;
    const path = key.slice(CLOUD_PREFIX.length);
    const { data, error } = await supabase.storage.from(BUCKET).download(path);
    if (error || !data) return null;
    return { key, blob: data, name: path.split("/").pop() || "file", type: data.type || "application/octet-stream", size: data.size, savedAt: new Date().toISOString() };
  }

  const db = await openDb();
  const result = await new Promise<StoredFile | null>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).get(key);
    request.onsuccess = () => resolve((request.result as StoredFile | undefined) ?? null);
    request.onerror = () => reject(request.error ?? new Error("Could not read file"));
  });
  db.close();
  return result;
}

export async function getDoctorDocumentUrl(documentId: string, token: string) {
  const response = await fetch(`/api/doctor/document?documentId=${encodeURIComponent(documentId)}&token=${encodeURIComponent(token)}`, { cache: "no-store" });
  if (!response.ok) return null;
  const data = await response.json();
  return typeof data?.url === "string" ? data.url : null;
}

export async function deleteLocalFile(key: string) {
  if (key.startsWith(CLOUD_PREFIX)) {
    const supabase = getSupabaseBrowser();
    const user = await getCloudUser();
    if (!supabase || !user) throw new Error("Sign in to delete this cloud file");
    const path = key.slice(CLOUD_PREFIX.length);
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) throw error;
    return;
  }

  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Could not delete file"));
  });
  db.close();
}

export async function clearLocalFiles() {
  if (typeof indexedDB === "undefined") return;
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Could not clear files"));
  });
  db.close();
}
