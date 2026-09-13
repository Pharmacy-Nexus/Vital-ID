"use client";
import { useEffect,useState } from "react";
import { AlertTriangle, Phone, MapPin, Stethoscope } from "lucide-react";
import { PatientProfile } from "@/lib/types";
import { recordScan, addActivity } from "@/lib/store";
import IdentityMark from "@/components/ui/IdentityMark";
import DemoTag from "@/components/ui/DemoTag";

export default function EmergencyView({patient,onRequestDoctor}:{patient:PatientProfile;deviceType?:string;onRequestDoctor:()=>void}){
  const [msg,setMsg]=useState("");
  useEffect(()=>{recordScan(patient.slug)},[patient.slug]);
  const contact=patient.emergencyContacts[0];
  const share=()=>{ if(!navigator.geolocation){setMsg("Location is not supported on this device.");return;} navigator.geolocation.getCurrentPosition(()=>{setMsg("Location shared in demo.");addActivity({type:"access",title:"Location shared",detail:patient.slug})},()=>setMsg("Location permission was denied.")); };
  return <div className="min-h-screen bg-bone pb-28">
    <header className="bg-ink text-bone px-5 py-5"><div className="max-w-md mx-auto flex items-center justify-between"><div><p className="text-[10px] tracking-[.22em] uppercase text-lime font-bold">Emergency Medical ID</p><h1 className="text-2xl font-bold mt-1">{patient.firstName} {patient.lastName}</h1><p className="text-sm text-bone/60">Age {patient.age} · Blood type {patient.bloodType}</p></div><IdentityMark id={patient.slug} className="text-lime" barClass="bg-lime"/></div></header>
    <main className="max-w-md mx-auto px-5 py-5 space-y-4">
      {patient.allergies.map(a=><section key={a.id} className="rounded-2xl border border-coral/30 bg-coral/10 p-5"><div className="flex items-center gap-2 text-coral font-bold text-sm"><AlertTriangle size={18}/>Critical Allergy</div><p className="text-2xl font-bold mt-2">{a.allergen}</p><p className="text-sm text-muted mt-1"><b>Known reaction:</b> {a.reaction}</p></section>)}
      <section className="bg-white rounded-2xl p-5 border hairline"><h2 className="text-xs uppercase tracking-wider font-bold text-muted mb-3">Major conditions</h2>{patient.conditions.filter(c=>c.status==="active").map(c=><p key={c.id} className="font-bold py-1">{c.name}</p>)}</section>
      <section className="bg-white rounded-2xl p-5 border hairline"><h2 className="text-xs uppercase tracking-wider font-bold text-muted mb-3">Critical medication</h2>{patient.medications.length?patient.medications.map(m=><p key={m.id} className="font-bold py-1">{m.name} <span className="font-normal text-muted text-sm">· {m.dosage}</span></p>):<p className="text-sm text-muted">No critical medication recorded.</p>}</section>
      {contact&&<section className="bg-white rounded-2xl p-5 border hairline"><h2 className="text-xs uppercase tracking-wider font-bold text-muted mb-2">Emergency contact</h2><p className="font-bold">{contact.name} · {contact.relationship}</p><p className="text-sm text-muted">{contact.phone}</p></section>}
      {msg&&<p className="text-sm text-center text-muted">{msg}</p>}
      <button onClick={share} className="w-full min-h-[48px] rounded-2xl border-2 border-ink font-bold flex items-center justify-center gap-2"><MapPin size={18}/>Share my location</button>
      <button onClick={onRequestDoctor} className="w-full min-h-[48px] rounded-2xl bg-aubergine text-white font-bold flex items-center justify-center gap-2"><Stethoscope size={18}/>I’m a healthcare professional</button>
    </main>
    {contact&&<a href={`tel:${contact.phone}`} className="fixed bottom-4 left-4 right-4 max-w-md mx-auto min-h-[52px] rounded-2xl bg-coral text-white font-bold flex items-center justify-center gap-2 shadow-lg"><Phone size={18}/>Call emergency contact</a>}
    <DemoTag/>
  </div>
}
