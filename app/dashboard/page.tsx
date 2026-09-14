"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Clock, Activity } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import IdentityMark from "@/components/ui/IdentityMark";
import { getActivity, getScans } from "@/lib/store";
import { useActivePatient } from "@/lib/patientStore";
import { useLang } from "@/components/ui/LangProvider";
import { useDevices } from "@/lib/deviceStore";

export default function DashboardHome() {
  const patient = useActivePatient();
  const { tr } = useLang();
  const devices = useDevices();
  const [activity, setActivity] = useState<ReturnType<typeof getActivity>>([]);
  const [scans, setScans] = useState<ReturnType<typeof getScans>>([]);

  useEffect(() => {
    setActivity(getActivity());
    setScans(getScans());
  }, []);

  const emergencyCompleteness = useMemo(() => {
    if (!patient) return 0;
    const checks = [
      Boolean(patient.firstName && patient.lastName),
      Boolean(patient.bloodType),
      patient.emergencyContacts.some((x) => x.visibility !== "private"),
      patient.allergies.some((x) => x.visibility !== "private") || patient.conditions.some((x) => x.visibility !== "private") || patient.medications.some((x) => x.visibility !== "private"),
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [patient]);

  const recordCompleteness = useMemo(() => {
    if (!patient) return 0;
    const checks = [patient.conditions.length, patient.medications.length, patient.allergies.length, patient.surgeries.length, patient.vaccinations.length, patient.documents.length, patient.emergencyContacts.length];
    const nonEmpty = checks.filter((v) => v > 0).length;
    return Math.round((nonEmpty / checks.length) * 100);
  }, [patient]);

  if (!patient) return <div className="max-w-md mx-auto px-5 pt-8 text-muted">{tr("Loading dashboard…", "جارٍ تحميل لوحة التحكم…")}</div>;

  return (
    <div className="max-w-md mx-auto px-5 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={`${patient.firstName} ${patient.lastName}`} color={patient.photoColor} size={52} />
          <div className="min-w-0">
            <h1 className="text-xl font-bold truncate">{patient.firstName} {patient.lastName}</h1>
            <p className="text-xs text-muted">{tr("Medical ID Active", "الهوية الطبية مفعّلة")}</p>
          </div>
        </div>
        <IdentityMark id={patient.slug} className="text-ink/60" barClass="bg-ink/60" />
      </div>

      <div className="space-y-3 mb-6">
        <div className="bg-white rounded-2xl p-5 border hairline">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold">{tr("Emergency Profile", "ملف الطوارئ")}</span>
            <span className="text-lg font-bold text-lime">{emergencyCompleteness}%</span>
          </div>
          <div className="h-2 bg-surface rounded-full overflow-hidden"><div className="h-full bg-lime rounded-full" style={{ width: `${emergencyCompleteness}%` }} /></div>
          <p className="text-[11px] text-muted mt-2">{emergencyCompleteness === 100 ? tr("Complete", "مكتمل") : tr("Complete the missing emergency details", "أكمل بيانات الطوارئ الناقصة")}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border hairline">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold">{tr("Full Medical Record", "السجل الطبي الكامل")}</span>
            <span className="text-lg font-bold text-aubergine">{recordCompleteness}%</span>
          </div>
          <div className="h-2 bg-surface rounded-full overflow-hidden"><div className="h-full bg-aubergine rounded-full" style={{ width: `${recordCompleteness}%` }} /></div>
          <Link href="/dashboard/medical" className="text-[11px] font-bold text-aubergine mt-2 inline-block">{tr("Edit medical record →", "تعديل السجل الطبي ←")}</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-ink text-bone rounded-2xl p-4">
          <Clock size={18} className="text-lime mb-2" />
          <p className="text-2xl font-bold">{patient.lastConfirmation}</p>
          <p className="text-[11px] text-bone/50">{tr("Last medical confirmation", "آخر تأكيد للبيانات")}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border hairline">
          <ShieldCheck size={18} className="text-aubergine mb-2" />
          <p className="text-2xl font-bold">{devices.filter((d) => d.patientSlug === patient.slug).length}</p>
          <p className="text-[11px] text-muted">{tr("Linked IDs", "الأجهزة المرتبطة")}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold">{tr("Recent activity", "آخر الأنشطة")}</h2>
          <Link href="/dashboard/activity" className="text-xs font-bold text-aubergine">{tr("View all", "عرض الكل")}</Link>
        </div>
        {activity.length === 0 ? (
          <div className="bg-white rounded-2xl p-5 border hairline text-center">
            <Activity size={24} className="text-muted/40 mx-auto mb-2" />
            <p className="text-sm text-muted">{tr("No activity yet. Scan your Medical ID to see events here.", "لا يوجد نشاط بعد. امسح الهوية الطبية لرؤية الأحداث هنا.")}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activity.slice(0, 3).map((a) => (
              <div key={a.id} className="bg-white rounded-xl p-4 border hairline flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-lime shrink-0" />
                <div className="flex-1 min-w-0"><p className="text-sm font-bold truncate">{a.title}</p><p className="text-[11px] text-muted">{a.detail}</p></div>
                <span className="text-[11px] text-muted shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {scans.length > 0 && (
        <div className="bg-lime/10 border border-lime/30 rounded-2xl p-4 flex items-center gap-3">
          <ShieldCheck size={20} className="text-ink shrink-0" />
          <p className="text-sm font-bold">{tr(`Medical ID scanned ${scans.length} time${scans.length > 1 ? "s" : ""}`, `تم فتح الهوية الطبية ${scans.length} مرة`)}</p>
        </div>
      )}
    </div>
  );
}
