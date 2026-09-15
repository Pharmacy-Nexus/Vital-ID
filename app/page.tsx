"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { LangToggle, useLang } from "@/components/ui/LangProvider";

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

function Rule({ className = "" }: { className?: string }) {
  return <div className={`editorial-rule ${className}`} />;
}

function SectionIndex({ n, label }: { n: string; label: string }) {
  return (
    <div className="section-index">
      <span>{n}</span>
      <span>{label}</span>
    </div>
  );
}

export default function Home() {
  const { tr, lang } = useLang();

  return (
    <main className="editorial-home">
      <header className="editorial-nav">
        <div className="editorial-shell nav-inner">
          <Link href="/" className="brand-image" aria-label="VITAL ID home">
            <Image
              src="/brand/vital-logo.png"
              alt="VITAL ID"
              width={753}
              height={675}
              priority
            />
          </Link>

          <div className="nav-center" aria-label="Primary navigation">
            <a href="#system">{tr("The system", "النظام")}</a>
            <a href="#privacy">{tr("Privacy", "الخصوصية")}</a>
            <a href="#objects">{tr("Objects", "المنتجات")}</a>
          </div>

          <div className="nav-actions">
            <LangToggle className="editorial-lang" />
            <Link href="/login" className="nav-signin">
              {tr("Sign in", "تسجيل الدخول")}
            </Link>
            <Link href="/activate" className="nav-cta">
              {tr("Get VITAL ID", "فعّل VITAL ID")}
              <ArrowUpRight size={15} strokeWidth={1.7} />
            </Link>
          </div>
        </div>
      </header>

      <section className="hero-editorial">
        <div className="editorial-shell">
          <div className="hero-meta-row">
            <span>{tr("PERSONAL MEDICAL ID", "هوية طبية شخصية")}</span>
            <span>NFC + QR</span>
            <span>VITAL / 001</span>
          </div>
          <Rule />

          <div className="hero-layout">
            <motion.div
              initial="hidden"
              animate="show"
              variants={rise}
              transition={{ duration: 0.65, ease: [0.2, 0.75, 0.2, 1] }}
              className="hero-copy"
            >
              <p className="hero-kicker">{tr("WHEN EVERY SECOND IS USEFUL", "لما كل ثانية تفرق")}</p>
              <h1>
                {tr("YOUR MEDICAL", "هويتك الطبية")}
                <br />
                <span>{tr("IDENTITY.", "معاك.")}</span>
                <br />
                {tr("WHEN WORDS CAN'T.", "حتى لو مش قادر تتكلم.")}
              </h1>

              <div className="hero-copy-bottom">
                <p>
                  {tr(
                    "A physical medical ID connected to the information you choose to share in an emergency — instantly, without an app.",
                    "هوية طبية فعلية مرتبطة بالمعلومات اللي إنت تختار تظهرها وقت الطوارئ — فورًا ومن غير تطبيق."
                  )}
                </p>
                <Link href="#system" className="text-link">
                  {tr("See how it works", "شوف بيشتغل إزاي")}
                  <span>↘</span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: [0.2, 0.75, 0.2, 1] }}
              className="hero-object"
            >
              <div className="object-note object-note-top">
                <span>01</span>
                <span>{tr("TAP", "المس")}</span>
              </div>
              <Image
                src="/brand/vital-card-black-front.png"
                width={1448}
                height={1086}
                alt="Black VITAL ID NFC medical card"
                className="hero-card"
                priority
              />
              <div className="object-note object-note-bottom">
                <span>{tr("YOUR ID", "هويتك")}</span>
                <span>{tr("YOUR DATA", "بياناتك")}</span>
                <span>{tr("YOUR CONTROL", "قرارك")}</span>
              </div>
            </motion.div>
          </div>

          <Rule />
          <div className="hero-footer-row">
            <span>{tr("TAP WITH NFC", "NFC باللمس")}</span>
            <span>{tr("SCAN WITH QR", "QR بالمسح")}</span>
            <span>{tr("NO APP REQUIRED", "من غير تطبيق")}</span>
          </div>
        </div>
      </section>

      <section id="system" className="system-section dark-section">
        <div className="editorial-shell">
          <SectionIndex n="01" label={tr("THE SYSTEM", "النظام")} />
          <Rule className="rule-light" />

          <div className="system-intro">
            <h2>{tr("ONE TAP.\nTHE RIGHT INFORMATION.", "لمسة واحدة.\nالمعلومة المهمة.")}</h2>
            <p>
              {tr(
                "VITAL ID does not store your medical record on the card. The card opens your secure medical identity, so the information can stay current while the physical ID stays the same.",
                "VITAL ID ما بيخزنش ملفك الطبي على الكارت نفسه. الكارت بيفتح هويتك الطبية الآمنة، فالمعلومات تفضل محدثة حتى لو الكارت نفسه ما اتغيرش."
              )}
            </p>
          </div>

          <div className="system-steps">
            <article>
              <div className="step-number">01</div>
              <div className="step-title">{tr("TAP / SCAN", "المس / امسح")}</div>
              <p>{tr("NFC or QR opens the emergency identity in the browser.", "NFC أو QR بيفتح هوية الطوارئ في المتصفح.")}</p>
            </article>
            <article>
              <div className="step-number">02</div>
              <div className="step-title">{tr("READ", "اقرأ")}</div>
              <p>{tr("Only the emergency information you selected appears publicly.", "بيظهر فقط اللي إنت اخترت إنه يظهر وقت الطوارئ.")}</p>
            </article>
            <article>
              <div className="step-number">03</div>
              <div className="step-title">{tr("REQUEST", "اطلب")}</div>
              <p>{tr("A clinician can request temporary access to the fuller record.", "مقدم الرعاية يقدر يطلب وصول مؤقت للملف الطبي الأشمل.")}</p>
            </article>
          </div>

          <div className="system-visual">
            <div className="system-card-wrap">
              <Image
                src="/brand/vital-card-white-back.png"
                width={1448}
                height={1086}
                alt="White VITAL ID card with NFC and QR"
                className="system-card"
              />
            </div>
            <div className="system-callout">
              <span className="callout-line" />
              <span>{tr("THE PHYSICAL ID NEVER NEEDS YOUR FULL MEDICAL FILE ON IT", "الكارت نفسه مش محتاج يحمل ملفك الطبي الكامل")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="emergency-section">
        <div className="editorial-shell">
          <SectionIndex n="02" label={tr("EMERGENCY VIEW", "واجهة الطوارئ")} />
          <Rule />

          <div className="emergency-layout">
            <div className="emergency-copy">
              <h2>{tr("WHAT MATTERS\nFIRST.", "الأهم\nأولًا.")}</h2>
              <p>
                {tr(
                  "The public emergency profile is intentionally short. It is designed to surface critical information quickly, not expose your full history.",
                  "ملف الطوارئ العام متعمد يكون مختصر. هدفه يطلع المعلومة الحرجة بسرعة، مش يكشف تاريخك الطبي كله."
                )}
              </p>
              <Link href="/id/demo-001" className="text-link dark-link">
                {tr("Open the live emergency demo", "افتح تجربة الطوارئ")}
                <ArrowUpRight size={16} strokeWidth={1.7} />
              </Link>
            </div>

            <div className="emergency-data" aria-label="Emergency data example">
              <div className="data-line lime-data">
                <span>{tr("BLOOD TYPE", "فصيلة الدم")}</span>
                <strong>O+</strong>
                <small>{tr("Patient reported", "إقرار المريض")}</small>
              </div>
              <div className="data-line coral-data">
                <span>{tr("CRITICAL ALLERGY", "حساسية خطيرة")}</span>
                <strong>Penicillin</strong>
                <small>{tr("Known reaction: breathing difficulty", "رد فعل معروف: صعوبة في التنفس")}</small>
              </div>
              <div className="data-line">
                <span>{tr("MAJOR CONDITIONS", "الحالات المهمة")}</span>
                <strong>Type 1 Diabetes / Asthma</strong>
              </div>
              <div className="data-line">
                <span>{tr("CRITICAL MEDICATION", "دواء مهم")}</span>
                <strong>Insulin Glargine</strong>
              </div>
              <div className="data-line contact-data">
                <span>{tr("EMERGENCY CONTACT", "جهة اتصال الطوارئ")}</span>
                <strong>Sara Hassan</strong>
                <small>{tr("Call immediately", "اتصال فوري")}</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="privacy" className="privacy-section">
        <div className="editorial-shell privacy-shell">
          <SectionIndex n="03" label={tr("CONTROL", "التحكم")} />
          <Rule className="rule-light" />
          <div className="privacy-grid">
            <div className="privacy-title">
              <h2>{tr("PUBLIC BY CHOICE.\nPRIVATE BY DEFAULT.", "العام باختيارك.\nوالباقي خاص.")}</h2>
            </div>

            <div className="privacy-columns">
              <div className="privacy-column public-column">
                <div className="privacy-label">{tr("EMERGENCY / PUBLIC", "الطوارئ / عام")}</div>
                <ul>
                  <li>{tr("Critical allergies", "الحساسية الحرجة")}</li>
                  <li>{tr("Major conditions", "الحالات المهمة")}</li>
                  <li>{tr("Critical medication", "الأدوية المهمة")}</li>
                  <li>{tr("Emergency contact", "جهة اتصال الطوارئ")}</li>
                </ul>
                <span className="status-dot lime-dot" />
              </div>

              <div className="privacy-column private-column">
                <div className="privacy-label">{tr("PROTECTED / PRIVATE", "محمي / خاص")}</div>
                <ul>
                  <li>{tr("Full medical history", "التاريخ الطبي الكامل")}</li>
                  <li>{tr("Reports & documents", "التقارير والمستندات")}</li>
                  <li>{tr("Lab & radiology files", "التحاليل والأشعات")}</li>
                  <li>{tr("Private notes", "البيانات الخاصة")}</li>
                </ul>
                <span className="status-dot aubergine-dot" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="objects" className="objects-section">
        <div className="editorial-shell">
          <SectionIndex n="04" label={tr("THE OBJECTS", "المنتجات")} />
          <Rule />
          <div className="objects-head">
            <h2>{tr("ONE IDENTITY.\nMORE THAN ONE WAY TO CARRY IT.", "هوية واحدة.\nوأكتر من طريقة تحملها.")}</h2>
            <p>
              {tr(
                "A card today. A bracelet or bag tag tomorrow. Every device can point to the same medical identity, with its own access rules.",
                "كارت النهارده، وسوار أو Tag بكرة. كل جهاز يقدر يرتبط بنفس الهوية الطبية وبصلاحياته الخاصة."
              )}
            </p>
          </div>

          <div className="product-gallery">
            <figure className="product-figure product-black">
              <Image src="/brand/vital-card-black-front.png" width={1448} height={1086} alt="Black VITAL ID card front" />
              <figcaption><span>01</span><span>{tr("BLACK / FRONT", "أسود / أمامي")}</span></figcaption>
            </figure>
            <figure className="product-figure product-white">
              <Image src="/brand/vital-card-white-back.png" width={1448} height={1086} alt="White VITAL ID card back with QR" />
              <figcaption><span>02</span><span>{tr("WHITE / EMERGENCY", "أبيض / طوارئ")}</span></figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="manifesto-section">
        <div className="editorial-shell">
          <div className="manifesto-grid">
            <div className="manifesto-word">{tr("CHILDREN", "الأطفال")}</div>
            <div className="manifesto-word">{tr("CHRONIC", "الحالات المزمنة")}</div>
            <div className="manifesto-word">{tr("OLDER ADULTS", "كبار السن")}</div>
            <div className="manifesto-word">{tr("EVERYDAY", "كل يوم")}</div>
          </div>
          <Rule />
          <div className="manifesto-copy">
            <p>{tr("Different lives. One need: the right information, available at the right moment.", "حالات مختلفة، واحتياج واحد: المعلومة الصح تكون موجودة في الوقت الصح.")}</p>
          </div>
        </div>
      </section>

      <section className="closing-section">
        <div className="editorial-shell closing-shell">
          <div className="closing-mark">V / ID</div>
          <h2>{tr("BE READY\nBEFORE YOU NEED IT.", "خليك جاهز\nقبل ما تحتاجه.")}</h2>
          <div className="closing-actions">
            <Link href="/activate" className="closing-primary">
              {tr("GET VITAL ID", "فعّل VITAL ID")}
              <ArrowUpRight size={18} strokeWidth={1.7} />
            </Link>
            <Link href="/login" className="closing-secondary">
              {tr("ALREADY HAVE ONE? SIGN IN", "عندك حساب؟ سجل الدخول")}
            </Link>
          </div>
        </div>
      </section>

      <footer className="editorial-footer">
        <div className="editorial-shell footer-inner">
          <div>VITAL ID</div>
          <div>{tr("A QUICKER WAY TO CARE", "طريق أسرع للرعاية")}</div>
          <div>© 2026</div>
        </div>
      </footer>
    </main>
  );
}
