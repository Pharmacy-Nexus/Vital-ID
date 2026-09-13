"use client";

import { useState } from "react";
import { Upload, FileText, Camera, Check } from "lucide-react";
import { omarHassan } from "@/data/demo/patients";

const docTypes = ["Lab Report", "Radiology", "Prescription", "Hospital Report", "Other"];

export default function DocumentsPage() {
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [showExtract, setShowExtract] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setExtracting(true);
      setTimeout(() => {
        setExtracting(false);
        setShowExtract(true);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto px-5 pt-6">
      <h1 className="text-2xl font-bold mb-2">Documents</h1>
      <p className="text-sm text-muted mb-6">Upload medical documents. AI can help extract key information.</p>

      {/* Upload area */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-muted/30 p-8 text-center mb-6">
        <Upload size={32} className="text-muted/50 mx-auto mb-3" />
        <p className="font-bold mb-1">Upload Medical Document</p>
        <p className="text-xs text-muted mb-4">Lab report, radiology, prescription, or hospital report</p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={handleUpload}
            disabled={uploading || extracting}
            className="min-h-[44px] px-5 rounded-xl bg-ink text-bone text-xs font-bold flex items-center gap-2 disabled:opacity-50"
          >
            <Upload size={14} />
            {uploading ? "Uploading..." : extracting ? "Processing..." : "Choose file"}
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading || extracting}
            className="min-h-[44px] px-5 rounded-xl border-2 border-ink text-xs font-bold flex items-center gap-2 disabled:opacity-50"
          >
            <Camera size={14} /> Take photo
          </button>
        </div>
      </div>

      {/* AI extraction result */}
      {showExtract && (
        <div className="bg-lime/10 border border-lime/30 rounded-2xl p-5 mb-6">
          <p className="text-sm font-bold mb-3">We found the following information:</p>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm"><span className="text-muted">Test</span><span className="font-bold">HbA1c</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted">Value</span><span className="font-bold">7.2%</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted">Date</span><span className="font-bold">3 September 2026</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted">Laboratory</span><span className="font-bold">Example Medical Lab</span></div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 min-h-[40px] rounded-xl bg-ink text-bone text-xs font-bold">CONFIRM</button>
            <button className="flex-1 min-h-[40px] rounded-xl border-2 border-ink text-xs font-bold">EDIT</button>
            <button onClick={() => setShowExtract(false)} className="flex-1 min-h-[40px] rounded-xl text-xs font-bold text-muted">IGNORE</button>
          </div>
          <p className="text-[10px] text-muted/60 mt-3">
            AI helps organize information. It does not diagnose or replace medical review.
          </p>
        </div>
      )}

      {/* Document list */}
      <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted mb-3">Existing documents</h2>
      {omarHassan.documents.map(doc => (
        <div key={doc.id} className="bg-white rounded-xl p-4 border hairline mb-2 flex items-center gap-3">
          <FileText size={20} className="text-aubergine shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{doc.title}</p>
            <p className="text-[11px] text-muted">{doc.date} · {doc.provider}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
