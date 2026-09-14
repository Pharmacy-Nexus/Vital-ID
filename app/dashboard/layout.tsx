"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, FileText, FolderOpen, Watch, User } from "lucide-react";
import { LangToggle, useLang } from "@/components/ui/LangProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { tr } = useLang();
  const tabs = [
    { href: "/dashboard", icon: Home, label: tr("Home", "الرئيسية") },
    { href: "/dashboard/medical", icon: FileText, label: tr("Medical", "الطبي") },
    { href: "/dashboard/documents", icon: FolderOpen, label: tr("Documents", "المستندات") },
    { href: "/dashboard/devices", icon: Watch, label: tr("Devices", "الأجهزة") },
    { href: "/dashboard/family", icon: User, label: tr("Family", "العائلة") },
  ];

  return (
    <div className="min-h-screen bg-bone pb-24">
      <div className="fixed top-3 right-3 z-[70] bg-white/90 backdrop-blur border hairline rounded-full px-3 py-2 shadow-sm">
        <LangToggle />
      </div>
      {children}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t hairline z-50 pb-safe">
        <div className="max-w-md mx-auto flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link key={tab.href} href={tab.href} className="flex flex-col items-center gap-1 py-1 px-2">
                <tab.icon size={22} className={active ? "text-ink" : "text-muted/50"} />
                <span className={`text-[10px] font-bold ${active ? "text-ink" : "text-muted/50"}`}>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
