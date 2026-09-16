export type Freshness = "current" | "review" | "outdated";
export type SourceType = "patient" | "document" | "provider";
export type Visibility = "emergency" | "private";

export type TimelineEvent = {
  id: string;
  year: string | number;
  title: string;
  detail: string;
};

export type ConditionItem = {
  id: string;
  name: string;
  status: "active" | "inactive";
  diagnosedYear: string | number;
  source: SourceType;
  sourceDetail?: string;
  confirmedAt: string;
  freshness: Freshness;
  visibility?: Visibility;
};

export type MedicationItem = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  source: SourceType;
  sourceDetail?: string;
  confirmedAt: string;
  freshness: Freshness;
  visibility?: Visibility;
};

export type AllergyItem = {
  id: string;
  allergen: string;
  reaction: string;
  severity: "critical" | "moderate" | "mild";
  source: SourceType;
  sourceDetail?: string;
  confirmedAt: string;
  freshness: Freshness;
  visibility?: Visibility;
};

export type EmergencyContact = {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  visibility?: Visibility;
};

export type PatientDocument = {
  id: string;
  title: string;
  date: string;
  provider: string;
  fileKey?: string;
  fileName?: string;
  mimeType?: string;
  size?: number;
  visibility?: Visibility;
};

export type DeviceDisplaySettings = {
  basicInfo: boolean;
  bloodType: boolean;
  allergies: boolean;
  conditions: boolean;
  medications: boolean;
  emergencyContact: boolean;
  documents: boolean;
};

export type LinkedDevice = {
  id: string;
  name: string;
  patientSlug: string;
  qrSlug: string;
  type: "bracelet" | "card" | "bagtag" | "travel";
  status: "active" | "deactivated";
  createdAt: string;
  lastScanned?: string;
  display: DeviceDisplaySettings;
};

export type PatientProfile = {
  slug: string;
  firstName: string;
  lastName: string;
  age: number;
  dateOfBirth?: string;
  bloodType: string;
  bloodTypeSource?: SourceType;
  photoColor: string;
  photoFileKey?: string;
  photoFileName?: string;
  photoEmergencyVisible?: boolean;
  photoUrl?: string;
  emergencyProfile: { completeness: number };
  recordCompleteness: number;
  lastConfirmation: string;
  linkedIds: number;
  allergies: AllergyItem[];
  conditions: ConditionItem[];
  medications: MedicationItem[];
  labResults: Array<{
    id: string;
    testName: string;
    value: string;
    unit?: string;
    status: "normal" | "abnormal";
    date: string;
    lab: string;
    documentId?: string;
  }>;
  radiology: Array<{
    id: string;
    type: string;
    bodyPart: string;
    date: string;
    finding: string;
    documentId?: string;
  }>;
  surgeries: Array<{ id: string; name: string; year: string | number; hospital?: string }>;
  vaccinations: Array<{ id: string; name: string; date: string; provider?: string }>;
  timeline: TimelineEvent[];
  emergencyContacts: EmergencyContact[];
  documents: PatientDocument[];
};
