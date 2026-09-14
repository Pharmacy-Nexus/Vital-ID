"use client";

const DB_NAME = "vital-id-files";
const STORE = "files";
const VERSION = 1;

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

export async function saveLocalFile(file: File, key = crypto.randomUUID()) {
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

export async function getLocalFile(key: string): Promise<StoredFile | null> {
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

export async function deleteLocalFile(key: string) {
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
