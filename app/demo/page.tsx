"use client";

import Link from "next/link";
import { QrCode, Eye, Lock, Key, FileText, X, Smartphone, History, Baby, RotateCcw } from "lucide-react";
import { resetDemo } from "@/lib/store";

const steps = [
  { icon: QrCode, title: "Scan QR", desc: "Use another phone to scan the demo QR code on the homepage." },
  { icon: Eye, title: "See emergency information", desc: "Critical allergies, conditions, medications appear instantly." },
  { icon: Lock, title: "Request protected record", desc: "Tap 'I'm a Healthcare Professional'." },
  { icon: Key, title: "Use OTP 4827", desc: "Enter the demo authorization code." },
  { icon: FileText, title: "View full medical history", desc: "Explore the complete doctor view with timeline." },
  { icon: X, title: "End session", desc: "Temporary access expires after 20 minutes or manually." },
  { icon: Smartphone, title: "Open patient dashboard", desc: "See the owner view of the same data." },
  { icon: History, title: "View scan history", desc: "Check the activity log for scan events." },
  { icon: Baby, title: "Try child safety mode", desc: "Scan /id/demo-child-001 for the guardian experience." },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-bone max-w-md mx-auto px-5 pt-6 pb-12">
      <h1 className="text-2xl font-bold mb-2">Presentation Guide</h1>
      <p className="text-sm text-muted mb-8">Follow these steps to demonstrate the full product flow.</p>

      <div className="space-y-3 mb-8">
        {steps.map((step, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border hairline flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-ink text-lime flex items-center justify-center text-sm font-bold shrink-0">
              {i + 1}
            </div>
            <div>
              <p className="font-bold text-sm">{step.title}</p>
              <p className="text-xs text-muted mt-0.5 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <Link href="/">
          <button className="w-full min-h-[48px] rounded-2xl bg-ink text-bone font-bold text-sm">
            Back to demo start
          </button>
        </Link>
        <button
          onClick={() => { resetDemo(); alert("Demo data reset."); }}
          className="w-full min-h-[48px] rounded-2xl border-2 border-ink font-bold text-sm flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} /> Reset demo data
        </button>
      </div>
    </div>
  );
}
