"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/home/section-heading";
import { benefits } from "@/lib/home-data";
import { fadeUp, stagger, viewport } from "@/lib/animations";

export default function WhyChooseUs() {
  return (
    <section className="bg-muted/40 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          title="Why Choose GearNest"
          text="A rental marketplace built on trust, flexibility and safe payments."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {benefits.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              className="h-full rounded-xl border bg-card p-6 shadow-sm transition hover:shadow-lg"
            >
              <span className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="size-6" />
              </span>
              <h3 className="mt-4 text-lg">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
