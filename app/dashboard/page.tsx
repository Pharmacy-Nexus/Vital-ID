"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  Activity,
  AlertTriangle,
  Camera,
  Check,
  Copy,
  ExternalLink,
  FileText,
  HeartPulse,
  Phone,
  Pill,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Watch,
} from "lucide-react";
import ProfilePhoto from "@/components/ui/ProfilePhoto";
import { deleteLocalFile, saveLocalFile } from "@/lib/fileStore";
import { getActivity } from "@/lib/store";
import { savePatient, useActivePatient } from "@/lib/patientStore";
import { useLang } from "@/components/ui/LangProvider";
import { useDevices } from "@/lib/deviceStore";

async function optimizeProfilePhoto(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("not_image");
  if (file.size > 12 * 1024 * 1024) throw new Error("too_large");

  try {
    const bitmap = await createImageBitmap(file);
    const side = Math.min(bitmap.width, bitmap.height);
    const sx = Math.max(0, (bitmap.width - side) / 2);
    const sy = Math.max(0, (bitmap.height - side) / 2);
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, 640, 640);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.86));
    if (!blob) return file;
    return new File([blob], `profile-${Date.now()}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export default function DashboardHome() {
  const patient = useActivePatient();
  const { tr } = useLang();
  const devices = useDevices();
  const photoInput = useRef<HTMLInputElement | null>(null);
  const [activity, setActivity] = useState<ReturnType<typeof getActivity>>([]);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoMessage, setPhotoMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setActivity(getActivity());
    };
    refresh();
    const timer = window.setInterval(refresh, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const patientDevices = useMemo(
    () => devices.filter((device) => patient && device.patientSlug === patient.slug),
    [devices, patient]
  );
  const primaryDevice = patientDevices.find((device) => device.status === "active") ?? patientDevices[0] ?? null;

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
    return Math.round((checks.filter((value) => value > 0).length / checks.length) * 100);
  }, [patient]);

  if (!patient) {
    return <div className="max-w-6xl mx-auto px-5 lg:px-8 pt-8 text-muted">{tr("Loading dashboard…", "جارٍ تحميل لوحة التحكم…")}</div>;
  }

  const emergencyContact = patient.emergencyContacts.find((item) => item.visibility !== "private") ?? patient.emergencyContacts[0];
  const publicAllergies = patient.allergies.filter((item) => item.visibility !== "private");
  const activeConditions = patient.conditions.filter((item) => item.status === "active");
  const qrUrl = primaryDevice && typeof window !== "undefined" ? `${window.location.origin}/id/${primaryDevice.qrSlug}` : "";

  const handlePhoto = async (file?: File) => {
    if (!file) return;
    setPhotoBusy(true);
    setPhotoMessage("");
    try {
      const optimized = await optimizeProfilePhoto(file);
      const key = await saveLocalFile(optimized, crypto.randomUUID(), patient.slug);
      const oldKey = patient.photoFileKey;
      savePatient({
        ...patient,
        photoFileKey: key,
        photoFileName: optimized.name,
        photoEmergencyVisible: patient.photoEmergencyVisible ?? false,
      });
      if (oldKey && oldKey !== key) void deleteLocalFile(oldKey).catch(() => {});
      setPhotoMessage(tr("Photo updated", "تم تحديث الصورة"));
    } catch (error) {
      setPhotoMessage(error instanceof Error && error.message === "too_large"
        ? tr("Please choose an image smaller than 12 MB.", "اختر صورة أصغر من 12 ميجابايت.")
        : tr("Could not upload this photo.", "تعذر رفع هذه الصورة."));
    } finally {
      setPhotoBusy(false);
      if (photoInput.current) photoInput.current.value = "";
    }
  };

  const toggleEmergencyPhoto = () => {
    savePatient({ ...patient, photoEmergencyVisible: !patient.photoEmergencyVisible });
  };

  const copyQr = async () => {
    if (!qrUrl) return;
    await navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-8 pt-7 lg:pt-9 pb-10">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7 border-b border-ink/15 pb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] font-bold text-aubergine">VITAL ID / {tr("OWNER HOME", "الرئيسية")}</p>
          <h1 className="text-3xl lg:text-4xl font-bold mt-2">{tr("Your medical identity", "هويتك الطبية")}</h1>
          <p className="text-sm text-muted mt-1">{tr("Everything important, one place — including the QR people see in an emergency.", "كل ما يهمك في مكان واحد، بما في ذلك QR الذي يظهر في الطوارئ.")}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/medical" className="min-h-[42px] px-4 bg-ink text-bone text-xs font-bold flex items-center justify-center gap-2"><FileText size={15} />{tr("Edit medical record", "تعديل السجل الطبي")}</Link>
          <Link href="/dashboard/devices" className="min-h-[42px] px-4 border border-ink/20 bg-white text-xs font-bold flex items-center justify-center gap-2"><Watch size={15} />{tr("Manage IDs", "إدارة الأجهزة")}</Link>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-5">
        <section className="lg:col-span-5 bg-ink text-bone p-6 lg:p-7 relative overflow-hidden min-h-[360px]">
          <div className="absolute right-0 top-0 w-32 h-32 bg-lime/10 rounded-full blur-3xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative">
                <ProfilePhoto patient={patient} size={92} showRing={false} className="ring-1 ring-bone/20" />
                <button
                  onClick={() => photoInput.current?.click()}
                  disabled={photoBusy}
                  className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-lime text-ink flex items-center justify-center border-4 border-ink disabled:opacity-60"
                  aria-label={tr("Change photo", "تغيير الصورة")}
                >
                  <Camera size={16} />
                </button>
                <input ref={photoInput} type="file" accept="image/*" className="hidden" onChange={(e) => void handlePhoto(e.target.files?.[0])} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[.18em] text-lime font-bold">{tr("Medical identity active", "الهوية الطبية مفعلة")}</p>
                <h2 className="text-2xl font-bold mt-1 truncate">{patient.firstName} {patient.lastName}</h2>
                <p className="text-sm text-bone/55 mt-1">{tr("Age", "العمر")} {patient.age || "—"} · {tr("Blood type", "فصيلة الدم")} {patient.bloodType || "—"}</p>
              </div>
            </div>
            <ShieldCheck className="text-lime shrink-0" size={28} />
          </div>

          {photoMessage && <p className="mt-4 text-xs text-lime">{photoMessage}</p>}

          <div className="mt-7 grid grid-cols-2 gap-px bg-bone/15 border border-bone/15">
            <div className="bg-ink p-4"><p className="text-[10px] uppercase tracking-wider text-bone/45">{tr("Emergency profile", "ملف الطوارئ")}</p><p className="text-2xl font-bold mt-1 text-lime">{emergencyCompleteness}%</p></div>
            <div className="bg-ink p-4"><p className="text-[10px] uppercase tracking-wider text-bone/45">{tr("Full record", "السجل الكامل")}</p><p className="text-2xl font-bold mt-1">{recordCompleteness}%</p></div>
          </div>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4"><span className="text-bone/50">{tr("Emergency contact", "جهة اتصال الطوارئ")}</span><span className="font-semibold text-right">{emergencyContact ? `${emergencyContact.name} · ${emergencyContact.phone}` : tr("Not added", "غير مضافة")}</span></div>
            <div className="flex items-center justify-between gap-4"><span className="text-bone/50">{tr("Linked IDs", "الأجهزة المرتبطة")}</span><span className="font-semibold">{patientDevices.length}</span></div>
            <div className="flex items-center justify-between gap-4"><span className="text-bone/50">{tr("Last confirmation", "آخر تأكيد")}</span><span className="font-semibold">{patient.lastConfirmation}</span></div>
          </div>

          {patient.photoFileKey && (
            <label className="mt-6 flex items-center justify-between gap-4 border-t border-bone/15 pt-4 cursor-pointer">
              <span><span className="block text-xs font-bold">{tr("Show photo in Emergency ID", "إظهار الصورة في هوية الطوارئ")}</span><span className="block text-[10px] text-bone/45 mt-1">{tr("Useful for identifying a child or patient. You control this.", "مفيد للتعرف على الطفل أو المريض، ويمكنك التحكم فيه.")}</span></span>
              <input type="checkbox" checked={Boolean(patient.photoEmergencyVisible)} onChange={toggleEmergencyPhoto} className="w-5 h-5 accent-[#B6E36E]" />
            </label>
          )}
        </section>

        <section className="lg:col-span-7 bg-white border border-ink/10 p-6 lg:p-7 min-h-[360px]">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="text-[10px] uppercase tracking-[.2em] font-bold text-aubergine">{tr("LIVE EMERGENCY ID", "هوية الطوارئ المباشرة")}</p>
              <h2 className="text-2xl font-bold mt-1">{primaryDevice ? primaryDevice.name : tr("No active ID yet", "لا توجد هوية مفعلة")}</h2>
              <p className="text-sm text-muted mt-1">{tr("This is the QR another phone can scan to see the information you allow.", "هذا هو QR الذي يمكن لأي هاتف مسحه لعرض المعلومات التي تسمح بها.")}</p>
            </div>
            {primaryDevice && <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 ${primaryDevice.status === "active" ? "bg-lime/20" : "bg-coral/10 text-coral"}`}>{primaryDevice.status === "active" ? tr("Active", "نشط") : tr("Disabled", "معطل")}</span>}
          </div>

          {primaryDevice && qrUrl ? (
            <div className="grid md:grid-cols-[240px_1fr] gap-6 items-center">
              <div className="border border-ink/15 bg-bone p-5 flex items-center justify-center">
                <QRCodeSVG value={qrUrl} size={200} fgColor="#16171B" bgColor="#F5F1E8" />
              </div>
              <div className="space-y-4">
                <div className="border-t border-ink/15 pt-3"><p className="text-[10px] uppercase tracking-wider text-muted font-bold">{tr("Unique QR", "QR مستقل")}</p><p className="text-xs font-mono break-all mt-1">/id/{primaryDevice.qrSlug}</p></div>
                <div className="border-t border-ink/15 pt-3"><p className="text-[10px] uppercase tracking-wider text-muted font-bold">{tr("Public sections", "الأقسام العامة")}</p><p className="text-sm font-semibold mt-1">{Object.values(primaryDevice.display).filter(Boolean).length} {tr("enabled", "مفعلة")}</p></div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button onClick={copyQr} className="min-h-[40px] px-4 border border-ink text-xs font-bold flex items-center gap-2">{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? tr("Copied", "تم النسخ") : tr("Copy link", "نسخ الرابط")}</button>
                  <a href={qrUrl} target="_blank" rel="noreferrer" className="min-h-[40px] px-4 bg-ink text-bone text-xs font-bold flex items-center gap-2"><ExternalLink size={14} />{tr("Open Emergency ID", "فتح هوية الطوارئ")}</a>
                  <Link href="/dashboard/devices" className="min-h-[40px] px-4 bg-lime text-ink text-xs font-bold flex items-center gap-2"><Watch size={14} />{tr("Customize QR", "تخصيص QR")}</Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-ink/20 bg-bone p-8 text-center">
              <Watch size={32} className="mx-auto text-muted/50 mb-3" />
              <p className="font-bold">{tr("Create a card or wristband ID to get a unique QR.", "أنشئ بطاقة أو سوارًا للحصول على QR مستقل.")}</p>
              <Link href="/dashboard/devices" className="inline-flex mt-4 min-h-[40px] px-4 bg-ink text-bone text-xs font-bold items-center">{tr("Create Medical ID", "إنشاء هوية طبية")}</Link>
            </div>
          )}
        </section>
      </div>

      <section className="grid md:grid-cols-3 gap-px bg-ink/10 border border-ink/10 mt-5">
        <Link href="/dashboard/medical" className="bg-white p-5 hover:bg-lime/10 transition-colors"><AlertTriangle size={19} className="text-coral"/><p className="text-[10px] uppercase tracking-wider text-muted font-bold mt-4">{tr("Allergies", "الحساسية")}</p><p className="text-xl font-bold mt-1">{publicAllergies.length ? publicAllergies.map((a) => a.allergen).slice(0, 2).join(" · ") : tr("None added", "لا يوجد")}</p></Link>
        <Link href="/dashboard/medical" className="bg-white p-5 hover:bg-lime/10 transition-colors"><HeartPulse size={19} className="text-aubergine"/><p className="text-[10px] uppercase tracking-wider text-muted font-bold mt-4">{tr("Active conditions", "الحالات النشطة")}</p><p className="text-xl font-bold mt-1">{activeConditions.length ? activeConditions.map((c) => c.name).slice(0, 2).join(" · ") : tr("None added", "لا يوجد")}</p></Link>
        <Link href="/dashboard/medical" className="bg-white p-5 hover:bg-lime/10 transition-colors"><Pill size={19}/><p className="text-[10px] uppercase tracking-wider text-muted font-bold mt-4">{tr("Medications", "الأدوية")}</p><p className="text-xl font-bold mt-1">{patient.medications.length ? patient.medications.slice(0, 2).map((m) => m.name).join(" · ") : tr("None added", "لا يوجد")}</p></Link>
      </section>

      <div className="grid lg:grid-cols-12 gap-5 mt-5">
        <section className="lg:col-span-8 bg-white border border-ink/10 p-6">
          <div className="flex items-center justify-between mb-5">
            <div><p className="text-[10px] uppercase tracking-[.2em] font-bold text-aubergine">{tr("ACTIVITY", "النشاط")}</p><h2 className="text-xl font-bold mt-1">{tr("Recent events", "آخر الأحداث")}</h2></div>
            <Link href="/dashboard/activity" className="text-xs font-bold underline underline-offset-4">{tr("View all", "عرض الكل")}</Link>
          </div>
          {activity.length === 0 ? (
            <div className="border border-dashed border-ink/15 p-6 text-center"><Activity size={24} className="text-muted/40 mx-auto mb-2"/><p className="text-sm text-muted">{tr("No activity yet. Scan your ID to see events here.", "لا يوجد نشاط بعد. امسح الهوية لرؤية الأحداث هنا.")}</p></div>
          ) : (
            <div className="divide-y divide-ink/10">
              {activity.slice(0, 5).map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-lime shrink-0" />
                  <div className="flex-1 min-w-0"><p className="text-sm font-bold truncate">{item.title}</p><p className="text-[11px] text-muted truncate">{item.detail}</p></div>
                  <span className="text-[11px] text-muted shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="lg:col-span-4 border border-ink/10 bg-[#efebe1] p-6">
          <p className="text-[10px] uppercase tracking-[.2em] font-bold text-aubergine">{tr("QUICK STATUS", "الحالة السريعة")}</p>
          <div className="mt-5 space-y-5">
            <div className="flex items-start gap-3"><Stethoscope size={19} className="text-aubergine shrink-0"/><div><p className="font-bold text-sm">{tr("Doctor access", "وصول الطبيب")}</p><p className="text-xs text-muted mt-1">{tr("Temporary access is available from the Emergency ID.", "الوصول المؤقت متاح من هوية الطوارئ.")}</p></div></div>
            <div className="flex items-start gap-3"><Phone size={19} className="text-coral shrink-0"/><div><p className="font-bold text-sm">{tr("Emergency contact", "جهة اتصال الطوارئ")}</p><p className="text-xs text-muted mt-1">{emergencyContact ? emergencyContact.phone : tr("Add one from Medical Record", "أضف جهة اتصال من السجل الطبي")}</p></div></div>
            <div className="flex items-start gap-3"><UserRound size={19} className="shrink-0"/><div><p className="font-bold text-sm">{tr("Profile photo", "صورة الملف")}</p><p className="text-xs text-muted mt-1">{patient.photoFileKey ? tr("Added", "مضافة") : tr("Not added yet", "لم تتم إضافتها")}</p></div></div>
            <div className="flex items-start gap-3"><ShieldCheck size={19} className="text-lime shrink-0"/><div><p className="font-bold text-sm">{tr("QR scans", "مرات فتح QR")}</p><p className="text-xs text-muted mt-1">{activity.filter((item) => item.type === "scan").length} {tr("recorded in activity", "مسجلة في سجل النشاط")}</p></div></div>
          </div>
        </section>
      </div>
    </div>
  );
}
