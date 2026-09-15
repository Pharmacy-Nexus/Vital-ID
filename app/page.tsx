"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Baby,
  BadgeCheck,
  ChevronRight,
  CreditCard,
  FileText,
  HeartPulse,
  LockKeyhole,
  Radio,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  UserRound,
  Users,
} from "lucide-react";
import { LangToggle, useLang } from "@/components/ui/LangProvider";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

function BrandLockup({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="flex items-center gap-2.5" aria-label="VITAL ID">
      <div className={`relative h-9 w-9 overflow-hidden rounded-xl ${inverse ? "bg-white" : "bg-ink"}`}>
        <div className={`absolute left-[8px] top-[9px] h-[14px] w-[6px] rotate-[-38deg] rounded-full ${inverse ? "bg-ink" : "bg-white"}`} />
        <div className={`absolute left-[15px] top-[5px] h-[21px] w-[6px] rotate-[43deg] rounded-full ${inverse ? "bg-ink" : "bg-white"}`} />
        <span className="absolute right-[5px] top-[6px] h-[3px] w-[7px] rotate-[18deg] rounded-full bg-lime" />
        <span className="absolute right-[4px] top-[11px] h-[3px] w-[9px] rotate-[18deg] rounded-full bg-lime" />
      </div>
      <div className={`text-[17px] font-black tracking-[-0.04em] ${inverse ? "text-white" : "text-ink"}`}>
        VITAL <span className="font-medium">ID</span>
      </div>
    </div>
  );
}

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`mb-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] ${dark ? "text-lime" : "text-aubergine"}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-lime" />
      {children}
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  body,
  light = false,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <Eyebrow dark={light}>{eyebrow}</Eyebrow>
      <h2 className={`text-3xl font-black leading-[1.05] tracking-[-0.045em] sm:text-4xl md:text-5xl ${light ? "text-white" : "text-ink"}`}>{title}</h2>
      {body ? <p className={`mt-5 max-w-xl text-base leading-7 ${light ? "text-white/60" : "text-muted"}`}>{body}</p> : null}
    </div>
  );
}

export default function Home() {
  const { tr, lang } = useLang();

  const arrow = lang === "ar" ? "rotate-180" : "";

  return (
    <main className="min-h-screen overflow-x-hidden bg-bone text-ink">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-ink/5 bg-bone/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-5 md:px-8">
          <Link href="/" aria-label="VITAL ID home">
            <BrandLockup />
          </Link>

          <div className="hidden items-center gap-7 text-sm font-bold text-ink/70 lg:flex">
            <a className="transition-colors hover:text-ink" href="#how-it-works">{tr("How it works", "كيف يعمل")}</a>
            <a className="transition-colors hover:text-ink" href="#products">{tr("Products", "المنتجات")}</a>
            <a className="transition-colors hover:text-ink" href="#privacy">{tr("Privacy", "الخصوصية")}</a>
            <a className="transition-colors hover:text-ink" href="#who-it-is-for">{tr("Who it's for", "مناسب لمين")}</a>
          </div>

          <div className="flex items-center gap-3">
            <LangToggle className="hidden sm:block" />
            <Link href="/login" className="hidden text-sm font-bold text-ink/75 transition-colors hover:text-ink md:block">
              {tr("Sign in", "تسجيل الدخول")}
            </Link>
            <Link
              href="/activate"
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-ink px-4 text-sm font-black text-white transition-transform hover:-translate-y-0.5"
            >
              {tr("Get VITAL ID", "احصل على VITAL ID")}
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative isolate">
        <div className="hero-grid absolute inset-0 -z-10 opacity-45" />
        <div className="hero-glow absolute -right-40 -top-24 -z-10 h-[520px] w-[520px] rounded-full bg-lime/25 blur-[120px]" />
        <div className="mx-auto grid min-h-[760px] max-w-7xl items-center gap-10 px-5 pb-20 pt-16 md:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-4 lg:pb-24 lg:pt-20">
          <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.55 }} className="relative z-10 max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] shadow-sm backdrop-blur">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime/30 text-ink"><Radio size={14} /></span>
              {tr("NFC + QR medical identity", "هوية طبية بتقنية NFC + QR")}
            </div>

            <h1 className="max-w-[720px] text-[clamp(3.25rem,7vw,6.7rem)] font-black leading-[0.91] tracking-[-0.065em]">
              {tr("Your medical identity.", "هويتك الطبية.")}
              <span className="mt-2 block text-coral">{tr("One tap away.", "بلمسة واحدة.")}</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-ink/65 md:text-xl">
              {tr(
                "Give emergency responders the medical information you choose — instantly, without an app, while keeping the rest of your record protected.",
                "خلّي معلوماتك الطبية المهمة متاحة وقت الطوارئ فورًا، من غير تطبيق، وإنت اللي تختار إيه يظهر وإيه يفضل خاص."
              )}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/activate" className="group inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl bg-ink px-6 text-sm font-black text-white shadow-[0_18px_50px_rgba(22,23,27,.18)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(22,23,27,.24)]">
                {tr("Get your VITAL ID", "فعّل VITAL ID")}
                <ArrowRight size={17} className={`transition-transform group-hover:translate-x-1 ${arrow}`} />
              </Link>
              <Link href="/id/demo-001" className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border border-ink/15 bg-white/75 px-6 text-sm font-black text-ink backdrop-blur transition-colors hover:bg-white">
                <ScanLine size={17} />
                {tr("Try emergency demo", "جرّب صفحة الطوارئ")}
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-ink/55">
              <span className="inline-flex items-center gap-2"><BadgeCheck size={15} className="text-aubergine" />{tr("No app required", "بدون تطبيق")}</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-aubergine" />{tr("You control visibility", "إنت تتحكم في الخصوصية")}</span>
              <span className="inline-flex items-center gap-2"><Smartphone size={15} className="text-aubergine" />{tr("Works from any phone browser", "يعمل من متصفح أي موبايل")}</span>
            </div>
          </motion.div>

          {/* Product visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative mx-auto h-[510px] w-full max-w-[690px] sm:h-[610px] lg:h-[650px]"
          >
            <div className="absolute left-[2%] top-[8%] h-[86%] w-[96%] rounded-[48%] bg-lime/15 blur-3xl" />

            <motion.div
              animate={{ y: [0, -8, 0], rotate: [-8, -7, -8] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[2%] top-[8%] w-[78%] drop-shadow-[0_28px_35px_rgba(22,23,27,.12)] sm:left-[4%] sm:w-[73%]"
            >
              <Image src="/brand/vital-card-white-back.png" width={1448} height={1086} alt="White VITAL ID NFC and QR medical card" className="h-auto w-full" priority />
            </motion.div>

            <motion.div
              animate={{ y: [0, 9, 0], rotate: [7, 6, 7] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[8%] right-[-1%] w-[82%] drop-shadow-[0_36px_48px_rgba(22,23,27,.26)] sm:right-[0%] sm:w-[77%]"
            >
              <Image src="/brand/vital-card-black-front.png" width={1448} height={1086} alt="Black VITAL ID NFC medical card" className="h-auto w-full" priority />
            </motion.div>

            <div className="absolute bottom-[4%] left-[2%] w-[230px] rounded-[26px] border border-ink/10 bg-white/95 p-4 shadow-[0_28px_80px_rgba(22,23,27,.16)] backdrop-blur md:left-[0%] md:w-[255px]">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-aubergine">{tr("Emergency profile", "ملف الطوارئ")}</span>
                <span className="h-2 w-2 animate-pulse rounded-full bg-lime" />
              </div>
              <div className="rounded-2xl bg-coral/10 p-3">
                <div className="text-[10px] font-black uppercase tracking-[0.12em] text-coral">{tr("Critical allergy", "حساسية خطيرة")}</div>
                <div className="mt-1 text-lg font-black">Penicillin</div>
                <div className="mt-1 text-[11px] text-ink/55">{tr("Known reaction: breathing difficulty", "رد فعل معروف: صعوبة في التنفس")}</div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-lime/20 p-3"><div className="text-[9px] font-black uppercase text-ink/45">{tr("Blood type", "فصيلة الدم")}</div><div className="text-xl font-black">O+</div></div>
                <div className="rounded-xl bg-surface p-3"><div className="text-[9px] font-black uppercase text-ink/45">{tr("Condition", "حالة")}</div><div className="mt-1 text-xs font-black">Type 1 DM</div></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem / promise strip */}
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-[1.1fr_.9fr] md:px-8 md:py-20">
          <div>
            <Eyebrow dark>{tr("When seconds matter", "وقت كل ثانية بتفرق")}</Eyebrow>
            <h2 className="max-w-3xl text-3xl font-black leading-[1.05] tracking-[-0.04em] md:text-5xl">
              {tr("You may not be able to explain your medical story. Your ID can.", "ممكن وقت الطوارئ متقدرش تحكي تاريخك الطبي. هويتك تقدر.")}
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
            {[
              [HeartPulse, tr("Allergies & critical conditions", "الحساسية والحالات الحرجة")],
              [Activity, tr("Critical medications", "الأدوية المهمة")],
              [Users, tr("Emergency contact", "جهة اتصال الطوارئ")],
            ].map(([Icon, label], index) => {
              const IconComponent = Icon as typeof HeartPulse;
              return (
                <div key={index} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime text-ink"><IconComponent size={19} /></div>
                  <div className="text-sm font-black text-white/90">{label as string}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <SectionTitle
          eyebrow={tr("How it works", "كيف يعمل")}
          title={tr("From tap to useful information in seconds.", "من اللمسة للمعلومة المهمة في ثواني.")}
          body={tr("The emergency flow stays simple. Deeper medical information stays behind permission.", "مسار الطوارئ يفضل بسيط وسريع، والملف الطبي الكامل يفضل محمي بالصلاحيات.")}
        />

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            {
              n: "01",
              icon: Radio,
              title: tr("Tap or scan", "لمسة أو Scan"),
              body: tr("Use NFC or the QR code. No app installation and no emergency login.", "استخدم NFC أو QR. من غير تحميل تطبيق ومن غير تسجيل دخول وقت الطوارئ."),
            },
            {
              n: "02",
              icon: Smartphone,
              title: tr("See emergency data", "اعرض بيانات الطوارئ"),
              body: tr("Only the information selected for emergency visibility appears on the public profile.", "يظهر فقط اللي صاحب الهوية اختار إنه يكون متاح في الطوارئ."),
            },
            {
              n: "03",
              icon: LockKeyhole,
              title: tr("Request deeper access", "اطلب صلاحية أكبر"),
              body: tr("A healthcare professional can request temporary access to the fuller medical record.", "مقدم الرعاية الصحية يقدر يطلب وصول مؤقت للملف الطبي الأشمل."),
            },
          ].map((item, index) => (
            <motion.div
              key={item.n}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.08 }}
              className="group relative overflow-hidden rounded-[30px] border border-ink/10 bg-white p-6 md:p-8"
            >
              <div className="mb-12 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-lime"><item.icon size={22} /></div>
                <span className="text-xs font-black tracking-[0.2em] text-ink/25">{item.n}</span>
              </div>
              <h3 className="text-2xl font-black tracking-[-0.035em]">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{item.body}</p>
              <div className="absolute -bottom-16 -right-16 h-36 w-36 rounded-full bg-lime/0 blur-2xl transition-colors group-hover:bg-lime/30" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section id="products" className="bg-surface/65">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionTitle
              eyebrow={tr("Carry it your way", "خده معاك بطريقتك")}
              title={tr("One medical identity. Different ways to carry it.", "هوية طبية واحدة. بأكتر من شكل.")}
              body={tr("Your card, bracelet or future tag can all point to the same medical identity, with device-level controls.", "الكارت أو السوار أو التاج يقدروا كلهم يوصلوا لنفس هويتك الطبية، مع تحكم منفصل لكل جهاز.")}
            />
            <Link href="/activate" className="group inline-flex items-center gap-2 self-start text-sm font-black text-aubergine md:self-auto">
              {tr("Activate an ID", "فعّل هوية")}
              <ChevronRight size={17} className={`transition-transform group-hover:translate-x-1 ${arrow}`} />
            </Link>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
            <div className="relative min-h-[520px] overflow-hidden rounded-[34px] bg-ink p-6 text-white sm:p-10">
              <div className="relative z-10 max-w-sm">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-lime">VITAL ID CARD</div>
                <h3 className="mt-3 text-3xl font-black tracking-[-0.04em]">{tr("Built to be noticed when it matters.", "واضح وقت ما تحتاجه فعلًا.")}</h3>
                <p className="mt-4 text-sm leading-6 text-white/55">{tr("NFC tap plus QR fallback, linked to the medical profile you control.", "لمسة NFC مع QR كخيار احتياطي، مربوطين بالملف الطبي اللي إنت بتتحكم فيه.")}</p>
              </div>
              <motion.div whileHover={{ rotate: -2, scale: 1.015 }} className="absolute bottom-[-4%] right-[-5%] w-[88%] max-w-[700px] drop-shadow-[0_32px_50px_rgba(0,0,0,.38)]">
                <Image src="/brand/vital-card-black-back.png" width={1448} height={1086} alt="Black VITAL ID emergency medical card with NFC and QR" className="h-auto w-full" />
              </motion.div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              <div className="relative min-h-[250px] overflow-hidden rounded-[34px] border border-ink/10 bg-white p-6">
                <div className="relative z-10 max-w-[220px]">
                  <CreditCard size={22} className="text-aubergine" />
                  <h3 className="mt-4 text-xl font-black">{tr("Black or white", "أسود أو أبيض")}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{tr("Same identity, same emergency flow — different look.", "نفس الهوية ونفس تجربة الطوارئ، بشكل مختلف.")}</p>
                </div>
                <div className="absolute -bottom-12 -right-16 w-[82%] rotate-[-8deg]">
                  <Image src="/brand/vital-card-white-front.png" width={1448} height={1086} alt="White VITAL ID card" className="h-auto w-full" />
                </div>
              </div>

              <div className="rounded-[34px] bg-lime p-7 text-ink">
                <Radio size={25} />
                <h3 className="mt-12 text-2xl font-black tracking-[-0.035em]">{tr("More form factors later.", "أشكال أكتر بعدين.")}</h3>
                <p className="mt-3 text-sm leading-6 text-ink/65">{tr("Bracelet, child bag tag and additional IDs can share one patient profile without duplicating the medical record.", "السوار، تاج شنطة الطفل، وأي ID إضافي يقدروا يشاركوا نفس ملف المريض من غير تكرار البيانات.")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy split */}
      <section id="privacy" className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <SectionTitle
            eyebrow={tr("Privacy by design", "الخصوصية من البداية")}
            title={tr("You choose what a stranger sees. The rest stays protected.", "إنت تختار الغريب يشوف إيه. والباقي يفضل محمي.")}
            body={tr("Emergency visibility is separate from the private medical record, so a public scan does not mean public access to everything.", "بيانات الطوارئ منفصلة عن الملف الطبي الخاص، فمجرد Scan عام مش معناه إن كل تاريخك الطبي بقى ظاهر.")}
            light
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.05] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-lime px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-ink">{tr("Emergency visible", "ظاهر في الطوارئ")}</span>
                <ScanLine size={21} className="text-lime" />
              </div>
              <div className="mt-8 space-y-3">
                {[
                  tr("Critical allergies", "الحساسيات الخطيرة"),
                  tr("Important conditions", "الحالات المهمة"),
                  tr("Critical medications", "الأدوية الحرجة"),
                  tr("Emergency contact", "جهة اتصال الطوارئ"),
                ].map((x) => <div key={x} className="flex items-center gap-3 rounded-2xl bg-black/20 px-4 py-3 text-sm font-bold"><span className="h-2 w-2 rounded-full bg-lime" />{x}</div>)}
              </div>
            </div>

            <div className="rounded-[32px] border border-aubergine/60 bg-aubergine/30 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white">{tr("Protected record", "ملف محمي")}</span>
                <LockKeyhole size={21} className="text-white" />
              </div>
              <div className="mt-8 space-y-3">
                {[
                  tr("Full medical timeline", "التاريخ الطبي الكامل"),
                  tr("Labs & radiology", "التحاليل والأشعات"),
                  tr("Uploaded documents", "المستندات المرفوعة"),
                  tr("Temporary clinician access", "وصول مؤقت للطبيب"),
                ].map((x) => <div key={x} className="flex items-center gap-3 rounded-2xl bg-black/15 px-4 py-3 text-sm font-bold text-white/85"><ShieldCheck size={15} className="text-lime" />{x}</div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More than a card */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <SectionTitle
          eyebrow={tr("More than a card", "أكتر من كارت")}
          title={tr("The card is the key. Your medical identity is the product.", "الكارت هو المفتاح. هويتك الطبية هي المنتج الحقيقي.")}
          body={tr("Build and maintain one medical profile, keep documents together, manage family members and see how your IDs are being used.", "ملف طبي واحد يتحدث معاك، مستنداتك في مكان واحد، أفراد الأسرة، وسجل استخدام الـIDs.")}
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [FileText, tr("Medical record", "السجل الطبي"), tr("Conditions, medications, allergies and medical history.", "الأمراض، الأدوية، الحساسية والتاريخ الطبي.")],
            [Stethoscope, tr("Clinician access", "وصول الطبيب"), tr("Temporary access when deeper context is needed.", "وصول مؤقت لما الطبيب يحتاج تفاصيل أكتر.")],
            [Users, tr("Family profiles", "ملفات الأسرة"), tr("Manage a child or someone you care for from one account.", "إدارة طفل أو شخص بتعتني بيه من نفس الحساب.")],
            [Activity, tr("Activity history", "سجل النشاط"), tr("See scans and important access events in one place.", "تابع عمليات المسح وأحداث الوصول المهمة.")],
          ].map(([Icon, title, body]) => {
            const IconComponent = Icon as typeof FileText;
            return (
              <div key={title as string} className="rounded-[28px] border border-ink/10 bg-white p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface text-aubergine"><IconComponent size={20} /></div>
                <h3 className="mt-7 text-lg font-black">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{body as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Who it is for */}
      <section id="who-it-is-for" className="border-y border-ink/8 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <SectionTitle
            eyebrow={tr("Designed for real life", "مصمم للحياة الحقيقية")}
            title={tr("One idea. Different people, different needs.", "فكرة واحدة. ناس مختلفة واحتياجات مختلفة.")}
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              [UserRound, tr("For you", "ليك"), tr("Keep important medical information accessible when you cannot explain it yourself.", "خلي أهم معلوماتك الطبية متاحة لو في وقت مش قادر تشرحها بنفسك.")],
              [Baby, tr("For children", "للأطفال"), tr("A guardian-managed profile for allergies, asthma and emergency contact information.", "ملف يديره ولي الأمر للحساسية والربو وبيانات التواصل في الطوارئ.")],
              [HeartPulse, tr("For chronic conditions", "للحالات المزمنة"), tr("Make important conditions and critical medication easier to identify quickly.", "خلّي الحالات المهمة والأدوية الحرجة أوضح وأسرع في الوصول.")],
              [Users, tr("For older adults", "لكبار السن"), tr("A clearer way to carry medications, conditions and a family contact.", "طريقة أوضح لحمل معلومات الأدوية والأمراض وجهة اتصال من الأسرة.")],
            ].map(([Icon, title, body]) => {
              const IconComponent = Icon as typeof UserRound;
              return (
                <div key={title as string} className="group rounded-[28px] bg-bone p-6 transition-transform hover:-translate-y-1">
                  <IconComponent size={22} className="text-aubergine" />
                  <h3 className="mt-10 text-xl font-black tracking-[-0.03em]">{title as string}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{body as string}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service model / CTA */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="overflow-hidden rounded-[38px] bg-coral text-white">
          <div className="grid items-center gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_.75fr] lg:p-14">
            <div>
              <Eyebrow dark>{tr("Start with the ID", "ابدأ بالـID")}</Eyebrow>
              <h2 className="max-w-2xl text-3xl font-black leading-[1.02] tracking-[-0.045em] md:text-5xl">
                {tr("Be ready before you need it.", "خليك جاهز قبل ما تحتاجه.")}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/75">
                {tr("Activate a VITAL ID, build your medical profile, then decide what each NFC or QR device is allowed to show.", "فعّل VITAL ID، ابنِ ملفك الطبي، وبعدها حدد كل كارت أو جهاز NFC/QR مسموح له يعرض إيه.")}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/activate" className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-black text-ink">
                  {tr("Get VITAL ID", "فعّل VITAL ID")}
                  <ArrowRight size={17} className={`transition-transform group-hover:translate-x-1 ${arrow}`} />
                </Link>
                <Link href="/login" className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-white/35 px-6 text-sm font-black text-white">
                  {tr("Already have one? Sign in", "عندك ID بالفعل؟ سجل دخول")}
                </Link>
              </div>
            </div>

            <div className="relative hidden min-h-[320px] lg:block">
              <div className="absolute left-[-6%] top-[4%] w-[85%] rotate-[-8deg] drop-shadow-[0_30px_35px_rgba(100,28,20,.22)]">
                <Image src="/brand/vital-card-white-front.png" width={1448} height={1086} alt="White VITAL ID card" className="h-auto w-full" />
              </div>
              <div className="absolute bottom-[-22%] right-[-14%] w-[85%] rotate-[12deg] drop-shadow-[0_30px_35px_rgba(100,28,20,.35)]">
                <Image src="/brand/vital-card-black-front.png" width={1448} height={1086} alt="Black VITAL ID card" className="h-auto w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink/10 bg-bone">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1.2fr_.8fr] md:px-8">
          <div>
            <BrandLockup />
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted">{tr("A quicker way to care — your medical identity when every second matters.", "طريقة أسرع للرعاية — هويتك الطبية لما كل ثانية تفرق.")}</p>
          </div>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-ink/35">{tr("Product", "المنتج")}</div>
              <a href="#how-it-works" className="block font-bold text-ink/70 hover:text-ink">{tr("How it works", "كيف يعمل")}</a>
              <a href="#privacy" className="block font-bold text-ink/70 hover:text-ink">{tr("Privacy", "الخصوصية")}</a>
              <Link href="/id/demo-001" className="block font-bold text-ink/70 hover:text-ink">{tr("Emergency demo", "تجربة الطوارئ")}</Link>
            </div>
            <div className="space-y-3">
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-ink/35">{tr("Account", "الحساب")}</div>
              <Link href="/login" className="block font-bold text-ink/70 hover:text-ink">{tr("Sign in", "تسجيل الدخول")}</Link>
              <Link href="/activate" className="block font-bold text-ink/70 hover:text-ink">{tr("Activate ID", "تفعيل ID")}</Link>
              <Link href="/dashboard" className="block font-bold text-ink/70 hover:text-ink">{tr("Dashboard", "لوحة التحكم")}</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-ink/10 px-5 py-5 text-center text-[11px] font-bold text-ink/35 md:px-8">
          © 2026 VITAL ID · {tr("A quicker way to care", "طريقة أسرع للرعاية")}
        </div>
      </footer>
    </main>
  );
}
