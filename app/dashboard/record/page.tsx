"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Camera,
  Clock3,
  FileText,
  FolderOpen,
  HeartPulse,
  Image as ImageIcon,
  Pill,
  Plus,
  Stethoscope,
  Trash2,
  Upload,
  Eye,
  Syringe,
  ScanLine,
} from "lucide-react";
import { useActivePatient, savePatient } from "@/lib/patientStore";
import { useLang } from "@/components/ui/LangProvider";
import { buildMedicalTimeline } from "@/lib/timeline";
import { addActivity } from "@/lib/store";
import { deleteLocalFile, saveLocalFile } from "@/lib/fileStore";
import DocumentViewer from "@/components/documents/DocumentViewer";
import type { DocumentCategory, PatientDocument } from "@/lib/types";

const today = () => new Date().toISOString().slice(0, 10);
type Tab = "summary" | "timeline" | "files";

const categories: Array<{ value: DocumentCategory; en: string; ar: string }> = [
  { value: "lab", en: "Lab", ar: "تحاليل" },
  { value: "radiology", en: "Radiology", ar: "أشعة" },
  { value: "prescription", en: "Prescription", ar: "روشتة" },
  { value: "discharge", en: "Discharge", ar: "خروج / مستشفى" },
  { value: "surgery", en: "Surgery", ar: "عملية" },
  { value: "vaccination", en: "Vaccination", ar: "تطعيم" },
  { value: "visit", en: "Visit note", ar: "زيارة طبيب" },
  { value: "other", en: "Other", ar: "أخرى" },
];

function timelineIcon(category: string) {
  if (category === "allergy") return AlertTriangle;
  if (category === "medication") return Pill;
  if (category === "condition") return HeartPulse;
  if (category === "lab") return FileText;
  if (category === "radiology") return ScanLine;
  if (category === "vaccination") return Syringe;
  if (category === "document") return FolderOpen;
  return Stethoscope;
}

