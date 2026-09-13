"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, User, Baby, Heart } from "lucide-react";
import IdentityMark from "@/components/ui/IdentityMark";

const steps = ["welcome", "who", "contact", "emergency", "success"] as const;

export default function ActivatePage() {
  const [step, setStep] = useState<(typeof steps)[number]>("welcome");
  const [who, setWho] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-bone flex flex-col px-6 pt-8 pb-10 max-w-md mx-auto">
      {/* Progress */}
      {step !== "welcome" && step !== "success" && (
        <div className="flex gap-1.5 mb-8">
          {steps.slice(1, 4).map((s, i) => (
            <div key={s} className={`h-1 flex-1 rounded-full ${
              steps.indexOf(step) > i ? "bg-ink" : "bg-ink/15"
            }`} />
          ))}
        </div>
      )}

      {step === "welcome" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col justify-center">
          <IdentityMark id="activate" className="text-ink mb-8" />
          <h1 className="text-4xl font-bold mb-3">Welcome to VITAL ID</h1>
          <p className="text-lg text-muted mb-10">Activate your Medical Identity.</p>
          <button
            onClick={() => setStep("who")}
            className="w-full min-h-[52px] rounded-2xl bg-ink text-bone font-bold text-sm flex items-center justify-center gap-2"
          >
            Get started <ArrowRight size={18} />
          </button>
        </motion.div>
      )}

      {step === "who" && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-2xl font-bold mb-2">Who is this ID for?</h2>
          <p className="text-muted mb-8">You can add more profiles later.</p>
          <div className="space-y-3">
            {[
              { id: "self", icon: <User size={24} />, label: "Myself" },
              { id: "child", icon: <Baby size={24} />, label: "My child" },
              { id: "other", icon: <Heart size={24} />, label: "Someone I care for" },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => { setWho(opt.id); setStep("contact"); }}
                className={`w-full p-5 rounded-2xl border-2 text-left flex items-center gap-4 transition-colors ${
                  who === opt.id ? "border-ink bg-ink text-bone" : "border-ink/15 bg-white"
                }`}
              >
                <span className={who === opt.id ? "text-lime" : "text-aubergine"}>{opt.icon}</span>
                <span className="font-bold">{opt.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {step === "contact" && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-2xl font-bold mb-2">Create your account</h2>
          <p className="text-muted mb-8">We'll send a verification code. (Simulated in demo)</p>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-muted">Phone or email</label>
              <input
                type="text"
                placeholder="+20 100 000 0000"
                className="w-full mt-1.5 min-h-[52px] px-4 rounded-2xl border-2 border-ink/15 bg-white text-base focus:border-coral focus:outline-none"
              />
            </div>
            <button
              onClick={() => setStep("emergency")}
              className="w-full min-h-[52px] rounded-2xl bg-ink text-bone font-bold text-sm"
            >
              Continue
            </button>
          </div>
        </motion.div>
      )}

      {step === "emergency" && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-2xl font-bold mb-2">Emergency information</h2>
          <p className="text-muted mb-6">Only the minimum. You can skip anything you don't know.</p>
          <div className="space-y-4">
            {[
              { label: "Full name", placeholder: "Your name" },
              { label: "Date of birth", placeholder: "DD/MM/YYYY" },
              { label: "Blood type", placeholder: "O+, A-, ... or I don't know" },
              { label: "Emergency contact", placeholder: "Name & phone" },
              { label: "Critical allergies", placeholder: "Penicillin, peanuts, ... or none" },
              { label: "Important conditions", placeholder: "Diabetes, asthma, ... or none" },
            ].map(field => (
              <div key={field.label}>
                <label className="text-xs font-bold uppercase tracking-wide text-muted">{field.label}</label>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  className="w-full mt-1.5 min-h-[52px] px-4 rounded-2xl border-2 border-ink/15 bg-white text-base focus:border-coral focus:outline-none"
                />
                <button className="text-[11px] text-muted mt-1 font-bold">I don't know</button>
              </div>
            ))}
            <button
              onClick={() => setStep("success")}
              className="w-full min-h-[52px] rounded-2xl bg-coral text-white font-bold text-sm"
            >
              Activate Emergency ID
            </button>
          </div>
        </motion.div>
      )}

      {step === "success" && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-full bg-lime flex items-center justify-center mb-6"
          >
            <Check size={36} className="text-ink" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-3">Your Emergency Medical ID is Active.</h1>
          <p className="text-muted mb-8">Anyone who scans your ID can now see your emergency information.</p>
          <div className="w-full space-y-3">
            <a href="/id/demo-001" className="block w-full min-h-[52px] rounded-2xl bg-ink text-bone font-bold text-sm flex items-center justify-center">
              VIEW MY EMERGENCY ID
            </a>
            <a href="/dashboard" className="block w-full min-h-[52px] rounded-2xl border-2 border-ink font-bold text-sm flex items-center justify-center">
              COMPLETE MEDICAL PROFILE
            </a>
            <a href="/" className="block text-sm text-muted font-bold py-2">Do it later</a>
          </div>
        </motion.div>
      )}
    </div>
  );
}
