"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { devices } from "@/data/demo/devices";
import EmergencyView from "@/components/emergency/EmergencyView";
import DoctorGate from "@/components/medical/DoctorGate";
import DemoTag from "@/components/ui/DemoTag";
import { getDeviceStatus } from "@/lib/store";
import { usePatient } from "@/lib/patientStore";
import { useLang } from "@/components/ui/LangProvider";

export default function MedicalIdPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { tr } = useLang();
  const [showDoctor, setShowDoctor] = useState(false);
  const patient = usePatient(slug);
  const device = devices.find((d) => d.slug === slug);
  const isActive = device ? getDeviceStatus(device.id) === "active" : true;

  if (!patient || !isActive) {
    return (
      <div className="min-h-screen bg-bone flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-coral/10 flex items-center justify-center mb-6"><span className="text-coral text-2xl font-bold">!</span></div>
        <h1 className="text-2xl font-bold mb-2">{!patient ? tr("Invalid Medical ID", "هوية طبية غير صالحة") : tr("This Medical ID has been disabled.", "تم تعطيل هذه الهوية الطبية.")}</h1>
        <p className="text-muted mb-8">{!patient ? tr("The link you scanned doesn't match any active profile.", "الرابط الذي تم مسحه لا يطابق ملفًا طبيًا نشطًا.") : tr("The account owner has deactivated this device. No information is available.", "قام صاحب الحساب بتعطيل هذا الجهاز، لذلك لا توجد بيانات متاحة.")}</p>
        <button onClick={() => router.push("/")} className="min-h-[48px] px-8 rounded-2xl bg-ink text-bone font-bold text-sm">{tr("Back to demo", "العودة للتجربة")}</button>
        <DemoTag />
      </div>
    );
  }

  if (showDoctor) return <DoctorGate patient={patient} />;

  return <EmergencyView patient={patient} deviceType={device?.type ?? "bracelet"} onRequestDoctor={() => setShowDoctor(true)} />;
}
