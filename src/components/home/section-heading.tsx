"use client";

import { motion } from "framer-motion";

export default function SectionHeading({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{text}</p>
    </motion.div>
  );
}