export default function RecordPage() {
  const patient = useActivePatient();
  const { tr } = useLang();
  const params = useSearchParams();
  const requested = params.get("tab");
  const [tab, setTab] = useState<Tab>(requested === "timeline" || requested === "files" ? requested : "summary");
  const fileInput = useRef<HTMLInputElement | null>(null);
  const cameraInput = useRef<HTMLInputElement | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");
  const [date, setDate] = useState(today());
  const [category, setCategory] = useState<DocumentCategory>("other");
  const [saving, setSaving] = useState(false);
  const [viewer, setViewer] = useState<PatientDocument | null>(null);
  const [filter, setFilter] = useState<DocumentCategory | "all">("all");

  useEffect(() => {
    const value = params.get("tab");
    if (value === "summary" || value === "timeline" || value === "files") setTab(value);
  }, [params]);

  useEffect(() => {
    if (params.get("add") === "1" && tab === "files") window.setTimeout(() => fileInput.current?.click(), 250);
  }, [params, tab]);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const timeline = useMemo(() => patient ? buildMedicalTimeline(patient) : [], [patient]);
  const filteredDocuments = useMemo(() => {
    if (!patient) return [];
    return filter === "all" ? patient.documents : patient.documents.filter((doc) => (doc.category ?? "other") === filter);
  }, [patient, filter]);

  if (!patient) return <div className="max-w-5xl mx-auto px-5 lg:px-8 pt-8 text-[#707070]">{tr("Loading record…", "جارٍ تحميل السجل…")}</div>;

  const choose = (file: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(file);
    setPreviewUrl(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
    setTitle(file.name.replace(/\.[^.]+$/, ""));
    setProvider("");
    setDate(today());
    setCategory("other");
    setTab("files");
  };

  const resetUpload = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPendingFile(null);
    setTitle("");
    setProvider("");
    setDate(today());
    setCategory("other");
    if (fileInput.current) fileInput.current.value = "";
    if (cameraInput.current) cameraInput.current.value = "";
  };

  const saveDocument = async () => {
    if (!pendingFile) return;
    setSaving(true);
    try {
      const id = crypto.randomUUID();
      const fileKey = await saveLocalFile(pendingFile, id, patient.slug);
      const doc: PatientDocument = {
        id,
        title: title.trim() || pendingFile.name,
        date: date || today(),
        provider: provider.trim() || tr("Patient upload", "رفع المريض"),
        category,
        fileKey,
        fileName: pendingFile.name,
        mimeType: pendingFile.type || "application/octet-stream",
        size: pendingFile.size,
        visibility: "private",
      };
      savePatient({ ...patient, documents: [doc, ...patient.documents] });
      addActivity({ type: "update", title: "Medical file added", detail: doc.title });
      resetUpload();
    } catch {
      alert(tr("Could not save this file.", "تعذر حفظ الملف."));
    } finally {
      setSaving(false);
    }
  };

  const removeDocument = async (doc: PatientDocument) => {
    if (!confirm(tr("Delete this medical file?", "هل تريد حذف هذا الملف الطبي؟"))) return;
    if (doc.fileKey) { try { await deleteLocalFile(doc.fileKey); } catch {} }
    savePatient({ ...patient, documents: patient.documents.filter((item) => item.id !== doc.id) });
    addActivity({ type: "update", title: "Medical file deleted", detail: doc.title });
  };

  const tabs: Array<{ id: Tab; en: string; ar: string }> = [
    { id: "summary", en: "Summary", ar: "الملخص" },
    { id: "timeline", en: "Timeline", ar: "الخط الزمني" },
    { id: "files", en: "Files", ar: "الملفات" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-8 pt-7 lg:pt-9 pb-10">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-[#d2d2d7] pb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#707070]">VITAL ID / RECORD</p>
          <h1 className="text-3xl lg:text-4xl font-semibold mt-2">{tr("Your medical record", "سجلك الطبي")}</h1>
          <p className="text-sm text-[#707070] mt-1">{tr("A simple view of your health story and original files.", "عرض بسيط لتاريخك الصحي وملفاتك الأصلية.")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/share" className="vital-secondary min-h-[40px] px-4 text-sm inline-flex items-center">{tr("Share record", "مشاركة السجل")}</Link>
          <Link href="/dashboard/medical" className="vital-primary min-h-[40px] px-4 text-sm inline-flex items-center gap-2"><Plus size={15}/>{tr("Edit medical details", "تعديل البيانات")}</Link>
        </div>
      </header>

      <div className="flex gap-1 mt-5 border-b border-[#d2d2d7] overflow-x-auto">
        {tabs.map((item) => (
          <button key={item.id} onClick={() => setTab(item.id)} className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 ${tab === item.id ? "border-[#0071e3] text-[#1d1d1f] font-semibold" : "border-transparent text-[#707070]"}`}>
            {tr(item.en, item.ar)}
          </button>
        ))}
      </div>

      {tab === "summary" && (
        <div className="pt-6 space-y-5">
          <section className="grid md:grid-cols-4 gap-px bg-[#d2d2d7] border border-[#d2d2d7]">
            <div className="bg-white p-5"><p className="text-xs text-[#707070]">{tr("Allergies", "الحساسية")}</p><p className="text-2xl font-semibold mt-2">{patient.allergies.length}</p></div>
            <div className="bg-white p-5"><p className="text-xs text-[#707070]">{tr("Active conditions", "الحالات النشطة")}</p><p className="text-2xl font-semibold mt-2">{patient.conditions.filter((x) => x.status === "active").length}</p></div>
            <div className="bg-white p-5"><p className="text-xs text-[#707070]">{tr("Current medications", "الأدوية الحالية")}</p><p className="text-2xl font-semibold mt-2">{patient.medications.length}</p></div>
            <div className="bg-white p-5"><p className="text-xs text-[#707070]">{tr("Medical files", "الملفات الطبية")}</p><p className="text-2xl font-semibold mt-2">{patient.documents.length}</p></div>
          </section>

          <section className="grid lg:grid-cols-2 gap-5">
            <div className="bg-white border border-[#d2d2d7] p-6">
              <div className="flex items-center justify-between gap-3 mb-5"><div><p className="text-xs text-[#707070]">{tr("Current snapshot", "الملخص الحالي")}</p><h2 className="text-xl font-semibold mt-1">{tr("Important now", "المهم حاليًا")}</h2></div><Stethoscope size={21}/></div>
              <div className="space-y-5">
                <div><p className="text-xs font-semibold text-[#707070] mb-2">{tr("ALLERGIES", "الحساسية")}</p>{patient.allergies.length ? patient.allergies.map((item) => <p key={item.id} className="text-sm py-2 border-t border-[#e5e5e7]"><strong>{item.allergen}</strong> · {item.reaction}</p>) : <p className="text-sm text-[#707070]">{tr("None added", "لم تتم الإضافة")}</p>}</div>
                <div><p className="text-xs font-semibold text-[#707070] mb-2">{tr("CONDITIONS", "الحالات")}</p>{patient.conditions.filter((x) => x.status === "active").length ? patient.conditions.filter((x) => x.status === "active").map((item) => <p key={item.id} className="text-sm py-2 border-t border-[#e5e5e7]">{item.name}</p>) : <p className="text-sm text-[#707070]">{tr("None added", "لم تتم الإضافة")}</p>}</div>
                <div><p className="text-xs font-semibold text-[#707070] mb-2">{tr("MEDICATIONS", "الأدوية")}</p>{patient.medications.length ? patient.medications.map((item) => <p key={item.id} className="text-sm py-2 border-t border-[#e5e5e7]"><strong>{item.name}</strong> · {item.dosage} · {item.frequency}</p>) : <p className="text-sm text-[#707070]">{tr("None added", "لم تتم الإضافة")}</p>}</div>
              </div>
            </div>

            <div className="bg-[#f4f8fb] border border-[#d2d2d7] p-6">
              <div className="flex items-center justify-between gap-3 mb-5"><div><p className="text-xs text-[#707070]">{tr("Recent record", "أحدث السجل")}</p><h2 className="text-xl font-semibold mt-1">{tr("Latest events", "آخر الأحداث")}</h2></div><Clock3 size={21}/></div>
              <div className="divide-y divide-[#d2d2d7]">
                {timeline.slice(0, 6).map((item) => <div key={item.id} className="py-3"><p className="text-xs text-[#707070]">{item.dateLabel}</p><p className="text-sm font-semibold mt-0.5">{item.title}</p><p className="text-xs text-[#707070] mt-0.5 line-clamp-2">{item.detail}</p></div>)}
                {timeline.length === 0 && <p className="text-sm text-[#707070] py-4">{tr("Your timeline will build automatically as you add information.", "سيتم بناء الخط الزمني تلقائيًا مع إضافة بياناتك.")}</p>}
              </div>
              <button onClick={() => setTab("timeline")} className="text-sm text-[#0066cc] mt-4">{tr("View full timeline", "عرض الخط الزمني بالكامل")}</button>
            </div>
          </section>

          <section className="bg-white border border-[#d2d2d7] p-6">
            <div className="flex items-center justify-between gap-4"><div><p className="text-xs text-[#707070]">{tr("Medical Vault", "خزنة الملفات الطبية")}</p><h2 className="text-xl font-semibold mt-1">{tr("Keep the original file with the record", "احتفظ بالملف الأصلي مع السجل")}</h2></div><FolderOpen size={22}/></div>
            <p className="text-sm text-[#707070] mt-3 max-w-2xl">{tr("Lab reports, scans, prescriptions and discharge papers stay together instead of being scattered across chats and phone photos.", "التحاليل والأشعة والروشتات وتقارير المستشفى تظل معًا بدل ما تكون موزعة بين المحادثات وصور الهاتف.")}</p>
            <button onClick={() => setTab("files")} className="vital-primary min-h-[40px] px-4 text-sm mt-5 inline-flex items-center gap-2"><Upload size={15}/>{tr("Add medical file", "إضافة ملف طبي")}</button>
          </section>
        </div>
      )}

      {tab === "timeline" && (
        <section className="pt-6">
          <div className="mb-5"><h2 className="text-2xl font-semibold">{tr("Medical timeline", "الخط الزمني الطبي")}</h2><p className="text-sm text-[#707070] mt-1">{tr("Built automatically from your record. No extra data entry.", "يُبنى تلقائيًا من سجلك بدون إدخال إضافي.")}</p></div>
          {timeline.length === 0 ? <div className="border border-dashed border-[#d2d2d7] p-8 text-center text-sm text-[#707070]">{tr("Add medical information or files to start your timeline.", "أضف بيانات أو ملفات طبية لبدء الخط الزمني.")}</div> : (
            <div className="border-t border-[#d2d2d7]">
              {timeline.map((item) => {
                const Icon = timelineIcon(item.category);
                return <div key={item.id} className="grid grid-cols-[90px_28px_1fr] md:grid-cols-[150px_36px_1fr] gap-3 py-5 border-b border-[#d2d2d7] items-start">
                  <p className="text-xs text-[#707070] pt-1">{item.dateLabel}</p>
                  <div className="w-7 h-7 rounded-full bg-[#f4f8fb] flex items-center justify-center"><Icon size={14}/></div>
                  <div><p className="font-semibold">{item.title}</p><p className="text-sm text-[#707070] mt-1">{item.detail}</p>{item.documentId && <button onClick={() => { const doc = patient.documents.find((d) => d.id === item.documentId); if (doc) setViewer(doc); }} className="text-sm text-[#0066cc] mt-2">{tr("View source file", "عرض الملف الأصلي")}</button>}</div>
                </div>;
              })}
            </div>
          )}
        </section>
      )}

      {tab === "files" && (
        <section className="pt-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5"><div><h2 className="text-2xl font-semibold">{tr("Medical Vault", "خزنة الملفات الطبية")}</h2><p className="text-sm text-[#707070] mt-1">{tr("Upload the real report. VITAL only stores and organizes what you provide — it does not guess medical information.", "ارفع التقرير الأصلي. VITAL يحفظ وينظم ما تضيفه فقط ولا يخمن معلومات طبية.")}</p></div><div className="flex gap-2"><button onClick={() => cameraInput.current?.click()} className="vital-secondary min-h-[40px] px-4 text-sm inline-flex items-center gap-2"><Camera size={15}/>{tr("Take photo", "التقاط صورة")}</button><button onClick={() => fileInput.current?.click()} className="vital-primary min-h-[40px] px-4 text-sm inline-flex items-center gap-2"><Upload size={15}/>{tr("Choose file", "اختيار ملف")}</button></div></div>
          <input ref={fileInput} type="file" className="hidden" accept="image/*,.pdf,application/pdf" onChange={(e) => { const f=e.target.files?.[0]; if (f) choose(f); }}/>
          <input ref={cameraInput} type="file" className="hidden" accept="image/*" capture="environment" onChange={(e) => { const f=e.target.files?.[0]; if (f) choose(f); }}/>

          {pendingFile && <div className="bg-white border border-[#d2d2d7] p-5 mb-6">
            <div className="flex items-center gap-3 mb-5">{pendingFile.type.startsWith("image/") ? <ImageIcon size={22}/> : <FileText size={22}/>}<div className="min-w-0"><p className="font-semibold truncate">{pendingFile.name}</p><p className="text-xs text-[#707070]">{Math.max(1, Math.round(pendingFile.size/1024))} KB</p></div></div>
            {previewUrl && <img src={previewUrl} alt="Preview" className="w-full max-h-72 object-contain bg-[#f5f5f7] mb-5"/>}
            <div className="grid md:grid-cols-2 gap-4">
              <label className="block"><span className="text-xs text-[#707070]">{tr("File type", "نوع الملف")}</span><select value={category} onChange={(e)=>setCategory(e.target.value as DocumentCategory)} className="w-full mt-1 min-h-[44px] border border-[#d2d2d7] bg-white px-3">{categories.map((c)=><option key={c.value} value={c.value}>{tr(c.en,c.ar)}</option>)}</select></label>
              <label className="block"><span className="text-xs text-[#707070]">{tr("Date", "التاريخ")}</span><input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="w-full mt-1 min-h-[44px] border border-[#d2d2d7] px-3"/></label>
              <label className="block"><span className="text-xs text-[#707070]">{tr("Title", "العنوان")}</span><input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full mt-1 min-h-[44px] border border-[#d2d2d7] px-3"/></label>
              <label className="block"><span className="text-xs text-[#707070]">{tr("Hospital / lab / clinic", "المستشفى / المعمل / العيادة")}</span><input value={provider} onChange={(e)=>setProvider(e.target.value)} className="w-full mt-1 min-h-[44px] border border-[#d2d2d7] px-3" placeholder={tr("Optional", "اختياري")}/></label>
            </div>
            <div className="flex gap-2 justify-end mt-5"><button onClick={resetUpload} className="vital-secondary min-h-[40px] px-4 text-sm">{tr("Cancel", "إلغاء")}</button><button disabled={saving} onClick={()=>void saveDocument()} className="vital-primary min-h-[40px] px-5 text-sm disabled:opacity-50">{saving ? tr("Saving…", "جارٍ الحفظ…") : tr("Save file", "حفظ الملف")}</button></div>
          </div>}

          <div className="flex gap-2 overflow-x-auto pb-3 mb-2">
            <button onClick={()=>setFilter("all")} className={`vital-pill min-h-[34px] px-3 text-xs border whitespace-nowrap ${filter === "all" ? "bg-[#1d1d1f] text-white border-[#1d1d1f]" : "bg-white border-[#d2d2d7]"}`}>{tr("All files", "كل الملفات")} · {patient.documents.length}</button>
            {categories.map((c) => { const count = patient.documents.filter((d)=>(d.category??"other")===c.value).length; return <button key={c.value} onClick={()=>setFilter(c.value)} className={`vital-pill min-h-[34px] px-3 text-xs border whitespace-nowrap ${filter === c.value ? "bg-[#1d1d1f] text-white border-[#1d1d1f]" : "bg-white border-[#d2d2d7]"}`}>{tr(c.en,c.ar)} · {count}</button>; })}
          </div>

          {filteredDocuments.length === 0 ? <div className="border border-dashed border-[#d2d2d7] p-8 text-center text-sm text-[#707070]">{tr("No files in this category yet.", "لا توجد ملفات في هذا القسم بعد.")}</div> : <div className="divide-y divide-[#d2d2d7] border-t border-[#d2d2d7]">{filteredDocuments.map((doc)=><div key={doc.id} className="py-4 flex items-center gap-3"><div className="w-9 h-9 bg-[#f4f8fb] flex items-center justify-center shrink-0">{doc.mimeType?.startsWith("image/") ? <ImageIcon size={17}/> : <FileText size={17}/>}</div><div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate">{doc.title}</p><p className="text-xs text-[#707070] mt-0.5">{doc.date} · {doc.provider} · {tr(categories.find((c)=>c.value===(doc.category??"other"))?.en ?? "Other", categories.find((c)=>c.value===(doc.category??"other"))?.ar ?? "أخرى")}</p></div><button onClick={()=>setViewer(doc)} className="w-9 h-9 flex items-center justify-center" aria-label="View"><Eye size={17}/></button><button onClick={()=>void removeDocument(doc)} className="w-9 h-9 flex items-center justify-center text-[#d92d20]" aria-label="Delete"><Trash2 size={17}/></button></div>)}</div>}
        </section>
      )}

      <DocumentViewer document={viewer} onClose={() => setViewer(null)} />
    </div>
  );
}
