"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FileText, Activity, Pill, AlertTriangle, Scissors, Syringe, FlaskConical, Scan, FolderOpen, Clock, Phone } from "lucide-react";
import { PatientProfile, TimelineEvent } from "@/lib/types";
import SourceBadge from "@/components/ui/SourceBadge";
import FreshnessChip from "@/components/ui/FreshnessChip";
import Avatar from "@/components/ui/Avatar";
import IdentityMark from "@/components/ui/IdentityMark";

function Section({ title, icon, children, defaultOpen = true }: {
  title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b hairline">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 px-1">
        <div className="flex items-center gap-3">
          <span className="text-muted">{icon}</span>
          <span className="text-sm font-bold tracking-wide uppercase">{title}</span>
        </div>
        <ChevronDown size={18} className={`text-muted transition-transform ${open ? "" : "-rotate-90"}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pb-5 px-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DataRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-baseline justify-between py-2.5 border-b hairline last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <div className="text-right">
        <span className="text-base font-bold">{value}</span>
        {sub && <span className="block text-[11px] text-muted">{sub}</span>}
      </div>
    </div>
  );
}

function TimelineItem({ event }: { event: TimelineEvent }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="relative pl-6 pb-5 last:pb-0">
      <span className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-ink" />
      <span className="absolute left-[4px] top-4 bottom-0 w-px bg-ink/15 last:hidden" />
      <button onClick={() => setExpanded(!expanded)} className="text-left w-full">
        <p className="text-[11px] font-bold text-muted uppercase tracking-wide">{event.year}</p>
        <p className="text-base font-bold mt-0.5">{event.title}</p>
        {expanded && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted mt-1.5 leading-relaxed">
            {event.detail}
          </motion.p>
        )}
      </button>
    </div>
  );
}

export default function DoctorRecord({ patient }: { patient: PatientProfile }) {
  const [showDoc, setShowDoc] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-bone pb-12">
      {/* Header */}
      <div className="bg-ink text-bone px-5 pt-6 pb-8">
        <div className="flex items-center justify-between mb-5">
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-lime">Medical Record</span>
          <IdentityMark id={patient.slug} className="text-lime/60" barClass="bg-lime/60" />
        </div>
        <div className="flex items-center gap-3">
          <Avatar name={`${patient.firstName} ${patient.lastName}`} color={patient.photoColor} size={48} />
          <div>
            <h1 className="text-2xl font-bold">{patient.firstName} {patient.lastName}</h1>
            <p className="text-bone/50 text-sm">Age {patient.age} · Blood type {patient.bloodType}</p>
          </div>
        </div>
      </div>

      <div className="px-5 max-w-2xl mx-auto">
        {/* Medical Snapshot */}
        <div className="py-6 border-b hairline">
          <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-muted mb-4">Medical Snapshot</h2>
          <div className="space-y-3">
            {patient.allergies.filter(a => a.severity === "critical").map(a => (
              <div key={a.id} className="bg-coral/10 border border-coral/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={16} className="text-coral" />
                  <span className="text-sm font-bold text-coral">Critical Allergy</span>
                </div>
                <p className="text-lg font-bold">{a.allergen}</p>
                <p className="text-xs text-muted mt-1">{a.reaction}</p>
                <div className="mt-2"><SourceBadge source={a.source} detail={a.sourceDetail} date={a.confirmedAt} /></div>
              </div>
            ))}
            {patient.conditions.filter(c => c.status === "active").map(c => (
              <div key={c.id} className="bg-white rounded-xl p-4 border hairline">
                <div className="flex items-center justify-between">
                  <p className="text-base font-bold">{c.name}</p>
                  <FreshnessChip freshness={c.freshness} />
                </div>
                <p className="text-xs text-muted mt-1">Diagnosed {c.diagnosedYear}</p>
                <div className="mt-2"><SourceBadge source={c.source} detail={c.sourceDetail} date={c.confirmedAt} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Sections */}
        <Section title="Current Medications" icon={<Pill size={18} />}>
          {patient.medications.length === 0 ? (
            <p className="text-sm text-muted py-2">No medications recorded.</p>
          ) : (
            <div>
              {patient.medications.map(m => (
                <div key={m.id} className="py-3 border-b hairline last:border-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">{m.name}</p>
                      <p className="text-xs text-muted mt-0.5">{m.dosage} · {m.frequency}</p>
                    </div>
                    <FreshnessChip freshness={m.freshness} />
                  </div>
                  <div className="mt-2"><SourceBadge source={m.source} date={m.confirmedAt} /></div>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Allergies" icon={<AlertTriangle size={18} />}>
          {patient.allergies.map(a => (
            <div key={a.id} className="py-3 border-b hairline last:border-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{a.allergen}</p>
                  <p className="text-xs text-muted mt-0.5">{a.reaction}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  a.severity === "critical" ? "bg-coral/10 text-coral" : "bg-surface text-muted"
                }`}>{a.severity}</span>
              </div>
              <div className="mt-2"><SourceBadge source={a.source} detail={a.sourceDetail} date={a.confirmedAt} /></div>
            </div>
          ))}
        </Section>

        <Section title="Laboratory Results" icon={<FlaskConical size={18} />}>
          {patient.labResults.length === 0 ? (
            <p className="text-sm text-muted py-2">No lab results recorded.</p>
          ) : (
            <div>
              {patient.labResults.map(l => (
                <div key={l.id} className="py-3 border-b hairline last:border-0">
                  <div className="flex items-baseline justify-between">
                    <p className="font-bold">{l.testName}</p>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${l.status === "abnormal" ? "text-coral" : ""}`}>
                        {l.value}{l.unit && <span className="text-sm font-normal text-muted ml-1">{l.unit}</span>}
                      </p>
                      <p className="text-[11px] text-muted">{l.date} · {l.lab}</p>
                    </div>
                  </div>
                  {l.documentId && (
                    <button onClick={() => setShowDoc(l.documentId!)} className="mt-2 text-xs font-bold text-aubergine flex items-center gap-1">
                      <FileText size={13} /> VIEW SOURCE
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Radiology" icon={<Scan size={18} />}>
          {patient.radiology.length === 0 ? (
            <p className="text-sm text-muted py-2">No radiology records yet.</p>
          ) : (
            patient.radiology.map(r => (
              <div key={r.id} className="py-3 border-b hairline last:border-0">
                <p className="font-bold">{r.type} — {r.bodyPart}</p>
                <p className="text-xs text-muted mt-1">{r.date}</p>
                <p className="text-sm mt-2 leading-relaxed">{r.finding}</p>
                {r.documentId && (
                  <button onClick={() => setShowDoc(r.documentId!)} className="mt-2 text-xs font-bold text-aubergine flex items-center gap-1">
                    <FileText size={13} /> VIEW SOURCE
                  </button>
                )}
              </div>
            ))
          )}
        </Section>

        <Section title="Surgeries" icon={<Scissors size={18} />}>
          {patient.surgeries.length === 0 ? (
            <p className="text-sm text-muted py-2">No surgeries added.</p>
          ) : (
            patient.surgeries.map(s => (
              <DataRow key={s.id} label={s.name} value={String(s.year)} sub={s.hospital} />
            ))
          )}
        </Section>

        <Section title="Vaccinations" icon={<Syringe size={18} />}>
          {patient.vaccinations.length === 0 ? (
            <p className="text-sm text-muted py-2">No vaccinations recorded.</p>
          ) : (
            patient.vaccinations.map(v => (
              <DataRow key={v.id} label={v.name} value={v.date} sub={v.provider} />
            ))
          )}
        </Section>

        <Section title="Medical Timeline" icon={<Clock size={18} />}>
          {patient.timeline.length === 0 ? (
            <p className="text-sm text-muted py-2">No timeline events.</p>
          ) : (
            <div className="pt-1">
              {patient.timeline.map(e => <TimelineItem key={e.id} event={e} />)}
            </div>
          )}
        </Section>

        <Section title="Emergency Contacts" icon={<Phone size={18} />}>
          {patient.emergencyContacts.map(c => (
            <DataRow key={c.id} label={`${c.name} (${c.relationship})`} value={c.phone} />
          ))}
        </Section>

        <Section title="Documents" icon={<FolderOpen size={18} />}>
          {patient.documents.length === 0 ? (
            <p className="text-sm text-muted py-2">No documents uploaded.</p>
          ) : (
            patient.documents.map(d => (
              <button key={d.id} onClick={() => setShowDoc(d.id)} className="w-full flex items-center justify-between py-3 border-b hairline last:border-0 text-left">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-muted" />
                  <div>
                    <p className="font-bold text-sm">{d.title}</p>
                    <p className="text-[11px] text-muted">{d.date} · {d.provider}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase text-aubergine">View</span>
              </button>
            ))
          )}
        </Section>
      </div>

      {/* Document preview modal */}
      {showDoc && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center">
          <div className="absolute inset-0 bg-ink/60" onClick={() => setShowDoc(null)} />
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} className="relative w-full max-w-lg bg-bone rounded-t-3xl p-6 pb-8">
            <div className="w-10 h-1 rounded-full bg-muted/30 mx-auto mb-5" />
            <h3 className="text-lg font-bold mb-4">Document Preview</h3>
            <div className="bg-white rounded-2xl border hairline p-6">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b hairline">
                <FileText size={24} className="text-aubergine" />
                <div>
                  <p className="font-bold text-sm">{patient.documents.find(d => d.id === showDoc)?.title}</p>
                  <p className="text-xs text-muted">{patient.documents.find(d => d.id === showDoc)?.provider}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="skeleton h-4 rounded w-full" />
                <div className="skeleton h-4 rounded w-5/6" />
                <div className="skeleton h-4 rounded w-4/6" />
                <div className="skeleton h-4 rounded w-full" />
                <div className="skeleton h-4 rounded w-3/6" />
              </div>
              <p className="text-[11px] text-muted/60 mt-4 text-center">Simulated document — demo only</p>
            </div>
            <button onClick={() => setShowDoc(null)} className="w-full mt-4 min-h-[48px] rounded-2xl bg-ink text-bone font-bold text-sm">
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
