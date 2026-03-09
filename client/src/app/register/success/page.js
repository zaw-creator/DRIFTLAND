"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./success.module.css";
import GlitchBackground from "@/components/GlitchBackground";
import { Suspense } from "react";


function SuccessPageContent() {
  const searchParams = useSearchParams();
  const registrationNumber = searchParams.get("registrationNumber");

const steps = [
  {
    title: "Check Your Email",
    desc: " Registration form submit လုပ်ပြီးပါပြီ။ Email ထဲကို Registration Number ပါတဲ့ Pending Email တစ်စောင်ရောက်လာမှာဖြစ်ပါတယ်။ ",
  },
  {
    title: "Complete Your Payment",
    desc: null, // handled separately
  },
  {
    title: "Admin Verification",
    desc: "ပြိုင်ပွဲဝင်များ Registration Form Fees ပေးသွင်းပြီးလျှင် screenshot ရိုက်ယူထားပေးပါရန်နှင့် Fees ပေးသွင်းထားကြောင်း Kpay ငွေလွှဲ Screenshot ကို Page Messenger သို့ပေးပို့ပြီးမှသာ Registration  Complete ဖြစ်မှာ ဖြစ်ပါတယ်။ ",
  },
  {
    title: "Final Confirmation Email",
    desc: "Registration Complete ဖြစ်သွားသော Racer များကိုလည်း Admin မှတစ်ဆင့် Final Confirmation Email ပေးပို့သွားမှာ ဖြစ်ပါတယ်။ Email ထဲမှာ QR Code ပါလာမှာဖြစ်ပြီး ပြိုင်ပွဲဝင်များအနေနဲ့ အဲဒီ QR Code ကိုပြိုင်ပွဲနေ့မှာပြသရမှာဖြစ်ပါတယ်။",
  },
];

  return (
    <div className={styles.container}>
       <GlitchBackground />
    <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem 1.5rem', boxSizing: 'border-box' }}>
      <div className={styles.card}>
        <div className={styles.cardInner}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.title}>Registration Submitted!</h1>

          <div className={styles.info}>
            <p className={styles.registrationNumber}>
              Registration Number: <strong>{registrationNumber}</strong>
            </p>
            <p className={styles.status}>
              Status:{" "}
              <span className={styles.pending}>Pending Verification</span>
            </p>
          </div>

          <div className={styles.message}>
            <h2>What's Next?</h2>
         <ol>
  {steps.map((step, index) => (
    <li key={index}>
      <div className={styles.stepNumber}>{index + 1}</div>
      <div className={styles.stepContent}>
        <strong>{step.title}</strong>
        {index === 1 ? (
          <p>
            Visit our <a href="https://www.facebook.com/profile.php?id=61555721314613" target="_blank" rel="noopener noreferrer">Facebook page NYO KI DRIFT</a> and message us with your registration number <strong style={{ color: "#FFBB00" }}>{registrationNumber}</strong> and email address to complete your payment.
          </p>
        ) : (
          <p>{step.desc}</p>
        )}
      </div>
    </li>
  ))}
</ol>
          </div>

          <div className={styles.actions}>
            <Link href="/register" className={styles.primaryButton}>
              Register Another Driver
            </Link>
            <Link
              href="/registration/lookup"
              className={styles.secondaryButton}
            >
              Check Registration Status
            </Link>
          </div>

          <div className={styles.importantNote}>
            <strong>Important:</strong> Save your registration number{" "}
            <strong style={{ color: "#FFBB00" }}>{registrationNumber}</strong>.
            You'll need it to check your status, make changes, or contact us on
            Facebook.
          </div>
        </div>
      </div>
    </div>
     </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#000401', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#535653', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Loading...</p>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}