"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, FileText, FolderOpen, Watch, Users, Activity, Languages, ClipboardCheck } from "lucide-react";
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
    { href: "/dashboard/review", icon: ClipboardCheck, label: tr("Clinician updates", "تحديثات الطبيب") },
  ];

  const isActive = (href: string) => href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="vital-app-shell min-h-screen pb-24 lg:pb-0">
      <header className="vital-topbar hidden lg:block">
        <div className="vital-topbar-inner">
          <Link href="/" aria-label="VITAL ID home" className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/vital-logo.png" alt="VITAL ID" className="vital-topbar-logo" />
          </Link>

          <nav className="vital-topbar-nav" aria-label={tr("Dashboard navigation", "تنقل لوحة التحكم")}>
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`vital-nav-link ${isActive(tab.href) ? "active" : ""}`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 text-xs text-muted shrink-0">
            <Languages size={14} />
            <LangToggle />
          </div>
        </div>
      </header>

      <div className="lg:hidden fixed top-3 right-3 z-[70] bg-white/90 backdrop-blur border hairline rounded-full px-3 py-2">
        <LangToggle />
      </div>

      <CloudSyncBanner />
      <main>{children}</main>

      <nav className="lg:hidden vital-mobile-nav fixed bottom-0 left-0 right-0 z-50 pb-safe">
        <div className="max-w-md mx-auto grid grid-cols-5 items-center py-2">
          {tabs.slice(0, 5).map((tab) => (
            <Link key={tab.href} href={tab.href} className="flex flex-col items-center gap-1 py-1 px-1">
              <tab.icon size={20} className={isActive(tab.href) ? "text-lime" : "text-muted/45"} />
              <span className={`text-[9px] font-semibold text-center ${isActive(tab.href) ? "text-ink" : "text-muted/45"}`}>{tab.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
