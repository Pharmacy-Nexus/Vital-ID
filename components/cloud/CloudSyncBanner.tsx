"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cloud, CloudOff, LogOut, RefreshCw } from "lucide-react";
import { isCloudConfigured } from "@/lib/cloud/supabaseBrowser";
import { getCloudUser, loadCloudState, pushLocalStateToCloud, signOutCloud } from "@/lib/cloud/repository";
import { hydratePatientsFromCloud, readPatientState, resetPatientData } from "@/lib/patientStore";
import { hydrateDevicesFromCloud, readDevices, resetDevices } from "@/lib/deviceStore";
import { formatDate, formatTime, replaceActivity, type ActivityItem } from "@/lib/store";
import { useLang } from "@/components/ui/LangProvider";

type Status = "checking" | "signed-out" | "syncing" | "synced" | "error";

export default function CloudSyncBanner() {
  const { tr } = useLang();
  const [status, setStatus] = useState<Status>("checking");
  const [email, setEmail] = useState("");
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const sync = async (preferLocal = false) => {
    if (!isCloudConfigured()) return;
    setStatus("syncing");
    try {
      const user = await getCloudUser();
      if (!user) {
        setEmail("");
        setStatus("signed-out");
        return;
      }
      setEmail(user.email ?? "");
      let remote = await loadCloudState();
      const localState = readPatientState();
      const localPatients = Object.values(localState.patients);
      const localDevices = readDevices();

      if (preferLocal || remote.patients.length === 0) {
        await pushLocalStateToCloud(localPatients, localDevices);
        remote = await loadCloudState();
        if (remote.patients.length) hydratePatientsFromCloud(remote.patients, localState.activeSlug);
        if (remote.devices.length) hydrateDevicesFromCloud(remote.devices);
      } else {
        hydratePatientsFromCloud(remote.patients, localState.activeSlug);
        if (remote.devices.length) hydrateDevicesFromCloud(remote.devices);
        else await pushLocalStateToCloud([], localDevices);
      }

      if (remote.activity.length) {
        const items: ActivityItem[] = remote.activity.map((item) => ({
          id: item.id,
          type: item.type,
          title: item.title,
          detail: item.detail,
          time: formatTime(item.created_at),
          date: formatDate(item.created_at),
        }));
        replaceActivity(items);
      }

      setLastSync(new Date());
      setStatus("synced");
    } catch (error) {
      console.error("VITAL ID cloud sync failed", error);
      setStatus("error");
    }
  };

  useEffect(() => {
    if (!isCloudConfigured()) return;
    void sync();
    const refreshActivity = async () => {
      try {
        const remote = await loadCloudState();
        if (!remote.user || !remote.activity.length) return;
        const items: ActivityItem[] = remote.activity.map((item) => ({
          id: item.id,
          type: item.type,
          title: item.title,
          detail: item.detail,
          time: formatTime(item.created_at),
          date: formatDate(item.created_at),
        }));
        replaceActivity(items);
      } catch {}
    };
    const timer = window.setInterval(() => void refreshActivity(), 30000);
    return () => window.clearInterval(timer);
  }, []);

  if (!isCloudConfigured()) return null;

  if (status === "signed-out") {
    return <div className="max-w-md mx-auto px-5 pt-4"><div className="rounded-2xl border border-aubergine/20 bg-aubergine/5 p-3 flex items-center justify-between gap-3"><div className="flex items-center gap-2 min-w-0"><CloudOff size={17} className="text-aubergine shrink-0"/><div><p className="text-xs font-bold">{tr("Cloud sync is off", "المزامنة السحابية غير متصلة")}</p><p className="text-[10px] text-muted">{tr("Sign in so every QR sees the same live data.", "سجّل الدخول ليعرض كل QR نفس البيانات المحدثة.")}</p></div></div><Link href="/login" className="px-3 py-2 rounded-xl bg-ink text-bone text-[11px] font-bold shrink-0">{tr("Sign in", "دخول")}</Link></div></div>;
  }

  return <div className="max-w-md mx-auto px-5 pt-4"><div className={`rounded-2xl border p-3 flex items-center justify-between gap-3 ${status === "error" ? "border-coral/30 bg-coral/5" : "border-lime/40 bg-lime/10"}`}><div className="flex items-center gap-2 min-w-0">{status === "error" ? <CloudOff size={17} className="text-coral shrink-0"/> : <Cloud size={17} className="text-ink shrink-0"/>}<div className="min-w-0"><p className="text-xs font-bold truncate">{status === "syncing" || status === "checking" ? tr("Syncing cloud data…", "جارٍ مزامنة البيانات…") : status === "error" ? tr("Cloud sync needs attention", "المزامنة السحابية تحتاج مراجعة") : tr("Cloud synced", "تمت المزامنة السحابية")}</p><p className="text-[10px] text-muted truncate">{email || tr("VITAL ID owner", "مالك VITAL ID")}{lastSync && ` · ${lastSync.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}`}</p></div></div><div className="flex items-center gap-1"><button onClick={() => void sync(true)} className="w-8 h-8 rounded-lg bg-white/70 flex items-center justify-center" aria-label="Sync"><RefreshCw size={14} className={status === "syncing" ? "animate-spin" : ""}/></button><button onClick={async () => { await signOutCloud(); resetPatientData(); resetDevices(); replaceActivity([]); setStatus("signed-out"); setEmail(""); }} className="w-8 h-8 rounded-lg bg-white/70 flex items-center justify-center" aria-label="Sign out"><LogOut size={14}/></button></div></div></div>;
}
