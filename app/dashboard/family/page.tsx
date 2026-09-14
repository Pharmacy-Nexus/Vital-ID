"use client";

import Link from "next/link";
import { useLang } from "@/components/ui/LangProvider";
import { usePatient } from "@/lib/patientStore";

export default function FamilyPage() {
  const { tr } = useLang();
  const child = usePatient("demo-child-001");
  return (
    <div className="max-w-md mx-auto px-5 pt-6">
      <h1 className="text-2xl font-bold mb-2">{tr("Family", "العائلة")}</h1>
      <p className="text-sm text-muted mb-6">{tr("Manage medical identities for people you care for.", "إدارة الهويات الطبية للأشخاص الذين ترعاهم.")}</p>
      {child && <Link href="/id/qr-child-bag-demo-001" className="block bg-white rounded-2xl p-5 border hairline"><p className="font-bold">{child.firstName} {child.lastName}</p><p className="text-xs text-muted mt-1">{tr("Child profile · Guardian managed", "ملف طفل · تحت إدارة ولي الأمر")}</p></Link>}
    </div>
  );
}
