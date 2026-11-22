"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SectionHeading from "@/components/home/section-heading";
import { homeCategories } from "@/lib/home-data";
import { fadeUp, stagger, viewport } from "@/lib/animations";

export default function Categories() {
  return (
    <section className="bg-muted/40 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          title="Popular Categories"
          text="Browse equipment by category and find exactly what your project needs."
        />

        {/* ৬টা ক্যাটাগরি: মোবাইলে ২ কলাম, ট্যাবলেটে ৩, ডেস্কটপে ৬ */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
        >
          {homeCategories.map((cat) => (
            <motion.div key={cat.name} variants={fadeUp}>
              <Link
                href={`/equipment?category=${encodeURIComponent(cat.name)}`}
                className="group flex h-full flex-col items-center gap-3 rounded-xl border bg-card p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                  <cat.icon className="size-7" />
                </span>
                <span className="text-sm font-medium">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
