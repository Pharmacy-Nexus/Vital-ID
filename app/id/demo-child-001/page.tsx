"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { youssefHassan } from "@/data/demo/patients";
import EmergencyView from "@/components/emergency/EmergencyView";
import DoctorGate from "@/components/medical/DoctorGate";

export default function ChildSafetyPage() {
  const router = useRouter();
  const [showDoctor, setShowDoctor] = useState(false);

  if (showDoctor) {
    return <DoctorGate patient={youssefHassan} />;
  }

  return (
    <EmergencyView
      patient={youssefHassan}
      deviceType="bagtag"
      onRequestDoctor={() => setShowDoctor(true)}
    />
  );
}
