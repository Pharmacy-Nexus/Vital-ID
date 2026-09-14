"use client";

import { useRef, useState } from "react";
import { Upload, FileText, Camera } from "lucide-react";
import { useActivePatient, savePatient } from "@/lib/patientStore";
import { addActivity } from "@/lib/store";
import { useLang } from "@/components/ui/LangProvider";

export default function DocumentsPage() {
  const patient = useActivePatient();
  const { tr } = useLang();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [showExtract, setShowExtract] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleUpload = (name = "demo-lab-report.pdf") => {
    setFileName(name);
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setExtracting(true);
      setTimeout(() => {
        setExtracting(false);
        setShowExtract(true);
      }, 700);
    }, 500);
  };

  const confirmExtract = () => {
    if (!patient) return;
    const id = crypto.randomUUID();
    const docId = crypto.randomUUID();
    const next = {
      ...patient,
      labResults: [{ id, testName: "HbA1c", value: "7.2", unit: "%", status: "abnormal" as const, date: "03 Sep 2026", lab: "Example Medical Lab", documentId: docId }, ...patient.labResults],
      documents: [{ id: docId, title: fileName || "HbA1c Lab Report", date: "03 Sep 2026", provider: "Example Medical Lab" }, ...patient.documents],
    };
    savePatient(next);
    addActivity({ type: "update", title: "Document confirmed", detail: fileName || "HbA1c Lab Report" });
    setShowExtract(false);
  };

  if (!patient) return <div className="max-w-md mx-auto px-5 pt-8 text-muted">{tr("Loading documents…", "جارٍ تحميل المستندات…")}</div>;

  return (
    <div className="max-w-md mx-auto px-5 pt-6">
      <h1 className="text-2xl font-bold mb-2">{tr("Documents", "المستندات")}</h1>
      <p className="text-sm text-muted mb-6">{tr("Upload medical documents. AI extraction is simulated in this demo and nothing is saved until you confirm.", "ارفع المستندات الطبية. الاستخراج بالذكاء الاصطناعي تجريبي هنا، ولن يتم حفظ أي معلومة قبل تأكيدك.")}</p>

      <div className="bg-white rounded-2xl border-2 border-dashed border-muted/30 p-8 text-center mb-6">
        <Upload size={32} className="text-muted/50 mx-auto mb-3" />
        <p className="font-bold mb-1">{tr("Upload Medical Document", "رفع مستند طبي")}</p>
        <p className="text-xs text-muted mb-4">{tr("Lab report, radiology, prescription, or hospital report", "تحليل أو أشعة أو روشتة أو تقرير مستشفى")}</p>
        <input ref={inputRef} type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleUpload(file.name); }} />
        <div className="flex gap-2 justify-center">
          <button onClick={() => inputRef.current?.click()} disabled={uploading || extracting} className="min-h-[44px] px-5 rounded-xl bg-ink text-bone text-xs font-bold flex items-center gap-2 disabled:opacity-50">
            <Upload size={14} />{uploading ? tr("Uploading…", "جارٍ الرفع…") : extracting ? tr("Processing…", "جارٍ التحليل…") : tr("Choose file", "اختيار ملف")}
          </button>
          <button onClick={() => handleUpload("camera-capture.jpg")} disabled={uploading || extracting} className="min-h-[44px] px-5 rounded-xl border-2 border-ink text-xs font-bold flex items-center gap-2 disabled:opacity-50"><Camera size={14} /> {tr("Take photo", "التقاط صورة")}</button>
        </div>
      </div>

      {showExtract && (
        <div className="bg-lime/10 border border-lime/30 rounded-2xl p-5 mb-6">
          <p className="text-sm font-bold mb-3">{tr("We found the following information:", "تم العثور على البيانات التالية:")}</p>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm"><span className="text-muted">{tr("Test", "التحليل")}</span><span className="font-bold">HbA1c</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted">{tr("Value", "النتيجة")}</span><span className="font-bold">7.2%</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted">{tr("Date", "التاريخ")}</span><span className="font-bold">3 September 2026</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted">{tr("Laboratory", "المعمل")}</span><span className="font-bold">Example Medical Lab</span></div>
          </div>
          <div className="flex gap-2">
            <button onClick={confirmExtract} className="flex-1 min-h-[40px] rounded-xl bg-ink text-bone text-xs font-bold">{tr("CONFIRM", "تأكيد")}</button>
            <button className="flex-1 min-h-[40px] rounded-xl border-2 border-ink text-xs font-bold">{tr("EDIT", "تعديل")}</button>
            <button onClick={() => setShowExtract(false)} className="flex-1 min-h-[40px] rounded-xl text-xs font-bold text-muted">{tr("IGNORE", "تجاهل")}</button>
          </div>
          <p className="text-[10px] text-muted/60 mt-3">{tr("AI helps organize information. It does not diagnose or replace medical review.", "يساعد الذكاء الاصطناعي في تنظيم المعلومات ولا يقوم بالتشخيص ولا يستبدل المراجعة الطبية.")}</p>
        </div>
      )}

      <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted mb-3">{tr("Existing documents", "المستندات الحالية")}</h2>
      {patient.documents.length === 0 ? <div className="bg-white/50 rounded-xl border border-dashed hairline p-4 text-sm text-muted">{tr("No documents uploaded yet.", "لم يتم رفع مستندات بعد.")}</div> : patient.documents.map((doc) => (
        <div key={doc.id} className="bg-white rounded-xl p-4 border hairline mb-2 flex items-center gap-3">
          <FileText size={20} className="text-aubergine shrink-0" />
          <div className="flex-1 min-w-0"><p className="font-bold text-sm truncate">{doc.title}</p><p className="text-[11px] text-muted">{doc.date} · {doc.provider}</p></div>
        </div>
      ))}
    </div>
  );
}
