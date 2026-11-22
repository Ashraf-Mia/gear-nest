"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/home/section-heading";
import { steps } from "@/lib/home-data";
import { fadeUp, stagger, viewport } from "@/lib/animations";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          title="How It Works"
          text="Renting equipment on GearNest takes just four simple steps."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={fadeUp}
              className="relative flex h-full flex-col items-center rounded-xl border bg-card p-6 text-center shadow-sm"
            >
              {/* ধাপের নম্বর */}
              <span className="absolute -top-3 left-1/2 flex size-7 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {index + 1}
              </span>
              <span className="mt-2 flex size-14 items-center justify-center rounded-full bg-navy text-white">
                <step.icon className="size-7" />
              </span>
              <h3 className="mt-4 text-lg">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
