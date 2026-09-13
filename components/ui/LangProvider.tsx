"use client";
import { createContext,useContext,useState } from "react";
const dict={en:{tagline:"Your medical identity, ready in an emergency.",openEmergency:"Open emergency ID",copyLink:"Copy link"},ar:{tagline:"هويتك الطبية جاهزة وقت الطوارئ.",openEmergency:"افتح هوية الطوارئ",copyLink:"انسخ الرابط"}};
const C=createContext({lang:"en" as "en"|"ar",setLang:(_l:"en"|"ar")=>{},t:dict.en});
export function LangProvider({children}:{children:React.ReactNode}){const [lang,setLang]=useState<"en"|"ar">("en"); return <C.Provider value={{lang,setLang,t:dict[lang]}}><div dir={lang==="ar"?"rtl":"ltr"}>{children}</div></C.Provider>}
export const useLang=()=>useContext(C);
export function LangToggle(){const {lang,setLang}=useLang(); return <button onClick={()=>setLang(lang==="en"?"ar":"en")} className="text-xs font-bold underline underline-offset-4">{lang==="en"?"العربية":"English"}</button>}
