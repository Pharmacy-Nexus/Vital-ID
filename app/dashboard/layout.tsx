"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, FileText, FolderOpen, Watch, Users, Activity, Languages } from "lucide-react";
import { LangToggle, useLang } from "@/components/ui/LangProvider";
import CloudSyncBanner from "@/components/cloud/CloudSyncBanner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { tr } = useLang();

  const tabs = [
    { href: "/dashboard", icon: Home, label: tr("Overview", "الرئيسية") },
    { href: "/dashboard/medical", icon: FileText, label: tr("Medical record", "السجل الطبي") },
    { href: "/dashboard/documents", icon: FolderOpen, label: tr("Documents", "المستندات") },
    { href: "/dashboard/devices", icon: Watch, label: tr("IDs & QR", "الأجهزة وQR") },
    { href: "/dashboard/family", icon: Users, label: tr("Family", "العائلة") },
    { href: "/dashboard/activity", icon: Activity, label: tr("Activity", "النشاط") },
  ];

  const isActive = (href: string) => href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-bone text-ink">
      <aside className="hidden lg:flex fixed inset-y-0 start-0 z-50 w-[260px] border-e border-ink/10 bg-[#efebe1] flex-col">
        <div className="px-7 pt-7 pb-6 border-b border-ink/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/vital-logo.png" alt="VITAL ID" className="h-12 w-auto object-contain object-start" />
          <p className="mt-3 text-[10px] tracking-[0.18em] uppercase text-muted">{tr("Personal medical identity", "الهوية الطبية الشخصية")}</p>
        </div>

        <nav className="p-4 space-y-1.5 flex-1">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`group flex items-center gap-3 min-h-[46px] px-4 border transition-colors ${
                isActive(tab.href)
                  ? "bg-ink text-bone border-ink"
                  : "border-transparent text-ink/65 hover:text-ink hover:border-ink/15 hover:bg-white/60"
              }`}
            >
              <tab.icon size={18} className={isActive(tab.href) ? "text-lime" : "text-current"} />
              <span className="text-sm font-semibold">{tab.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-5 border-t border-ink/10">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-2"><Languages size={15} />{tr("Language", "اللغة")}</span>
            <LangToggle />
          </div>
        </div>
      </aside>

      <div className="lg:ps-[260px] min-h-screen pb-24 lg:pb-0">
        <div className="lg:hidden fixed top-3 right-3 z-[70] bg-white/90 backdrop-blur border hairline rounded-full px-3 py-2 shadow-sm">
          <LangToggle />
        </div>
        <CloudSyncBanner />
        <main>{children}</main>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t hairline z-50 pb-safe">
        <div className="max-w-md mx-auto grid grid-cols-5 items-center py-2">
          {tabs.slice(0, 5).map((tab) => (
            <Link key={tab.href} href={tab.href} className="flex flex-col items-center gap-1 py-1 px-1">
              <tab.icon size={21} className={isActive(tab.href) ? "text-ink" : "text-muted/45"} />
              <span className={`text-[9px] font-bold text-center ${isActive(tab.href) ? "text-ink" : "text-muted/45"}`}>{tab.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
