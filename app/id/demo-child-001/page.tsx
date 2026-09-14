"use client";

import { useState } from "react";
import EmergencyView from "@/components/emergency/EmergencyView";
import DoctorGate from "@/components/medical/DoctorGate";
import { usePatient } from "@/lib/patientStore";

export default function ChildSafetyPage() {
  const [showDoctor, setShowDoctor] = useState(false);
  const patient = usePatient("demo-child-001");
  if (!patient) return null;
  if (showDoctor) return <DoctorGate patient={patient} />;
  return <EmergencyView patient={patient} deviceType="bagtag" onRequestDoctor={() => setShowDoctor(true)} />;
}
