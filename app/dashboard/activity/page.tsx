"use client";

import { useEffect, useState } from "react";
import { getActivity } from "@/lib/store";

export default function ActivityPage() {
  const [activity, setActivity] = useState<ReturnType<typeof getActivity>>([]);

  useEffect(() => {
    setActivity(getActivity());
  }, []);

  const grouped = activity.reduce<Record<string, typeof activity>>((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-md mx-auto px-5 pt-6">
      <h1 className="text-2xl font-bold mb-6">Access History</h1>
      {Object.keys(grouped).length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border hairline text-center">
          <p className="text-muted">No activity recorded yet.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, items]) => (
          <div key={date} className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted mb-3">{date}</p>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-xl p-4 border hairline flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    item.type === "scan" ? "bg-coral" : item.type === "access" ? "bg-aubergine" : "bg-lime"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-bold">{item.title}</p>
                    <p className="text-xs text-muted mt-0.5">{item.detail}</p>
                  </div>
                  <span className="text-[11px] text-muted shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
