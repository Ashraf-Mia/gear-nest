"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";

export default function OwnerCta() {
  return (
    <section className="px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl bg-gradient-to-br from-navy-dark to-navy px-6 py-14 text-center sm:px-12"
      >
        =
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary/25 blur-3xl" />
        <div className="relative">
          <h2 className="text-3xl font-bold !text-white sm:text-4xl">
            Own Equipment? <span className="text-primary">Start Earning.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            List your idle equipment on GearNest and earn money every time
            someone rents it.
          </p>
          <Link
            href="/register"
            className={buttonVariants({ size: "lg", className: "mt-8" })}
          >
            Become an Owner
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
