"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, FileText, Camera, Eye, Trash2, Image as ImageIcon } from "lucide-react";
import { useActivePatient, savePatient } from "@/lib/patientStore";
import { addActivity } from "@/lib/store";
import { deleteLocalFile, saveLocalFile } from "@/lib/fileStore";
import { useLang } from "@/components/ui/LangProvider";
import DocumentViewer from "@/components/documents/DocumentViewer";
import type { PatientDocument } from "@/lib/types";

const today = () => new Date().toISOString().slice(0, 10);

export default function DocumentsPage() {
  const patient = useActivePatient();
  const { tr } = useLang();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const cameraRef = useRef<HTMLInputElement | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");
  const [date, setDate] = useState(today());
  const [emergencyVisible, setEmergencyVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [viewer, setViewer] = useState<PatientDocument | null>(null);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const choose = (file: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(file);
    setTitle(file.name.replace(/\.[^.]+$/, ""));
    setProvider("");
    setDate(today());
    setEmergencyVisible(false);
    setPreviewUrl(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
  };

  const cancelPending = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(null); setPreviewUrl(null); setTitle(""); setProvider(""); setEmergencyVisible(false);
    if (inputRef.current) inputRef.current.value = "";
    if (cameraRef.current) cameraRef.current.value = "";
  };

  const saveDocument = async () => {
    if (!patient || !pendingFile) return;
    setSaving(true);
    try {
      const documentId = crypto.randomUUID();
      const fileKey = await saveLocalFile(pendingFile, documentId, patient.slug);
      const doc: PatientDocument = {
        id: documentId,
        title: title.trim() || pendingFile.name,
        date: date || today(),
        provider: provider.trim() || tr("Patient upload", "رفع المريض"),
        fileKey,
        fileName: pendingFile.name,
        mimeType: pendingFile.type || "application/octet-stream",
        size: pendingFile.size,
        visibility: emergencyVisible ? "emergency" : "private",
      };
      savePatient({ ...patient, documents: [doc, ...patient.documents] });
      addActivity({ type: "update", title: "Document uploaded", detail: doc.title });
      cancelPending();
    } catch {
      alert(tr("The file could not be saved in this browser.", "تعذر حفظ الملف على هذا المتصفح."));
    } finally { setSaving(false); }
  };


  const toggleVisibility = (doc: PatientDocument) => {
    if (!patient) return;
    const nextVisibility = doc.visibility === "emergency" ? "private" : "emergency";
    savePatient({ ...patient, documents: patient.documents.map((d) => d.id === doc.id ? { ...d, visibility: nextVisibility } : d) });
    addActivity({ type: "update", title: "Document visibility updated", detail: `${doc.title} · ${nextVisibility}` });
  };

  const removeDocument = async (doc: PatientDocument) => {
    if (!patient || !confirm(tr("Delete this document?", "هل تريد حذف هذا المستند؟"))) return;
    if (doc.fileKey) { try { await deleteLocalFile(doc.fileKey); } catch {} }
    savePatient({ ...patient, documents: patient.documents.filter((d) => d.id !== doc.id) });
    addActivity({ type: "update", title: "Document deleted", detail: doc.title });
  };

  if (!patient) return <div className="max-w-md mx-auto px-5 pt-8 text-muted">{tr("Loading documents…", "جارٍ تحميل المستندات…")}</div>;

  return (
    <div className="max-w-md mx-auto px-5 pt-6 pb-8">
      <h1 className="text-2xl font-bold mb-2">{tr("Documents & Images", "المستندات والصور")}</h1>
      <p className="text-sm text-muted mb-6">{tr("Upload PDFs or images, keep the real file, preview it later, and choose whether its title can appear on an emergency QR.", "ارفع ملفات PDF أو صورًا، واحتفظ بالملف الحقيقي لمعاينته لاحقًا، واختر ما إذا كان مسموحًا بإظهار عنوانه في QR الطوارئ.")}</p>

      <div className="bg-white rounded-2xl border-2 border-dashed border-muted/30 p-7 text-center mb-6">
        <Upload size={32} className="text-muted/50 mx-auto mb-3" />
        <p className="font-bold mb-1">{tr("Add a medical file", "إضافة ملف طبي")}</p>
        <p className="text-xs text-muted mb-4">{tr("PDF, lab report, radiology image, prescription or phone photo", "PDF أو تحليل أو صورة أشعة أو روشتة أو صورة من الهاتف")}</p>
        <input ref={inputRef} type="file" className="hidden" accept="image/*,.pdf,application/pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) choose(file); }} />
        <input ref={cameraRef} type="file" className="hidden" accept="image/*" capture="environment" onChange={(e) => { const file = e.target.files?.[0]; if (file) choose(file); }} />
        <div className="grid grid-cols-2 gap-2"><button onClick={() => inputRef.current?.click()} className="min-h-[44px] rounded-xl bg-ink text-bone text-xs font-bold flex items-center justify-center gap-2"><Upload size={14} />{tr("Choose file", "اختيار ملف")}</button><button onClick={() => cameraRef.current?.click()} className="min-h-[44px] rounded-xl border-2 border-ink text-xs font-bold flex items-center justify-center gap-2"><Camera size={14} /> {tr("Take photo", "التقاط صورة")}</button></div>
      </div>

      {pendingFile && <div className="bg-white rounded-2xl border hairline p-5 mb-6">
        <div className="flex items-center gap-3 mb-4">{pendingFile.type.startsWith("image/") ? <ImageIcon size={22} className="text-aubergine"/> : <FileText size={22} className="text-aubergine"/>}<div className="min-w-0"><p className="font-bold text-sm truncate">{pendingFile.name}</p><p className="text-[11px] text-muted">{Math.max(1, Math.round(pendingFile.size / 1024))} KB</p></div></div>
        {previewUrl && <img src={previewUrl} alt="Upload preview" className="w-full max-h-64 object-contain rounded-xl bg-surface mb-4"/>}
        <div className="space-y-3"><label className="block"><span className="text-[11px] uppercase tracking-wide text-muted font-bold">{tr("Title", "العنوان")}</span><input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mt-1 min-h-[44px] rounded-xl border-2 border-ink/15 px-3"/></label><label className="block"><span className="text-[11px] uppercase tracking-wide text-muted font-bold">{tr("Provider / source", "الجهة / المصدر")}</span><input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder={tr("Hospital, lab, clinic…", "مستشفى، معمل، عيادة…")} className="w-full mt-1 min-h-[44px] rounded-xl border-2 border-ink/15 px-3"/></label><label className="block"><span className="text-[11px] uppercase tracking-wide text-muted font-bold">{tr("Date", "التاريخ")}</span><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full mt-1 min-h-[44px] rounded-xl border-2 border-ink/15 px-3"/></label><label className="flex items-center justify-between gap-4 bg-bone rounded-xl p-4"><div><p className="font-bold text-sm">{tr("Emergency-visible", "يظهر في الطوارئ")}</p><p className="text-[11px] text-muted">{tr("Only the document title/metadata appears publicly; the private file itself stays in the protected record.", "يظهر عنوان المستند وبياناته فقط بشكل عام، أما الملف نفسه فيظل داخل السجل المحمي.")}</p></div><input type="checkbox" checked={emergencyVisible} onChange={(e) => setEmergencyVisible(e.target.checked)} className="w-5 h-5 accent-[#16171B]"/></label></div>
        <div className="grid grid-cols-2 gap-2 mt-5"><button onClick={cancelPending} className="min-h-[46px] rounded-xl border-2 border-ink font-bold text-xs">{tr("Cancel", "إلغاء")}</button><button onClick={saveDocument} disabled={saving} className="min-h-[46px] rounded-xl bg-ink text-bone font-bold text-xs disabled:opacity-50">{saving ? tr("Saving…", "جارٍ الحفظ…") : tr("Save document", "حفظ المستند")}</button></div>
      </div>}

      <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted mb-3">{tr("Saved documents", "المستندات المحفوظة")}</h2>
      {patient.documents.length === 0 ? <div className="bg-white/50 rounded-xl border border-dashed hairline p-4 text-sm text-muted">{tr("No documents uploaded yet.", "لم يتم رفع مستندات بعد.")}</div> : patient.documents.map((doc) => (
        <div key={doc.id} className="bg-white rounded-xl p-4 border hairline mb-2 flex items-center gap-3">
          {doc.mimeType?.startsWith("image/") ? <ImageIcon size={20} className="text-aubergine shrink-0"/> : <FileText size={20} className="text-aubergine shrink-0" />}
          <div className="flex-1 min-w-0"><p className="font-bold text-sm truncate">{doc.title}</p><p className="text-[11px] text-muted">{doc.date} · {doc.provider}</p><button onClick={() => toggleVisibility(doc)} className={`text-[10px] mt-1 font-bold ${doc.visibility === "emergency" ? "text-lime" : "text-aubergine"}`}>{doc.visibility === "emergency" ? tr("Emergency metadata visible · tap to make private", "بياناته ظاهرة في الطوارئ · اضغط لجعله خاصًا") : tr("Private · tap to share metadata in emergency", "خاص · اضغط لإظهار بياناته في الطوارئ")}</button></div>
          <button onClick={() => setViewer(doc)} className="w-9 h-9 rounded-lg bg-aubergine/10 text-aubergine flex items-center justify-center" aria-label="View"><Eye size={16}/></button>
          <button onClick={() => removeDocument(doc)} className="w-9 h-9 rounded-lg bg-coral/10 text-coral flex items-center justify-center" aria-label="Delete"><Trash2 size={16}/></button>
        </div>
      ))}

      <DocumentViewer document={viewer} onClose={() => setViewer(null)} />
    </div>
  );
}
