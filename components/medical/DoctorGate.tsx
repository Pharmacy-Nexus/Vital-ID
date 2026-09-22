"use client";

import { useEffect, useState } from "react";
import type { PatientProfile } from "@/lib/types";
import { getDoctorSession, startDoctorSession, endDoctorSession } from "@/lib/store";
import DoctorRecord from "./DoctorRecord";
import { LangToggle, useLang } from "@/components/ui/LangProvider";

type RemoteSession = {
  token: string;
  expiresAt: number;
  patient: PatientProfile;
};

const storageKey = (scanId: string) => `vital-id-cloud-doctor-session:${scanId}`;

export default function DoctorGate({ patient, scanId, cloudPreferred = false }: { patient: PatientProfile; scanId?: string; cloudPreferred?: boolean }) {
  const { tr } = useLang();
  const [session, setSession] = useState<ReturnType<typeof getDoctorSession>>(null);
  const [remoteSession, setRemoteSession] = useState<RemoteSession | null>(null);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [left, setLeft] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (cloudPreferred && scanId) {
      try {
        const raw = sessionStorage.getItem(storageKey(scanId));
        if (raw) {
          const saved = JSON.parse(raw) as RemoteSession;
          if (saved.expiresAt > Date.now()) setRemoteSession(saved);
          else sessionStorage.removeItem(storageKey(scanId));
        }
      } catch {}
      return;
    }
    setSession(getDoctorSession());
  }, [cloudPreferred, scanId]);

  useEffect(() => {
    const expiresAt = remoteSession?.expiresAt ?? (session?.status === "active" ? new Date(session.expiresAt).getTime() : 0);
    if (!expiresAt) return;
    const tick = () => setLeft(Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)));
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [remoteSession, session]);

  useEffect(() => {
    if (!remoteSession || !scanId) return;
    if (Date.now() < remoteSession.expiresAt) return;
    sessionStorage.removeItem(storageKey(scanId));
    setRemoteSession(null);
  }, [left, remoteSession, scanId]);

  const end = () => {
    if (remoteSession && scanId) {
      sessionStorage.removeItem(storageKey(scanId));
      setRemoteSession(null);
      setLeft(0);
      return;
    }
    endDoctorSession();
    setSession(null);
    setLeft(0);
  };

  if (remoteSession && left > 0) {
    return (
      <div>
        <div className="sticky top-0 z-50 bg-lime px-4 py-2 text-center text-xs font-bold">
          {tr("Temporary clinician access", "وصول مؤقت لمقدم الرعاية")} · {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}
          <button className="ms-3 underline" onClick={end}>{tr("End session", "إنهاء الجلسة")}</button>
        </div>
        <DoctorRecord patient={remoteSession.patient} doctorAccessToken={remoteSession.token} />
      </div>
    );
  }

  if (session?.status === "active" && left > 0) {
    return (
      <div>
        <div className="sticky top-0 z-50 bg-lime px-4 py-2 text-center text-xs font-bold">
          {tr("Temporary clinician access", "وصول مؤقت لمقدم الرعاية")} · {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}
          <button className="ms-3 underline" onClick={end}>{tr("End session", "إنهاء الجلسة")}</button>
        </div>
        <DoctorRecord patient={patient} />
      </div>
    );
  }

  const submit = async () => {
    setError("");
    setBusy(true);
    try {
      if (cloudPreferred && scanId) {
        const response = await fetch("/api/doctor/access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ qrSlug: scanId, otp }),
        });
        if (response.ok) {
          const payload = await response.json();
          const next: RemoteSession = {
            token: payload.token,
            expiresAt: Number(payload.expiresAt),
            patient: payload.patient as PatientProfile,
          };
          sessionStorage.setItem(storageKey(scanId), JSON.stringify(next));
          setRemoteSession(next);
          return;
        }
        if (response.status === 401) {
          setError(tr("Incorrect authorization code.", "رمز الدخول غير صحيح."));
          return;
        }
        if (response.status !== 503) {
          setError(tr("Cloud access could not be authorized.", "تعذر السماح بالوصول إلى السجل السحابي."));
          return;
        }
      }

      if (otp !== "4827") {
        setError(tr("Incorrect authorization code.", "رمز الدخول غير صحيح."));
        return;
      }
      setSession(startDoctorSession());
    } catch {
      setError(tr("Could not start the healthcare session.", "تعذر بدء الجلسة الطبية."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-bone flex items-center justify-center px-5">
      <div className="absolute top-5 end-5"><LangToggle /></div>
      <div className="w-full max-w-sm bg-white rounded-3xl border hairline p-6">
        <p className="text-[11px] uppercase tracking-[.2em] font-bold text-aubergine">{tr("Protected record", "سجل محمي")}</p>
        <h1 className="text-2xl font-bold mt-2">{tr("Request healthcare access", "طلب الوصول للسجل الطبي")}</h1>
        <p className="text-sm text-muted mt-2 mb-5">{tr("Enter the temporary authorization code. Access lasts 20 minutes.", "أدخل رمز الدخول المؤقت. مدة الوصول 20 دقيقة.")}</p>
        <input value={otp} onChange={(e) => setOtp(e.target.value)} inputMode="numeric" placeholder={tr("Enter OTP", "أدخل رمز التحقق")} className="w-full min-h-[52px] rounded-2xl border-2 border-ink/15 px-4 outline-none focus:border-aubergine" />
        {error && <p className="text-sm text-coral mt-2">{error}</p>}
        <button disabled={busy} onClick={() => void submit()} className="w-full min-h-[52px] rounded-2xl bg-ink text-bone font-bold mt-4 disabled:opacity-50">{busy ? tr("Authorizing…", "جارٍ التحقق…") : tr("Authorize access", "السماح بالوصول")}</button>
      </div>
    </div>
  );
}
