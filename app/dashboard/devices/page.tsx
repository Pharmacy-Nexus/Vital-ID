"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Watch, CreditCard, Tag, Plane, Power, Eye, X } from "lucide-react";
import { devices as seedDevices } from "@/data/demo/devices";
import { getDeviceStatus, setDeviceStatus } from "@/lib/store";
import IdentityMark from "@/components/ui/IdentityMark";
import { useLang } from "@/components/ui/LangProvider";

const icons = { bracelet: Watch, card: CreditCard, bagtag: Tag, travel: Plane };

export default function DevicesPage() {
  const { tr } = useLang();
  const [devices, setDevices] = useState(seedDevices);
  const [showQr, setShowQr] = useState<string | null>(null);

  useEffect(() => { setDevices(seedDevices.map((d) => ({ ...d, status: getDeviceStatus(d.id) }))); }, []);

  const toggleDevice = (id: string) => {
    const current = getDeviceStatus(id);
    const next = current === "active" ? "deactivated" : "active";
    setDeviceStatus(id, next);
    setDevices((prev) => prev.map((d) => d.id === id ? { ...d, status: next } : d));
  };

  const selected = devices.find((d) => d.id === showQr);
  const deviceLabel = (name: string) => name === "Emergency Bracelet" ? tr("Emergency Bracelet", "سوار الطوارئ") : name === "Wallet Card" ? tr("Wallet Card", "بطاقة المحفظة") : name === "Child Bag Tag" ? tr("Child Bag Tag", "بطاقة حقيبة الطفل") : name;

  return (
    <div className="max-w-md mx-auto px-5 pt-6">
      <h1 className="text-2xl font-bold mb-2">{tr("Linked Devices", "الأجهزة المرتبطة")}</h1>
      <p className="text-sm text-muted mb-6">{tr("Physical IDs connected to your medical identity.", "الأجهزة والبطاقات المرتبطة بهويتك الطبية.")}</p>

      <div className="space-y-3">
        {devices.map((device) => {
          const Icon = icons[device.type];
          const isActive = device.status === "active";
          return <div key={device.id} className={`bg-white rounded-2xl p-5 border hairline ${!isActive ? "opacity-60" : ""}`}>
            <div className="flex items-start justify-between mb-3"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? "bg-ink text-lime" : "bg-surface text-muted"}`}><Icon size={20} /></div><div><p className="font-bold">{deviceLabel(device.name)}</p><p className="text-[11px] text-muted font-mono">ID: {device.slug}</p></div></div><span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${isActive ? "bg-lime/20 text-ink" : "bg-coral/10 text-coral"}`}>{isActive ? tr("Active", "نشط") : tr("Disabled", "معطل")}</span></div>
            <IdentityMark id={device.slug} className="text-ink/30 mb-3" barClass="bg-ink/30" />
            <div className="flex items-center justify-between text-[11px] text-muted mb-4"><span>{tr("Created", "تم الإنشاء")} {device.createdAt}</span>{device.lastScanned && <span>{tr("Last scanned", "آخر مسح")} {new Date(device.lastScanned).toLocaleDateString()}</span>}</div>
            <div className="flex gap-2"><button onClick={() => setShowQr(device.id)} className="flex-1 min-h-[40px] rounded-xl border-2 border-ink font-bold text-xs flex items-center justify-center gap-1.5"><Eye size={14} /> {tr("View QR", "عرض QR")}</button><button onClick={() => toggleDevice(device.id)} className={`flex-1 min-h-[40px] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 ${isActive ? "bg-coral/10 text-coral" : "bg-lime/20 text-ink"}`}><Power size={14} /> {isActive ? tr("Deactivate", "تعطيل") : tr("Reactivate", "إعادة التفعيل")}</button></div>
          </div>;
        })}
      </div>

      {selected && <div className="fixed inset-0 z-[90] flex items-end justify-center"><div className="absolute inset-0 bg-ink/60" onClick={() => setShowQr(null)} /><div className="relative w-full max-w-md bg-bone rounded-t-3xl p-6 pb-8"><div className="w-10 h-1 rounded-full bg-muted/30 mx-auto mb-5" /><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold">{deviceLabel(selected.name)} QR</h3><button onClick={() => setShowQr(null)} aria-label="Close"><X size={22} className="text-muted" /></button></div><div className="bg-white p-6 rounded-2xl flex flex-col items-center"><QRCodeSVG value={`${typeof window !== "undefined" ? window.location.origin : ""}/id/${selected.slug}`} size={200} fgColor="#16171B" /><p className="text-[11px] text-muted mt-4 font-mono text-center break-all">/id/{selected.slug}</p><p className="text-[10px] text-muted/60 mt-2">{tr("This QR can later be stored in an NFC tag.", "يمكن استخدام نفس الرابط داخل شريحة NFC لاحقًا.")}</p></div></div></div>}
    </div>
  );
}
