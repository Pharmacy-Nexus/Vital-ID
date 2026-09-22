"use client";

import { getActiveSlug, resetPatientData } from "@/lib/patientStore";
import { insertCloudActivity } from "@/lib/cloud/repository";

export type ActivityItem = { id:string; type:"scan"|"access"|"update"; title:string; detail:string; time:string; date:string };
export type ScanItem = { id:string; at:string; slug:string };
export type DoctorSession = { status:"active"|"ended"; startedAt:string; expiresAt:string };

const A="vital-id-activity", S="vital-id-scans", DS="vital-id-doctor-session";
const hasWindow = () => typeof window !== "undefined";
const read = <T,>(key:string, fallback:T):T => { if(!hasWindow()) return fallback; try { const v=localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
const write = (key:string, value:unknown) => { if(hasWindow()) localStorage.setItem(key, JSON.stringify(value)); };

export const formatTime = (v:string|number|Date) => new Date(v).toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
export const formatDate = (v:string|number|Date) => new Date(v).toLocaleDateString([], {day:"2-digit", month:"short", year:"numeric"});
export const getActivity = () => read<ActivityItem[]>(A, []);
export const replaceActivity = (items: ActivityItem[]) => write(A, items);
export const getScans = () => read<ScanItem[]>(S, []);
export function addActivity(input: Omit<ActivityItem,"id"|"time"|"date"> & Partial<Pick<ActivityItem,"id"|"time"|"date">>) {
  const now = new Date();
  const item: ActivityItem = { id:input.id ?? crypto.randomUUID(), type:input.type, title:input.title, detail:input.detail, time:input.time ?? formatTime(now), date:input.date ?? formatDate(now) };
  write(A, [item, ...getActivity()]);
  void insertCloudActivity(item.type, item.title, item.detail, getActiveSlug()).catch(() => {});
  return item;
}
export function recordScan(slug:string) {
  const scans=getScans(); const last=scans[0]; const now=Date.now();
  if(last && last.slug===slug && now-new Date(last.at).getTime()<30000) return;
  write(S,[{id:crypto.randomUUID(), at:new Date(now).toISOString(), slug},...scans]);
  addActivity({type:"scan",title:"Medical ID scanned",detail:slug});
}
export function startDoctorSession() { const started=new Date(); const expires=new Date(started.getTime()+20*60*1000); const s:DoctorSession={status:"active",startedAt:started.toISOString(),expiresAt:expires.toISOString()}; write(DS,s); addActivity({type:"access",title:"Healthcare access granted",detail:"20-minute session"}); return s; }
export function getDoctorSession():DoctorSession|null { const s=read<DoctorSession|null>(DS,null); if(!s) return null; if(s.status!=="active") return s; if(Date.now()>new Date(s.expiresAt).getTime()){ endDoctorSession(); return null; } return s; }
export function endDoctorSession(){ const s=read<DoctorSession|null>(DS,null); if(s){ write(DS,{...s,status:"ended"}); addActivity({type:"access",title:"Healthcare session ended",detail:"Access revoked"}); } }
export function resetDemo(){ if(!hasWindow()) return; [A,S,DS].forEach(k=>localStorage.removeItem(k)); resetPatientData(); }
