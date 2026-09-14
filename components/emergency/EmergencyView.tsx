"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Phone, MapPin, Stethoscope, FileText } from "lucide-react";
import type { LinkedDevice, PatientProfile } from "@/lib/types";
import { recordScan, addActivity } from "@/lib/store";
import IdentityMark from "@/components/ui/IdentityMark";
import DemoTag from "@/components/ui/DemoTag";
import { LangToggle, useLang } from "@/components/ui/LangProvider";
import SourceBadge from "@/components/ui/SourceBadge";

const fallbackDisplay = {
  basicInfo: true,
  bloodType: true,
  allergies: true,
  conditions: true,
  medications: true,
  emergencyContact: true,
  documents: false,
};

export default function EmergencyView({ patient, device, scanId, onRequestDoctor }: { patient: PatientProfile; device?: LinkedDevice | null; scanId?: string; onRequestDoctor: () => void }) {
  const { tr } = useLang();
  const [msg, setMsg] = useState("");
  const display = device?.display ?? fallbackDisplay;

  useEffect(() => { recordScan(scanId ?? patient.slug); }, [patient.slug, scanId]);

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
        setMsg(tr("Location shared in demo.", "تمت مشاركة الموقع في النسخة التجريبية."));
        addActivity({ type: "access", title: "Location shared", detail: `${scanId ?? patient.slug} · ${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)}` });
      },
      () => setMsg(tr("Location permission was denied.", "تم رفض إذن الوصول للموقع.")),
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  return (
    <div className="min-h-screen bg-bone pb-28">
      <header className="bg-ink text-bone px-5 py-5">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] tracking-[.22em] uppercase text-lime font-bold">{tr("Emergency Medical ID", "الهوية الطبية للطوارئ")}</p>
              {device && <p className="text-[10px] text-bone/40 mt-1">{device.name}</p>}
            </div>
            <LangToggle className="text-bone" />
          </div>
          <div className="flex items-start justify-between gap-3">
            {display.basicInfo ? <div><h1 className="text-2xl font-bold">{patient.firstName} {patient.lastName}</h1><p className="text-sm text-bone/60 mt-1">{tr("Age", "العمر")} {patient.age > 0 ? patient.age : tr("Unknown", "غير معروف")}</p></div> : <div><h1 className="text-xl font-bold">VITAL ID</h1><p className="text-sm text-bone/50">{tr("Limited emergency view", "عرض طوارئ محدود")}</p></div>}
            <IdentityMark id={scanId ?? patient.slug} className="text-lime" barClass="bg-lime" />
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 py-5 space-y-4">
        {display.bloodType && <section className="bg-lime/20 rounded-2xl p-5 border border-lime/40"><p className="text-[10px] uppercase tracking-[.18em] font-bold text-muted">{tr("Blood type", "فصيلة الدم")}</p><div className="flex items-end justify-between gap-3 mt-1"><p className="text-4xl font-bold">{patient.bloodType || "—"}</p><SourceBadge source={patient.bloodTypeSource ?? "patient"} /></div></section>}

        {display.allergies && (allergies.length > 0 ? allergies.map((a) => <section key={a.id} className="rounded-2xl border border-coral/30 bg-coral/10 p-5"><div className="flex items-center gap-2 text-coral font-bold text-sm"><AlertTriangle size={18} />{tr("Critical Allergy", "حساسية مهمة")}</div><p className="text-2xl font-bold mt-2">{a.allergen}</p><p className="text-sm text-muted mt-1"><b>{tr("Known reaction:", "رد الفعل المعروف:")}</b> {a.reaction}</p></section>) : <section className="rounded-2xl border hairline bg-white p-5"><p className="text-sm text-muted">{tr("No emergency-visible allergies recorded.", "لا توجد حساسية ظاهرة في ملف الطوارئ.")}</p></section>)}

        {display.conditions && <section className="bg-white rounded-2xl p-5 border hairline"><h2 className="text-xs uppercase tracking-wider font-bold text-muted mb-3">{tr("Major conditions", "الحالات المرضية المهمة")}</h2>{conditions.length ? conditions.map((c) => <p key={c.id} className="font-bold py-1">{c.name}</p>) : <p className="text-sm text-muted">{tr("No emergency-visible conditions recorded.", "لا توجد حالات مرضية ظاهرة للطوارئ.")}</p>}</section>}

        {display.medications && <section className="bg-white rounded-2xl p-5 border hairline"><h2 className="text-xs uppercase tracking-wider font-bold text-muted mb-3">{tr("Critical medication", "الأدوية المهمة")}</h2>{medications.length ? medications.map((m) => <p key={m.id} className="font-bold py-1">{m.name} <span className="font-normal text-muted text-sm">· {m.dosage}</span></p>) : <p className="text-sm text-muted">{tr("No emergency-visible medication recorded.", "لا توجد أدوية ظاهرة للطوارئ.")}</p>}</section>}

        {display.emergencyContact && contact && <section className="bg-white rounded-2xl p-5 border hairline"><h2 className="text-xs uppercase tracking-wider font-bold text-muted mb-2">{tr("Emergency contact", "جهة اتصال الطوارئ")}</h2><p className="font-bold">{contact.name} · {contact.relationship}</p><p className="text-sm text-muted">{contact.phone}</p></section>}

        {display.documents && <section className="bg-white rounded-2xl p-5 border hairline"><h2 className="text-xs uppercase tracking-wider font-bold text-muted mb-3">{tr("Emergency documents", "مستندات الطوارئ")}</h2>{documents.length ? documents.map((d) => <div key={d.id} className="flex items-center gap-2 py-2 border-b hairline last:border-0"><FileText size={16} className="text-aubergine"/><div><p className="font-bold text-sm">{d.title}</p><p className="text-[11px] text-muted">{d.date} · {d.provider}</p></div></div>) : <p className="text-sm text-muted">{tr("No documents are shared with emergency viewers.", "لا توجد مستندات مسموح بعرضها في الطوارئ.")}</p>}</section>}

        <p className="text-[11px] text-center text-muted">{tr(`Emergency information last confirmed: ${patient.lastConfirmation}`, `آخر تأكيد لبيانات الطوارئ: ${patient.lastConfirmation}`)}</p>
        {msg && <p className="text-sm text-center text-muted bg-white rounded-xl border hairline p-3">{msg}</p>}

        <button onClick={share} className="w-full min-h-[48px] rounded-2xl border-2 border-ink font-bold flex items-center justify-center gap-2"><MapPin size={18} />{tr("Share my location", "مشاركة موقعي")}</button>
        <button onClick={onRequestDoctor} className="w-full min-h-[48px] rounded-2xl bg-aubergine text-white font-bold flex items-center justify-center gap-2"><Stethoscope size={18} />{tr("I'm a healthcare professional", "أنا مقدم رعاية صحية")}</button>
      </main>

      {display.emergencyContact && contact && <a href={`tel:${contact.phone}`} className="fixed bottom-4 left-4 right-4 max-w-md mx-auto min-h-[52px] rounded-2xl bg-coral text-white font-bold flex items-center justify-center gap-2 shadow-lg"><Phone size={18} />{tr("Call emergency contact", "اتصال بجهة الطوارئ")}</a>}
      <DemoTag />
    </div>
  );
}
