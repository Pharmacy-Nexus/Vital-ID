"use client";

import Link from "next/link";
import { QrCode, Eye, Lock, Key, FileText, X, Smartphone, History, Baby, RotateCcw } from "lucide-react";
import { resetDemo } from "@/lib/store";
import { useLang } from "@/components/ui/LangProvider";
import { resetDevices } from "@/lib/deviceStore";
import { clearLocalFiles } from "@/lib/fileStore";

export default function DemoPage() {
  const { tr } = useLang();
  const steps = [
    { icon: QrCode, title: tr("Scan QR", "امسح QR"), desc: tr("Use another phone to scan the demo QR code on the homepage.", "استخدم هاتفًا آخر لمسح رمز QR التجريبي من الصفحة الرئيسية.") },
    { icon: Eye, title: tr("See emergency information", "اعرض بيانات الطوارئ"), desc: tr("Emergency-visible allergies, conditions and medications appear instantly.", "تظهر الحساسية والحالات والأدوية المحددة للطوارئ فورًا.") },
    { icon: Lock, title: tr("Request protected record", "اطلب السجل المحمي"), desc: tr("Tap 'I'm a Healthcare Professional'.", "اضغط أنا مقدم رعاية صحية.") },
    { icon: Key, title: tr("Use OTP 4827", "استخدم الرمز 4827"), desc: tr("Enter the demo authorization code.", "أدخل رمز الدخول التجريبي.") },
    { icon: FileText, title: tr("View full medical history", "اعرض السجل الطبي الكامل"), desc: tr("The doctor view uses the same patient data.", "واجهة الطبيب تستخدم نفس بيانات المريض.") },
    { icon: X, title: tr("End session", "أنهِ الجلسة"), desc: tr("Temporary access expires after 20 minutes or manually.", "ينتهي الوصول بعد 20 دقيقة أو عند إنهائه يدويًا.") },
    { icon: Smartphone, title: tr("Open patient dashboard", "افتح لوحة المريض"), desc: tr("Edit the same medical profile at any time.", "عدّل نفس الملف الطبي في أي وقت.") },
    { icon: History, title: tr("View scan history", "اعرض سجل المسح"), desc: tr("Check the activity log for scan and access events.", "راجع سجل النشاط للمسح وعمليات الوصول.") },
    { icon: Baby, title: tr("Try child safety mode", "جرّب وضع الطفل"), desc: tr("Open the child profile for the guardian experience.", "افتح ملف الطفل لتجربة ولي الأمر.") },
  ];

  return <div className="min-h-screen bg-bone max-w-md mx-auto px-5 pt-6 pb-12"><h1 className="text-2xl font-bold mb-2">{tr("Presentation Guide", "دليل العرض")}</h1><p className="text-sm text-muted mb-8">{tr("Follow these steps to demonstrate the product flow.", "اتبع هذه الخطوات لعرض تدفق المنتج.")}</p><div className="space-y-3 mb-8">{steps.map((step, i) => <div key={i} className="bg-white rounded-xl p-4 border hairline flex items-start gap-4"><div className="w-8 h-8 rounded-full bg-ink text-lime flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</div><div><p className="font-bold text-sm">{step.title}</p><p className="text-xs text-muted mt-0.5 leading-relaxed">{step.desc}</p></div></div>)}</div><div className="space-y-3"><Link href="/"><button className="w-full min-h-[48px] rounded-2xl bg-ink text-bone font-bold text-sm">{tr("Back to demo start", "العودة لبداية التجربة")}</button></Link><button onClick={async () => { resetDemo(); resetDevices(); await clearLocalFiles(); alert(tr("Demo data reset.", "تمت إعادة البيانات التجريبية.")); }} className="w-full min-h-[48px] rounded-2xl border-2 border-ink font-bold text-sm flex items-center justify-center gap-2"><RotateCcw size={16} /> {tr("Reset demo data", "إعادة بيانات التجربة")}</button></div></div>;
}
