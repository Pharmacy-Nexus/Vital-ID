"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Smartphone, User, Baby, Zap } from "lucide-react";
import Link from "next/link";
import IdentityMark from "@/components/ui/IdentityMark";
import { LangToggle, useLang } from "@/components/ui/LangProvider";
import DemoTag from "@/components/ui/DemoTag";

export default function Home() {
  const { t } = useLang();
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(`${window.location.origin}/id/demo-001`);
  }, []);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bone">
      {/* Nav */}
      <nav className="flex items-center justify-between px-5 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <IdentityMark id="vital-id" className="text-ink" />
          <span className="text-lg font-bold tracking-tight">VITAL ID</span>
        </div>
        <LangToggle />
      </nav>

      {/* Hero */}
      <div className="px-5 pt-8 pb-16 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight mb-4">
            One medical identity.
            <br />
            <span className="text-coral">Ready when you need it.</span>
          </h1>
          <p className="text-lg text-muted mb-8 max-w-md">{t.tagline}</p>
        </motion.div>

        {/* QR Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-ink text-bone rounded-3xl p-6 md:p-8 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-white p-4 rounded-2xl shrink-0">
              {url && <QRCodeSVG value={url} size={180} level="M" fgColor="#16171B" />}
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-lime mb-2">Demo Medical ID</p>
              <h2 className="text-2xl font-bold mb-3">Omar Hassan</h2>
              <p className="text-bone/60 text-sm mb-6 leading-relaxed">
                Scan the QR code as if you found this medical ID during an emergency.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/id/demo-001" className="flex-1">
                  <button className="w-full min-h-[48px] rounded-2xl bg-coral text-white font-bold text-sm flex items-center justify-center gap-2">
                    <Smartphone size={18} />
                    {t.openEmergency}
                  </button>
                </Link>
                <button
                  onClick={copyLink}
                  className="flex-1 min-h-[48px] rounded-2xl border-2 border-bone/30 text-bone font-bold text-sm flex items-center justify-center gap-2 hover:bg-bone/10 transition-colors"
                >
                  {copied ? <Check size={18} className="text-lime" /> : <Copy size={18} />}
                  {copied ? "Copied!" : t.copyLink}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: "/id/demo-001", icon: <Zap size={20} />, label: "Emergency Demo", desc: "Scan & view" },
            { href: "/dashboard", icon: <User size={20} />, label: "Patient Dashboard", desc: "Owner view" },
            { href: "/id/demo-child-001", icon: <Baby size={20} />, label: "Child Safety", desc: "Guardian mode" },
            { href: "/activate", icon: <Smartphone size={20} />, label: "Activation", desc: "New device setup" },
          ].map((card, i) => (
            <motion.div key={card.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
              <Link href={card.href}>
                <div className="bg-white rounded-2xl p-4 border hairline hover:border-ink/30 transition-colors h-full">
                  <div className="text-aubergine mb-3">{card.icon}</div>
                  <p className="font-bold text-sm">{card.label}</p>
                  <p className="text-[11px] text-muted mt-0.5">{card.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/demo" className="text-sm font-bold text-aubergine underline underline-offset-4">
            View presentation guide →
          </Link>
        </div>
      </div>
      <DemoTag />
    </div>
  );
}
