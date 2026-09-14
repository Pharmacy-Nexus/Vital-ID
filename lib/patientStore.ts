"use client";

import { useEffect, useState } from "react";
import { patients as seedPatients } from "@/data/demo/patients";
import type { PatientProfile } from "@/lib/types";

const KEY = "vital-id-demo-state";
const EVENT = "vital-id-patient-state-changed";

type DemoPatientState = {
  version: 2;
  activeSlug: string;
  patients: Record<string, PatientProfile>;
};

const hasWindow = () => typeof window !== "undefined";
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

function seedState(): DemoPatientState {
  return {
    version: 2,
    activeSlug: "demo-001",
    patients: clone(seedPatients),
  };
}

function normalizePatient(patient: PatientProfile): PatientProfile {
  return {
    ...patient,
    bloodTypeSource: patient.bloodTypeSource ?? "patient",
    conditions: patient.conditions.map((item) => ({ ...item, visibility: item.visibility ?? "emergency" })),
    medications: patient.medications.map((item) => ({ ...item, visibility: item.visibility ?? "emergency" })),
    allergies: patient.allergies.map((item) => ({ ...item, visibility: item.visibility ?? "emergency" })),
    emergencyContacts: patient.emergencyContacts.map((item) => ({ ...item, visibility: item.visibility ?? "emergency" })),
  };
}

function normalizeState(state: DemoPatientState): DemoPatientState {
  const merged: Record<string, PatientProfile> = {};
  const all = { ...clone(seedPatients), ...(state?.patients ?? {}) };
  Object.entries(all).forEach(([slug, patient]) => {
    merged[slug] = normalizePatient(patient);
  });
  return {
    version: 2,
    activeSlug: state?.activeSlug && merged[state.activeSlug] ? state.activeSlug : "demo-001",
    patients: merged,
  };
}

export function readPatientState(): DemoPatientState {
  if (!hasWindow()) return normalizeState(seedState());
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const seeded = normalizeState(seedState());
      localStorage.setItem(KEY, JSON.stringify(seeded));
      return seeded;
    }
    return normalizeState(JSON.parse(raw));
  } catch {
    return normalizeState(seedState());
  }
}

export function writePatientState(state: DemoPatientState) {
  if (!hasWindow()) return;
  const normalized = normalizeState(state);
  localStorage.setItem(KEY, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function getPatient(slug: string): PatientProfile | null {
  return readPatientState().patients[slug] ?? null;
}

export function getActivePatient(): PatientProfile {
  const state = readPatientState();
  return state.patients[state.activeSlug] ?? state.patients["demo-001"];
}

export function getActiveSlug() {
  return readPatientState().activeSlug;
}

export function setActiveSlug(slug: string) {
  const state = readPatientState();
  if (!state.patients[slug]) return;
  writePatientState({ ...state, activeSlug: slug });
}

export function savePatient(patient: PatientProfile, makeActive = false) {
  const state = readPatientState();
  writePatientState({
    ...state,
    activeSlug: makeActive ? patient.slug : state.activeSlug,
    patients: { ...state.patients, [patient.slug]: normalizePatient(patient) },
  });
}

export function updatePatient(slug: string, updater: (patient: PatientProfile) => PatientProfile) {
  const current = getPatient(slug);
  if (!current) return null;
  const next = normalizePatient(updater(clone(current)));
  savePatient(next);
  return next;
}

export function resetPatientData() {
  if (!hasWindow()) return;
  localStorage.removeItem(KEY);
  const seeded = normalizeState(seedState());
  localStorage.setItem(KEY, JSON.stringify(seeded));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function usePatient(slug: string) {
  const fallback = seedPatients[slug] ? normalizePatient(clone(seedPatients[slug])) : null;
  const [patient, setPatient] = useState<PatientProfile | null>(fallback);

  useEffect(() => {
    const refresh = () => setPatient(getPatient(slug));
    refresh();
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [slug]);

  return patient;
}

export function useActivePatient() {
  const [slug, setSlug] = useState("demo-001");
  const patient = usePatient(slug);

  useEffect(() => {
    const refresh = () => setSlug(getActiveSlug());
    refresh();
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return patient;
}
