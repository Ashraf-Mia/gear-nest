"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import SectionHeading from "@/components/home/section-heading";
import { reviews } from "@/lib/home-data";
import { fadeUp, stagger, viewport } from "@/lib/animations";

export default function Reviews() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          title="What Our Customers Say"
          text="Real feedback from people who rented equipment through GearNest."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {reviews.map((review) => (
            <motion.div
              key={review.name}
              variants={fadeUp}
              className="flex h-full flex-col rounded-xl border bg-card p-6 shadow-sm"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < review.rating
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/40"
                    }`}
                  />
                ))}
              </div>

              <p className="mt-4 flex-1 text-sm text-muted-foreground">
                &ldquo;{review.comment}&rdquo;
              </p>

              <div className="mt-5 flex items-center gap-3 border-t pt-4">
                <span className="flex size-10 items-center justify-center rounded-full bg-navy font-semibold text-white">
                  {review.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
