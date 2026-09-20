"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
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
  const [selectedProduct, setSelectedProduct] = useState("card-black");

  const products = [
    {
      id: "card-black",
      index: "01",
      name: tr("VITAL ID Card", "كارت VITAL ID"),
      variant: tr("Black / everyday carry", "أسود / للاستخدام اليومي"),
      image: "/campaign/card-black-angle.png",
      imageWidth: 1254,
      imageHeight: 1254,
      title: tr("DISCREET. READY. ALWAYS WITH YOU.", "هادئ في شكله. جاهز وقت الحاجة."),
      description: tr(
        "A wallet-size medical identity for adults who want something discreet. Tap with NFC or scan the QR to open the same live emergency profile.",
        "هوية طبية بحجم كارت المحفظة للكبار اللي عايزين شكل هادي وعملي. لمسة NFC أو مسح QR يفتح نفس ملف الطوارئ المحدث."
      ),
      bestFor: [tr("Adults", "الكبار"), tr("Everyday carry", "الاستخدام اليومي"), tr("Travel", "السفر")],
      features: [
        tr("NFC + QR access", "وصول بـ NFC + QR"),
        tr("Fits a standard wallet", "مقاس مناسب للمحفظة"),
        tr("Linked to your live medical identity", "مرتبط بهويتك الطبية المحدثة")
      ],
      tone: "black"
    },
    {
      id: "card-white",
      index: "02",
      name: tr("VITAL ID Card", "كارت VITAL ID"),
      variant: tr("White / high visibility", "أبيض / وضوح أعلى"),
      image: "/campaign/card-white-clean.png",
      imageWidth: 1254,
      imageHeight: 1254,
      title: tr("BUILT TO BE NOTICED IN AN EMERGENCY.", "واضح من أول نظرة وقت الطوارئ."),
      description: tr(
        "The high-visibility version puts the emergency purpose, NFC cue and QR front and center — useful when speed and clarity matter more than discretion.",
        "النسخة الأكثر وضوحًا بتبرز وظيفة الطوارئ وإشارة NFC والـQR من أول نظرة — لما السرعة والوضوح أهم من الشكل الهادئ."
      ),
      bestFor: [tr("Emergency visibility", "وضوح الطوارئ"), tr("Older adults", "كبار السن"), tr("Caregivers", "مقدمي الرعاية")],
      features: [
        tr("Clear emergency labeling", "تعريف واضح للطوارئ"),
        tr("NFC + QR access", "وصول بـ NFC + QR"),
        tr("Same secure medical identity", "نفس الهوية الطبية الآمنة")
      ],
      tone: "white"
    },
    {
      id: "wristband-black",
      index: "03",
      name: tr("VITAL ID Wristband", "سوار VITAL ID"),
      variant: tr("Black / always-on wearable", "أسود / قابل للارتداء طوال الوقت"),
      image: "/brand/vital-wristband-black.png",
      imageWidth: 1254,
      imageHeight: 1254,
      title: tr("ON YOUR WRIST. NOT LEFT IN A WALLET.", "على إيدك. مش متنسي في محفظة."),
      description: tr(
        "A wearable option for people who benefit from having their medical ID physically visible and easy to reach. The QR remains a fallback when NFC is not used.",
        "اختيار قابل للارتداء للي محتاجين هويتهم الطبية تكون ظاهرة وسهلة الوصول. والـQR يفضل وسيلة بديلة لو NFC مش مستخدم."
      ),
      bestFor: [tr("Chronic conditions", "الحالات المزمنة"), tr("Older adults", "كبار السن"), tr("Active days", "الحركة اليومية")],
      features: [
        tr("Wearable medical ID", "هوية طبية قابلة للارتداء"),
        tr("NFC + visible QR", "NFC + QR ظاهر"),
        tr("Connects to the same profile as your card", "يرتبط بنفس ملف الكارت")
      ],
      tone: "black"
    },
    {
      id: "wristband-kids",
      index: "04",
      name: tr("VITAL ID Kids Wristband", "سوار VITAL ID للأطفال"),
      variant: tr("White + green / friendly visibility", "أبيض وأخضر / واضح ومريح بصريًا"),
      image: "/brand/vital-wristband-kids.png",
      imageWidth: 1254,
      imageHeight: 1254,
      title: tr("MADE TO SPEAK WHEN A CHILD CAN'T EXPLAIN.", "بيتكلم بدل الطفل لما مايعرفش يشرح."),
      description: tr(
        "A child-friendly wearable concept for allergies, chronic conditions, school days and outings. A guardian controls the medical profile and decides what is public in an emergency.",
        "تصميم مناسب للأطفال للحساسية، الحالات المزمنة، المدرسة والخروجات. ولي الأمر هو اللي يدير الملف ويحدد إيه يظهر وقت الطوارئ."
      ),
      bestFor: [tr("Children", "الأطفال"), tr("Severe allergies", "الحساسية الشديدة"), tr("School & outings", "المدرسة والخروجات")],
      features: [
        tr("Guardian-managed profile", "ملف يديره ولي الأمر"),
        tr("NFC + visible QR", "NFC + QR ظاهر"),
        tr("Emergency information by choice", "بيانات الطوارئ حسب اختيار الأسرة")
      ],
      tone: "kids"
    }
  ];

  const activeProduct = products.find((product) => product.id === selectedProduct) ?? products[0];

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
            <a href="#experience">{tr("Experience", "التجربة")}</a>
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
                src="/campaign/card-black-hero.png"
                width={1254}
                height={1254}
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

      <section id="experience" className="campaign-experience">
        <div className="campaign-transition" aria-hidden="true" />
        <div className="editorial-shell campaign-experience-head">
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease: [0.2, 0.75, 0.2, 1] }}
            className="campaign-experience-copy"
          >
            <span className="campaign-eyebrow">VITAL ID / 00</span>
            <h2>{tr("SEE THE MOMENT\nBEFORE IT MATTERS.", "شوف اللحظة\nقبل ما تحتاجها.")}</h2>
            <p>
              {tr(
                "The card is only the key. Tap or scan, and the emergency identity opens instantly in the browser — while the fuller medical record stays protected.",
                "الكارت هو المفتاح بس. لمسة أو مسح يفتح هوية الطوارئ فورًا في المتصفح — بينما الملف الطبي الكامل يفضل محمي."
              )}
            </p>
          </motion.div>

          <motion.div
            className="campaign-lineup-wrap"
            initial={{ opacity: 0, scale: 0.94, y: 44 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.2, 0.75, 0.2, 1] }}
          >
            <Image
              src="/campaign/card-lineup.png"
              width={1122}
              height={1402}
              alt="Black and white VITAL ID medical cards"
              className="campaign-lineup"
            />
          </motion.div>
        </div>

        <motion.div
          className="cinematic-shell"
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.9, ease: [0.2, 0.75, 0.2, 1] }}
        >
          <div className="cinematic-topline">
            <span>{tr("THE VITAL ID FILM", "فيلم VITAL ID")}</span>
            <span>{tr("NFC → EMERGENCY PROFILE", "NFC ← ملف الطوارئ")}</span>
          </div>
          <div className="cinematic-frame">
            <iframe
              src="/cinematic/index.html?loop=1&controls=0&autoplay=1"
              title="VITAL ID cinematic product experience"
              loading="lazy"
              allow="autoplay; fullscreen"
            />
            <div className="cinematic-glass" aria-hidden="true" />
          </div>
        </motion.div>
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
                src="/campaign/card-white-angle.png"
                width={1254}
                height={1254}
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

      <section className="campaign-gallery-section">
        <div className="editorial-shell">
          <div className="campaign-gallery-head">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.65 }}
            >
              <span className="campaign-gallery-kicker">{tr("THE OBJECT IN YOUR POCKET", "الهوية اللي معاك")}</span>
              <h2>{tr("BLACK OR WHITE.\nTHE SAME MEDICAL IDENTITY.", "أسود أو أبيض.\nنفس الهوية الطبية.")}</h2>
            </motion.div>
            <p>
              {tr(
                "Choose the physical style that fits you. Both connect to the same live profile, the same emergency view and the same protected record.",
                "اختار الشكل اللي يناسبك. الاتنين بيوصلوا لنفس الملف المحدث، ونفس واجهة الطوارئ، ونفس السجل المحمي."
              )}
            </p>
          </div>

          <div className="campaign-photo-grid">
            <motion.figure
              className="campaign-photo campaign-photo-dark campaign-photo-wide"
              initial={{ opacity: 0, x: -36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.75, ease: [0.2, 0.75, 0.2, 1] }}
            >
              <Image src="/campaign/card-black-angle.png" width={1254} height={1254} alt="Black VITAL ID emergency medical card" />
              <figcaption>
                <span>{tr("BLACK / DISCREET", "أسود / هادي")}</span>
                <strong>{tr("Made to live in your wallet.", "مصمم يفضل في محفظتك.")}</strong>
              </figcaption>
            </motion.figure>

            <motion.figure
              className="campaign-photo campaign-photo-light"
              initial={{ opacity: 0, y: 42 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.75, delay: 0.08, ease: [0.2, 0.75, 0.2, 1] }}
            >
              <Image src="/campaign/card-white-clean.png" width={1254} height={1254} alt="White VITAL ID emergency medical card" />
              <figcaption>
                <span>{tr("WHITE / VISIBLE", "أبيض / واضح")}</span>
                <strong>{tr("Easy to recognize when seconds count.", "سهل يتعرف عليه وقت ما الثواني تفرق.")}</strong>
              </figcaption>
            </motion.figure>

            <motion.figure
              className="campaign-photo campaign-photo-light"
              initial={{ opacity: 0, x: 36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.75, delay: 0.14, ease: [0.2, 0.75, 0.2, 1] }}
            >
              <Image src="/campaign/card-white-angle.png" width={1254} height={1254} alt="Angled white VITAL ID medical card" />
              <figcaption>
                <span>NFC + QR</span>
                <strong>{tr("Two ways in. One live identity.", "طريقتين للوصول. هوية واحدة محدثة.")}</strong>
              </figcaption>
            </motion.figure>
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

          <div className="product-instruction">
            <span>{tr("SELECT AN OBJECT", "اختار المنتج")}</span>
            <span>{tr("Tap any product to open its story", "اضغط على أي منتج عشان تشوف فكرته واستخدامه")}</span>
          </div>

          <div className="product-selector" role="tablist" aria-label={tr("VITAL ID products", "منتجات VITAL ID")}>
            {products.map((product) => {
              const active = product.id === selectedProduct;
              return (
                <motion.button
                  key={product.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedProduct(product.id)}
                  className={`product-option ${active ? "is-active" : ""}`}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="product-option-top">
                    <span>{product.index}</span>
                    <span>{active ? tr("OPEN", "مفتوح") : tr("EXPLORE", "اعرف أكتر")}</span>
                  </div>
                  <div className={`product-option-image product-option-${product.tone}`}>
                    <Image
                      src={product.image}
                      width={product.imageWidth}
                      height={product.imageHeight}
                      alt={`${product.name} — ${product.variant}`}
                    />
                  </div>
                  <div className="product-option-bottom">
                    <strong>{product.name}</strong>
                    <span>{product.variant}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct.id}
              className={`product-detail product-detail-${activeProduct.tone}`}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.42, ease: [0.2, 0.75, 0.2, 1] }}
            >
              <div className="product-detail-visual">
                <motion.div
                  className="product-detail-image-wrap"
                  initial={{ scale: 0.94, rotate: activeProduct.id.includes("wristband") ? -2 : -1 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.55, ease: [0.2, 0.75, 0.2, 1] }}
                >
                  <Image
                    src={activeProduct.image}
                    width={activeProduct.imageWidth}
                    height={activeProduct.imageHeight}
                    alt={`${activeProduct.name} — ${activeProduct.variant}`}
                  />
                </motion.div>
                <div className="product-detail-number">VITAL / {activeProduct.index}</div>
              </div>

              <div className="product-detail-copy">
                <div className="product-detail-heading">
                  <div>
                    <span className="product-detail-kicker">{activeProduct.name}</span>
                    <h3>{activeProduct.title}</h3>
                  </div>
                  <span className="product-detail-variant">{activeProduct.variant}</span>
                </div>

                <p className="product-detail-description">{activeProduct.description}</p>

                <div className="product-detail-columns">
                  <div className="product-detail-list">
                    <span className="product-detail-label">{tr("WHAT IT DOES", "بيعمل إيه")}</span>
                    <ul>
                      {activeProduct.features.map((feature) => <li key={feature}>{feature}</li>)}
                    </ul>
                  </div>
                  <div className="product-detail-best">
                    <span className="product-detail-label">{tr("BEST FOR", "أنسب لـ")}</span>
                    <div className="product-tags">
                      {activeProduct.bestFor.map((item) => <span key={item}>{item}</span>)}
                    </div>
                  </div>
                </div>

                <div className="product-detail-actions">
                  <Link href="/activate" className="product-detail-cta">
                    {tr("GET VITAL ID", "ابدأ مع VITAL ID")}
                    <ArrowUpRight size={17} strokeWidth={1.7} />
                  </Link>
                  <span className="product-detail-note">
                    {tr("One medical identity. Multiple devices can share it.", "هوية طبية واحدة، وممكن تربط بيها أكتر من جهاز.")}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
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
