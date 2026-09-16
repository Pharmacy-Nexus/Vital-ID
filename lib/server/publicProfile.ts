import type { LinkedDevice, PatientProfile } from "@/lib/types";

const fallbackDisplay = {
  basicInfo: true,
  bloodType: true,
  allergies: true,
  conditions: true,
  medications: true,
  emergencyContact: true,
  documents: false,
};

export function sanitizeDeviceForPublic(device: LinkedDevice): LinkedDevice {
  return {
    ...device,
    display: { ...fallbackDisplay, ...(device.display ?? {}) },
  };
}

export function buildEmergencyPatient(patient: PatientProfile, device: LinkedDevice): PatientProfile {
  const display = { ...fallbackDisplay, ...(device.display ?? {}) };
  return {
    ...patient,
    firstName: display.basicInfo ? patient.firstName : "",
    lastName: display.basicInfo ? patient.lastName : "",
    age: display.basicInfo ? patient.age : 0,
    dateOfBirth: undefined,
    photoFileKey: undefined,
    photoFileName: undefined,
    photoUrl: undefined,
    photoEmergencyVisible: Boolean(display.basicInfo && patient.photoEmergencyVisible),
    bloodType: display.bloodType ? patient.bloodType : "",
    bloodTypeSource: display.bloodType ? patient.bloodTypeSource : undefined,
    allergies: display.allergies ? patient.allergies.filter((a) => a.visibility !== "private") : [],
    conditions: display.conditions ? patient.conditions.filter((c) => c.status === "active" && c.visibility !== "private") : [],
    medications: display.medications ? patient.medications.filter((m) => m.visibility !== "private") : [],
    emergencyContacts: display.emergencyContact ? patient.emergencyContacts.filter((c) => c.visibility !== "private") : [],
    documents: display.documents
      ? patient.documents
          .filter((d) => d.visibility === "emergency")
          .map(({ fileKey: _fileKey, fileName: _fileName, mimeType: _mimeType, size: _size, ...doc }) => doc)
      : [],
    labResults: [],
    radiology: [],
    surgeries: [],
    vaccinations: [],
    timeline: [],
  };
}
