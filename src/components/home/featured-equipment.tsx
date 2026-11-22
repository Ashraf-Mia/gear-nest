"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EquipmentCard from "@/components/equipment/equipment-card";
import { authClient } from "@/lib/auth-client";
import { TEquipment } from "@/types";
import { getFeaturedEquipment } from "@/lib/api/equipment";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function FeaturedEquipment() {
  const { data: session } = authClient.useSession();
  const [items, setItems] = useState<TEquipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedEquipment()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">Featured Equipment</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Hand-picked equipment from verified owners, ready to rent today.
          </p>
        </motion.div>

        {loading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            No equipment available right now.
          </p>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((equipment) => (
              <motion.div
                key={equipment._id}
                variants={item}
                className="h-full"
              >
                <EquipmentCard item={equipment} isLoggedIn={!!session} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-10 text-center">
          <Link href="/equipment" className={buttonVariants({ size: "lg" })}>
            View All Equipment
          </Link>
        </div>
      </div>
    </section>
  );
}
