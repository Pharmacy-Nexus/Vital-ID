import type { DeviceDisplaySettings, LinkedDevice } from "@/lib/types";

export const defaultDisplaySettings: DeviceDisplaySettings = {
  basicInfo: true,
  bloodType: true,
  allergies: true,
  conditions: true,
  medications: true,
  emergencyContact: true,
  documents: false,
};

export const devices: LinkedDevice[] = [
  {
    id: "dev1",
    name: "Emergency Bracelet",
    patientSlug: "demo-001",
    qrSlug: "qr-bracelet-demo-001",
    type: "bracelet",
    status: "active",
    createdAt: "01 Sep 2026",
    display: { ...defaultDisplaySettings },
  },
  {
    id: "dev2",
    name: "Wallet Card",
    patientSlug: "demo-001",
    qrSlug: "qr-wallet-demo-001",
    type: "card",
    status: "active",
    createdAt: "01 Sep 2026",
    display: { ...defaultDisplaySettings, medications: false },
  },
  {
    id: "dev3",
    name: "Child Bag Tag",
    patientSlug: "demo-child-001",
    qrSlug: "qr-child-bag-demo-001",
    type: "bagtag",
    status: "active",
    createdAt: "05 Sep 2026",
    display: { ...defaultDisplaySettings, medications: false, documents: false },
  },
];
