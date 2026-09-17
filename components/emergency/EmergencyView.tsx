"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Phone, MapPin, Stethoscope, FileText } from "lucide-react";
import type { LinkedDevice, PatientProfile } from "@/lib/types";
import { recordScan, addActivity } from "@/lib/store";
import IdentityMark from "@/components/ui/IdentityMark";
import DemoTag from "@/components/ui/DemoTag";
import { LangToggle, useLang } from "@/components/ui/LangProvider";
import SourceBadge from "@/components/ui/SourceBadge";
import ProfilePhoto from "@/components/ui/ProfilePhoto";

const fallbackDisplay = {
  basicInfo: true,
  bloodType: true,
  allergies: true,
  conditions: true,
  medications: true,
  emergencyContact: true,
  documents: false,
};

export default function EmergencyView({ patient, device, scanId, remote = false, onRequestDoctor }: { patient: PatientProfile; device?: LinkedDevice | null; scanId?: string; remote?: boolean; onRequestDoctor: () => void }) {
  const { tr } = useLang();
  const [msg, setMsg] = useState("");
  const display = device?.display ?? fallbackDisplay;

  useEffect(() => { if (!remote) recordScan(scanId ?? patient.slug); }, [patient.slug, scanId, remote]);

  const allergies = useMemo(() => patient.allergies.filter((a) => a.visibility !== "private"), [patient.allergies]);
  const conditions = useMemo(() => patient.conditions.filter((c) => c.status === "active" && c.visibility !== "private"), [patient.conditions]);
  const medications = useMemo(() => patient.medications.filter((m) => m.visibility !== "private"), [patient.medications]);
  const documents = useMemo(() => patient.documents.filter((d) => d.visibility === "emergency"), [patient.documents]);
  const contact = patient.emergencyContacts.find((c) => c.visibility !== "private");

  const share = () => {
    if (!navigator.geolocation) {
      setMsg(tr("Location is not supported on this device.", "مشاركة الموقع غير مدعومة على هذا الجهاز."));
      return;
    }
    setMsg(tr("Requesting location permission…", "جارٍ طلب إذن الموقع…"));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMsg(tr("Location shared.", "تمت مشاركة الموقع."));
        if (remote && scanId) {
          void fetch(`/api/public/id/${encodeURIComponent(scanId)}/scan`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event: "location", latitude: position.coords.latitude, longitude: position.coords.longitude }),
          }).catch(() => {});
        } else {
          addActivity({ type: "access", title: "Location shared", detail: `${scanId ?? patient.slug} · ${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)}` });
        }
      },
      () => setMsg(tr("Location permission was denied.", "تم رفض إذن الوصول للموقع.")),
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  const panel = "bg-white border border-[#d2d2d7] rounded-lg p-5";

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-28 text-[#1d1d1f]">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#d2d2d7] px-5">
        <div className="max-w-md mx-auto min-h-[52px] flex items-center justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold">VITAL ID</p>
            <p className="text-[11px] text-[#707070]">{tr("Emergency Medical ID", "الهوية الطبية للطوارئ")}{device ? ` · ${device.name}` : ""}</p>
          </div>
          <LangToggle />
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 py-7 space-y-4">
        <section className="pb-6 border-b border-[#d2d2d7]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              {display.basicInfo && patient.photoEmergencyVisible && (patient.photoUrl || patient.photoFileKey) && (
                <ProfilePhoto patient={patient} size={66} showRing={false} className="ring-1 ring-[#d2d2d7]" />
              )}
              {display.basicInfo ? (
                <div className="min-w-0">
                  <p className="text-[12px] text-[#707070] mb-1">{tr("Emergency profile", "ملف الطوارئ")}</p>
                  <h1 className="text-[32px] leading-[1.08] font-semibold tracking-[-0.03em] truncate">{patient.firstName} {patient.lastName}</h1>
                  <p className="text-[15px] text-[#707070] mt-2">{tr("Age", "العمر")} {patient.age > 0 ? patient.age : tr("Unknown", "غير معروف")}</p>
                </div>
              ) : (
                <div><h1 className="text-2xl font-semibold">VITAL ID</h1><p className="text-sm text-[#707070]">{tr("Limited emergency view", "عرض طوارئ محدود")}</p></div>
              )}
            </div>
            <IdentityMark id={scanId ?? patient.slug} className="text-[#0071e3] shrink-0" barClass="bg-[#0071e3]" />
          </div>
        </section>

        {display.allergies && (allergies.length > 0 ? allergies.map((a) => (
          <section key={a.id} className="rounded-lg border border-[#f0b8b3] bg-[#fff7f6] p-5">
            <div className="flex items-center gap-2 text-[#b42318] font-semibold text-sm"><AlertTriangle size={18} />{tr("Critical Allergy", "حساسية مهمة")}</div>
            <p className="text-[28px] leading-tight font-semibold tracking-[-0.02em] mt-2">{a.allergen}</p>
            <p className="text-sm text-[#707070] mt-2"><b className="text-[#1d1d1f]">{tr("Known reaction:", "رد الفعل المعروف:")}</b> {a.reaction}</p>
          </section>
        )) : <section className={panel}><p className="text-sm text-[#707070]">{tr("No emergency-visible allergies recorded.", "لا توجد حساسية ظاهرة في ملف الطوارئ.")}</p></section>)}

        {display.bloodType && (
          <section className={panel}>
            <p className="text-[12px] text-[#707070]">{tr("Blood type", "فصيلة الدم")}</p>
            <div className="flex items-end justify-between gap-3 mt-2">
              <p className="text-[44px] leading-none font-semibold tracking-[-0.03em]">{patient.bloodType || "—"}</p>
              <SourceBadge source={patient.bloodTypeSource ?? "patient"} />
            </div>
          </section>
        )}

        {display.conditions && (
          <section className={panel}>
            <h2 className="text-[12px] font-semibold text-[#707070] mb-3">{tr("Major conditions", "الحالات المرضية المهمة")}</h2>
            {conditions.length ? conditions.map((c, i) => <p key={c.id} className={`font-semibold py-2 ${i ? "border-t border-[#e5e5e7]" : ""}`}>{c.name}</p>) : <p className="text-sm text-[#707070]">{tr("No emergency-visible conditions recorded.", "لا توجد حالات مرضية ظاهرة للطوارئ.")}</p>}
          </section>
        )}

        {display.medications && (
          <section className={panel}>
            <h2 className="text-[12px] font-semibold text-[#707070] mb-3">{tr("Critical medication", "الأدوية المهمة")}</h2>
            {medications.length ? medications.map((m, i) => <p key={m.id} className={`font-semibold py-2 ${i ? "border-t border-[#e5e5e7]" : ""}`}>{m.name} <span className="font-normal text-[#707070] text-sm">· {m.dosage}</span></p>) : <p className="text-sm text-[#707070]">{tr("No emergency-visible medication recorded.", "لا توجد أدوية ظاهرة للطوارئ.")}</p>}
          </section>
        )}

        {display.emergencyContact && contact && (
          <section className={panel}>
            <h2 className="text-[12px] font-semibold text-[#707070] mb-2">{tr("Emergency contact", "جهة اتصال الطوارئ")}</h2>
            <p className="font-semibold">{contact.name} · {contact.relationship}</p>
            <p className="text-sm text-[#707070] mt-1">{contact.phone}</p>
          </section>
        )}

        {display.documents && (
          <section className={panel}>
            <h2 className="text-[12px] font-semibold text-[#707070] mb-3">{tr("Emergency documents", "مستندات الطوارئ")}</h2>
            {documents.length ? documents.map((d) => <div key={d.id} className="flex items-center gap-2 py-2 border-b border-[#e5e5e7] last:border-0"><FileText size={16} className="text-[#0066cc]"/><div><p className="font-semibold text-sm">{d.title}</p><p className="text-[11px] text-[#707070]">{d.date} · {d.provider}</p></div></div>) : <p className="text-sm text-[#707070]">{tr("No documents are shared with emergency viewers.", "لا توجد مستندات مسموح بعرضها في الطوارئ.")}</p>}
          </section>
        )}

        <p className="text-[11px] text-center text-[#707070] px-4">{tr(`Emergency information last confirmed: ${patient.lastConfirmation}`, `آخر تأكيد لبيانات الطوارئ: ${patient.lastConfirmation}`)}</p>
        {msg && <p className="text-sm text-center text-[#707070] bg-white rounded-lg border border-[#d2d2d7] p-3">{msg}</p>}

        <div className="flex flex-col gap-3 pt-2">
          <button onClick={onRequestDoctor} className="vital-primary w-full min-h-[48px] px-5 flex items-center justify-center gap-2"><Stethoscope size={18} />{tr("I'm a healthcare professional", "أنا مقدم رعاية صحية")}</button>
          <button onClick={share} className="vital-secondary w-full min-h-[48px] px-5 flex items-center justify-center gap-2"><MapPin size={18} />{tr("Share my location", "مشاركة موقعي")}</button>
        </div>
      </main>

      {display.emergencyContact && contact && <a href={`tel:${contact.phone}`} className="fixed bottom-4 left-4 right-4 max-w-md mx-auto min-h-[52px] vital-primary flex items-center justify-center gap-2 z-50"><Phone size={18} />{tr("Call emergency contact", "اتصال بجهة الطوارئ")}</a>}
      <DemoTag />
    </div>
  );
}
