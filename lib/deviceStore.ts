"use client";

import { useEffect, useState } from "react";
import { devices as seedDevices, defaultDisplaySettings } from "@/data/demo/devices";
import type { LinkedDevice } from "@/lib/types";
import { addActivity } from "@/lib/store";
import { upsertCloudDevice } from "@/lib/cloud/repository";

const KEY = "vital-id-linked-devices-v3";
const EVENT = "vital-id-device-state-changed";
const LEGACY_STATUS_KEY = "vital-id-devices";
const hasWindow = () => typeof window !== "undefined";
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

function normalize(device: LinkedDevice): LinkedDevice {
  return {
    ...device,
    display: { ...defaultDisplaySettings, ...(device.display ?? {}) },
  };
}

function seeded(): LinkedDevice[] {
  if (!hasWindow()) return clone(seedDevices).map(normalize);
  let legacy: Record<string, "active" | "deactivated"> = {};
  try {
    legacy = JSON.parse(localStorage.getItem(LEGACY_STATUS_KEY) || "{}");
  } catch {}
  return clone(seedDevices).map((device) => normalize({ ...device, status: legacy[device.id] ?? device.status }));
}

export function readDevices(): LinkedDevice[] {
  if (!hasWindow()) return seeded();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const initial = seeded();
      localStorage.setItem(KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw) as LinkedDevice[];
    return parsed.map(normalize);
  } catch {
    return seeded();
  }
}

export function writeDevices(devices: LinkedDevice[]) {
  if (!hasWindow()) return;
  localStorage.setItem(KEY, JSON.stringify(devices.map(normalize)));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function getDeviceByQrSlug(qrSlug: string) {
  return readDevices().find((d) => d.qrSlug === qrSlug) ?? null;
}

export function getPrimaryDevice(patientSlug: string) {
  return readDevices().find((d) => d.patientSlug === patientSlug && d.status === "active") ?? null;
}

export function saveDevice(device: LinkedDevice) {
  const all = readDevices();
  const normalized = normalize(device);
  const exists = all.some((d) => d.id === device.id);
  writeDevices(exists ? all.map((d) => d.id === device.id ? normalized : d) : [normalized, ...all]);
  void upsertCloudDevice(normalized).catch(() => {});
}

export function updateDevice(id: string, updater: (device: LinkedDevice) => LinkedDevice) {
  const all = readDevices();
  const current = all.find((d) => d.id === id);
  if (!current) return null;
  const next = normalize(updater(clone(current)));
  writeDevices(all.map((d) => d.id === id ? next : d));
  void upsertCloudDevice(next).catch(() => {});
  return next;
}

export function setDeviceStatus(id: string, status: "active" | "deactivated") {
  const next = updateDevice(id, (device) => ({ ...device, status }));
  if (next) addActivity({ type: "update", title: `Device ${status}`, detail: next.name });
  return next;
}

export function createDevice(patientSlug: string, name: string, type: LinkedDevice["type"] = "card") {
  const device: LinkedDevice = {
    id: crypto.randomUUID(),
    name: name.trim() || "Medical ID",
    patientSlug,
    qrSlug: `qr-${crypto.randomUUID().replace(/-/g, "")}`,
    type,
    status: "active",
    createdAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    display: { ...defaultDisplaySettings },
  };
  saveDevice(device);
  addActivity({ type: "update", title: "Medical ID created", detail: device.name });
  return device;
}

export function regenerateQr(id: string) {
  const next = updateDevice(id, (device) => ({ ...device, qrSlug: `qr-${crypto.randomUUID().replace(/-/g, "")}` }));
  if (next) addActivity({ type: "update", title: "QR link regenerated", detail: next.name });
  return next;
}

export function markDeviceScanned(qrSlug: string) {
  const next = updateDeviceByQr(qrSlug, (device) => ({ ...device, lastScanned: new Date().toISOString() }));
  return next;
}

export function updateDeviceByQr(qrSlug: string, updater: (device: LinkedDevice) => LinkedDevice) {
  const all = readDevices();
  const current = all.find((d) => d.qrSlug === qrSlug);
  if (!current) return null;
  const next = normalize(updater(clone(current)));
  writeDevices(all.map((d) => d.id === current.id ? next : d));
  void upsertCloudDevice(next).catch(() => {});
  return next;
}

export function resetDevices() {
  if (!hasWindow()) return;
  localStorage.removeItem(KEY);
  writeDevices(seeded());
}

export function useDevices() {
  const [devices, setDevices] = useState<LinkedDevice[]>(clone(seedDevices).map(normalize));
  useEffect(() => {
    const refresh = () => setDevices(readDevices());
    refresh();
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return devices;
}

export function hydrateDevicesFromCloud(devices: LinkedDevice[]) {
  if (!devices.length) return;
  const local = readDevices();
  const byId = new Map(local.map((device) => [device.id, device]));
  devices.forEach((device) => byId.set(device.id, normalize(device)));
  writeDevices(Array.from(byId.values()));
}
