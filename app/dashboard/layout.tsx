"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, FileText, FolderOpen, Watch, User } from "lucide-react";

const tabs = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/dashboard/medical", icon: FileText, label: "Medical" },
  { href: "/dashboard/documents", icon: FolderOpen, label: "Documents" },
  { href: "/dashboard/devices", icon: Watch, label: "Devices" },
  { href: "/dashboard/family", icon: User, label: "Family" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bone pb-24">
      {children}
      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t hairline z-50 pb-safe">
        <div className="max-w-md mx-auto flex items-center justify-around py-2">
          {tabs.map(tab => {
            const active = pathname === tab.href;
            return (
              <Link key={tab.href} href={tab.href} className="flex flex-col items-center gap-1 py-1 px-3">
                <tab.icon size={22} className={active ? "text-ink" : "text-muted/50"} />
                <span className={`text-[10px] font-bold ${active ? "text-ink" : "text-muted/50"}`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
