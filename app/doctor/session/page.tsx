"use client";

import { useEffect, useState } from "react";
import { getDoctorSession, endDoctorSession, formatTime } from "@/lib/store";

export default function DoctorSessionPage() {
  const [session, setSession] = useState<ReturnType<typeof getDoctorSession>>(null);

  useEffect(() => {
    setSession(getDoctorSession());
  }, []);

  if (!session || session.status !== "active") {
    return (
      <div className="min-h-screen bg-bone flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold mb-2">No active session</h1>
        <p className="text-muted mb-8">Healthcare sessions require patient authorization.</p>
        <a href="/id/demo-001" className="min-h-[48px] px-8 rounded-2xl bg-ink text-bone font-bold text-sm flex items-center">
          Request access
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Active Healthcare Session</h1>
      <div className="bg-white rounded-2xl p-6 border hairline mb-6 w-full max-w-sm">
        <p className="text-sm text-muted">Started</p>
        <p className="font-bold mb-3">{formatTime(session.startedAt)}</p>
        <p className="text-sm text-muted">Expires</p>
        <p className="font-bold">{formatTime(session.expiresAt)}</p>
      </div>
      <button
        onClick={() => { endDoctorSession(); setSession(null); }}
        className="min-h-[48px] px-8 rounded-2xl bg-coral text-white font-bold text-sm"
      >
        End session
      </button>
    </div>
  );
}
