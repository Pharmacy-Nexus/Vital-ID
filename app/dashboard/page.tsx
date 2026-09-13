"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Clock, Activity } from "lucide-react";
import { omarHassan } from "@/data/demo/patients";
import Avatar from "@/components/ui/Avatar";
import IdentityMark from "@/components/ui/IdentityMark";
import { getActivity, getScans, formatTime, formatDate } from "@/lib/store";

export default function DashboardHome() {
  const [activity, setActivity] = useState<ReturnType<typeof getActivity>>([]);
  const [scans, setScans] = useState<ReturnType<typeof getScans>>([]);

  useEffect(() => {
    setActivity(getActivity());
    setScans(getScans());
  }, []);

  return (
    <div className="max-w-md mx-auto px-5 pt-6">
      {/* Profile header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Avatar name="Omar Hassan" color="#51405D" size={52} />
          <div>
            <h1 className="text-xl font-bold">Omar Hassan</h1>
            <p className="text-xs text-muted">Medical ID Active</p>
          </div>
        </div>
        <IdentityMark id="demo-001" className="text-ink/60" barClass="bg-ink/60" />
      </div>

      {/* Status cards */}
      <div className="space-y-3 mb-6">
        <div className="bg-white rounded-2xl p-5 border hairline">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold">Emergency Profile</span>
            <span className="text-lg font-bold text-lime">{omarHassan.emergencyProfile.completeness}%</span>
          </div>
          <div className="h-2 bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-lime rounded-full" style={{ width: `${omarHassan.emergencyProfile.completeness}%` }} />
          </div>
          <p className="text-[11px] text-muted mt-2">Complete</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border hairline">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold">Full Medical Record</span>
            <span className="text-lg font-bold text-aubergine">{omarHassan.recordCompleteness}%</span>
          </div>
          <div className="h-2 bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-aubergine rounded-full" style={{ width: `${omarHassan.recordCompleteness}%` }} />
          </div>
          <Link href="/dashboard/medical" className="text-[11px] font-bold text-aubergine mt-2 inline-block">
            Continue setup →
          </Link>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-ink text-bone rounded-2xl p-4">
          <Clock size={18} className="text-lime mb-2" />
          <p className="text-2xl font-bold">{omarHassan.lastConfirmation}</p>
          <p className="text-[11px] text-bone/50">Last medical confirmation</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border hairline">
          <ShieldCheck size={18} className="text-aubergine mb-2" />
          <p className="text-2xl font-bold">{omarHassan.linkedIds}</p>
          <p className="text-[11px] text-muted">Linked IDs</p>
        </div>
      </div>

      {/* Recent activity */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold">Recent activity</h2>
          <Link href="/dashboard/activity" className="text-xs font-bold text-aubergine">View all</Link>
        </div>
        {activity.length === 0 ? (
          <div className="bg-white rounded-2xl p-5 border hairline text-center">
            <Activity size={24} className="text-muted/40 mx-auto mb-2" />
            <p className="text-sm text-muted">No activity yet. Scan your Medical ID to see events here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activity.slice(0, 3).map(a => (
              <div key={a.id} className="bg-white rounded-xl p-4 border hairline flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-lime shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{a.title}</p>
                  <p className="text-[11px] text-muted">{a.detail}</p>
                </div>
                <span className="text-[11px] text-muted shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {scans.length > 0 && (
        <div className="bg-lime/10 border border-lime/30 rounded-2xl p-4 flex items-center gap-3">
          <ShieldCheck size={20} className="text-ink shrink-0" />
          <p className="text-sm font-bold">Medical ID scanned {scans.length} time{scans.length > 1 ? "s" : ""}</p>
        </div>
      )}
    </div>
  );
}
