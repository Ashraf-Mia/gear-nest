"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, CalendarClock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

// হেডিংয়ের দুটো লাইন। highlight: true মানে অরেঞ্জ রঙ হবে
const lines = [
  { text: "Rent Smart.", highlight: false },
  { text: "Work Better.", highlight: true },
];

// নিচের ৩টা ট্রাস্ট পয়েন্ট
const trustPoints = [
  { icon: ShieldCheck, text: "Verified Owners" },
  { icon: CreditCard, text: "Secure Payment" },
  { icon: CalendarClock, text: "Flexible Rental" },
];

export default function Banner() {
  // প্রতিটা অক্ষরের জন্য মোট কত দেরি হবে সেটা হিসাব করার জন্য
  let charIndex = 0;

  return (
    <section className="relative overflow-hidden bg-navy-dark">
      {/* ১. ব্যাকগ্রাউন্ড ছবি (পুরো সেকশন জুড়ে) */}
      <Image
        src="/images/banner.webp"
        alt="Construction equipment for rent"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center lg:object-right"
      />

      {/* ২. নেভি গ্রেডিয়েন্ট: বাম দিকে গাঢ়, ডান দিকে স্বচ্ছ, তাই লেখার দিকে ছবি অদৃশ্য হয়ে যায় */}
      <div className="absolute inset-0 bg-navy-dark/80 lg:bg-transparent lg:bg-gradient-to-r lg:from-navy-dark lg:via-navy-dark/85 lg:to-transparent" />

      {/* ৩. কনটেন্ট */}
      <div className="relative mx-auto flex min-h-[480px] max-w-7xl items-center px-4 py-16 sm:min-h-[540px] lg:min-h-[620px]">
        <div className="max-w-xl text-center lg:text-left">
          {/* হেডিং: অক্ষর অক্ষর করে আসবে */}
          <h1
            aria-label="Rent Smart. Work Better."
            className="text-4xl font-bold leading-tight !text-white sm:text-5xl lg:text-6xl"
          >
            {lines.map((line) => (
              <span key={line.text} className="block" aria-hidden="true">
                {/* প্রতিটা শব্দ আলাদা span-এ, যাতে শব্দের মাঝখানে লাইন না ভাঙে */}
                {line.text.split(" ").map((word, wordIdx) => (
                  <span
                    key={wordIdx}
                    className="inline-block whitespace-nowrap"
                  >
                    {word.split("").map((char, i) => {
                      const delay = 0.3 + charIndex * 0.05; // প্রতি অক্ষর ০.০৫ সেকেন্ড পরপর
                      charIndex++;
                      return (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay }}
                          className={`inline-block ${line.highlight ? "text-primary" : ""}`}
                        >
                          {char}
                        </motion.span>
                      );
                    })}
                    {/* শব্দের পরে ফাঁকা জায়গা */}
                    <span className="inline-block">&nbsp;</span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          {/* বর্ণনা: হেডিং শেষ হওয়ার পর ফেড-ইন */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.7 }}
            className="mt-5 text-base text-slate-200 sm:text-lg"
          >
            Your trusted platform for renting high-quality equipment, anytime,
            anywhere.
          </motion.p>

          {/* বাটন */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2 }}
            className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
          >
            <Link href="/equipment" className={buttonVariants({ size: "lg" })}>
              Browse Equipment
            </Link>
            <Link
              href="/register"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white",
              })}
            >
              Become an Owner
            </Link>
          </motion.div>

          {/* ট্রাস্ট পয়েন্ট */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.3 }}
            className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 lg:justify-start"
          >
            {trustPoints.map((point) => (
              <li
                key={point.text}
                className="flex items-center gap-2 text-sm text-slate-200"
              >
                <point.icon className="size-4 text-primary" />
                {point.text}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
