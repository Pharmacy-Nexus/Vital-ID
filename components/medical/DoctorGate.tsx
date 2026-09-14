"use client";

import { useEffect, useState } from "react";
import type { PatientProfile } from "@/lib/types";
import { getDoctorSession, startDoctorSession, endDoctorSession } from "@/lib/store";
import DoctorRecord from "./DoctorRecord";
import { LangToggle, useLang } from "@/components/ui/LangProvider";

export default function DoctorGate({ patient }: { patient: PatientProfile }) {
  const { tr } = useLang();
  const [session, setSession] = useState<ReturnType<typeof getDoctorSession>>(null);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [left, setLeft] = useState(0);

  useEffect(() => { setSession(getDoctorSession()); }, []);
  useEffect(() => {
    if (!session || session.status !== "active") return;
    const tick = () => setLeft(Math.max(0, Math.ceil((new Date(session.expiresAt).getTime() - Date.now()) / 1000)));
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [session]);

  if (session?.status === "active" && left > 0) {
    return (
      <div>
        <div className="sticky top-0 z-50 bg-lime px-4 py-2 text-center text-xs font-bold">
          {tr("Temporary clinician access", "وصول مؤقت لمقدم الرعاية")} · {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}
          <button className="ms-3 underline" onClick={() => { endDoctorSession(); setSession(null); }}>{tr("End session", "إنهاء الجلسة")}</button>
        </div>
        <DoctorRecord patient={patient} />
      </div>
    );
  }

  const submit = () => {
    if (otp !== "4827") {
      setError(tr("Incorrect demo code. Use 4827.", "رمز التجربة غير صحيح. استخدم 4827."));
      return;
    }
    setError("");
    setSession(startDoctorSession());
  };

  return (
    <div className="min-h-screen bg-bone flex items-center justify-center px-5">
      <div className="absolute top-5 end-5"><LangToggle /></div>
      <div className="w-full max-w-sm bg-white rounded-3xl border hairline p-6">
        <p className="text-[11px] uppercase tracking-[.2em] font-bold text-aubergine">{tr("Protected record", "سجل محمي")}</p>
        <h1 className="text-2xl font-bold mt-2">{tr("Request healthcare access", "طلب الوصول للسجل الطبي")}</h1>
        <p className="text-sm text-muted mt-2 mb-5">{tr("Demo authorization code:", "رمز الدخول التجريبي:")} <b>4827</b>. {tr("Access lasts 20 minutes.", "مدة الوصول 20 دقيقة.")}</p>
        <input value={otp} onChange={(e) => setOtp(e.target.value)} inputMode="numeric" placeholder={tr("Enter OTP", "أدخل رمز التحقق")} className="w-full min-h-[52px] rounded-2xl border-2 border-ink/15 px-4 outline-none focus:border-aubergine" />
        {error && <p className="text-sm text-coral mt-2">{error}</p>}
        <button onClick={submit} className="w-full min-h-[52px] rounded-2xl bg-ink text-bone font-bold mt-4">{tr("Authorize access", "السماح بالوصول")}</button>
      </div>
    </div>
  );
}
