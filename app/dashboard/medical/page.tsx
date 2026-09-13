"use client";

import { useState } from "react";
import { Plus, Check, Pencil } from "lucide-react";
import { omarHassan } from "@/data/demo/patients";
import SourceBadge from "@/components/ui/SourceBadge";
import FreshnessChip from "@/components/ui/FreshnessChip";

export default function MedicalPage() {
  const [confirming, setConfirming] = useState<string | null>(null);

  const handleConfirm = (id: string) => {
    setConfirming(id);
    setTimeout(() => setConfirming(null), 1500);
  };

  return (
    <div className="max-w-md mx-auto px-5 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Medical Profile</h1>
        <button className="min-h-[40px] px-4 rounded-xl bg-ink text-bone text-xs font-bold flex items-center gap-1.5">
          <Plus size={14} /> Add item
        </button>
      </div>

      {/* Conditions */}
      <section className="mb-6">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted mb-3">Conditions</h2>
        {omarHassan.conditions.map(c => (
          <div key={c.id} className="bg-white rounded-xl p-4 border hairline mb-2">
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="font-bold">{c.name}</p>
              <FreshnessChip freshness={c.freshness} />
            </div>
            <p className="text-xs text-muted mb-2">Diagnosed {c.diagnosedYear}</p>
            <div className="flex items-center justify-between">
              <SourceBadge source={c.source} detail={c.sourceDetail} date={c.confirmedAt} />
              <div className="flex gap-2">
                <button
                  onClick={() => handleConfirm(c.id)}
                  className="text-[11px] font-bold text-lime flex items-center gap-1"
                >
                  {confirming === c.id ? <Check size={12} /> : null}
                  {confirming === c.id ? "Confirmed!" : "Confirm still correct"}
                </button>
                <button className="text-[11px] font-bold text-muted flex items-center gap-1">
                  <Pencil size={12} /> Update
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Medications */}
      <section className="mb-6">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted mb-3">Medications</h2>
        {omarHassan.medications.map(m => (
          <div key={m.id} className="bg-white rounded-xl p-4 border hairline mb-2">
            <div className="flex items-start justify-between gap-3 mb-1">
              <p className="font-bold">{m.name}</p>
              <FreshnessChip freshness={m.freshness} />
            </div>
            <p className="text-xs text-muted mb-2">{m.dosage} · {m.frequency}</p>
            <div className="flex items-center justify-between">
              <SourceBadge source={m.source} date={m.confirmedAt} />
              <div className="flex gap-2">
                <button
                  onClick={() => handleConfirm(m.id)}
                  className="text-[11px] font-bold text-lime flex items-center gap-1"
                >
                  {confirming === m.id ? <Check size={12} /> : null}
                  {confirming === m.id ? "Confirmed!" : "Confirm still correct"}
                </button>
                <button className="text-[11px] font-bold text-muted flex items-center gap-1">
                  <Pencil size={12} /> Update
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Allergies */}
      <section className="mb-6">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted mb-3">Allergies</h2>
        {omarHassan.allergies.map(a => (
          <div key={a.id} className="bg-coral/5 border border-coral/20 rounded-xl p-4 mb-2">
            <div className="flex items-start justify-between gap-3 mb-1">
              <p className="font-bold text-coral">{a.allergen}</p>
              <FreshnessChip freshness={a.freshness} />
            </div>
            <p className="text-xs text-muted mb-2">{a.reaction}</p>
            <SourceBadge source={a.source} date={a.confirmedAt} />
          </div>
        ))}
      </section>

      <p className="text-[11px] text-muted/60 text-center pb-4">
        AI helps organize information. It does not diagnose or replace medical review.
      </p>
    </div>
  );
}
