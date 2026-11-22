import React from "react";
import Link from "next/link";
import WhyChooseUs from "@/components/home/why-choose-us";
import HowItWorks from "@/components/home/how-it-works";
const AboutUs = () => {
  return (
    <main className="bg-[#F8FAFC] text-[#101D32]">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="mb-3 font-semibold uppercase tracking-wider text-[#F59E0B]">
              Who We Are
            </p>

            <h2 className="mb-5 text-3xl font-bold md:text-4xl">
              Making Equipment Rental Simple and Accessible
            </h2>

            <p className="mb-4 leading-8 text-slate-600">
              GearNest is an equipment rental platform designed to make renting
              and sharing equipment easier. We connect people who need equipment
              with owners who want to rent out their unused tools and machinery.
            </p>

            <p className="leading-8 text-slate-600">
              Whether you are working on a construction project, managing a
              farm, or completing a personal task, GearNest helps you find the
              right equipment at the right time.
            </p>
          </div>

          <div className="rounded-2xl bg-[#101D32] p-10 text-center text-white">
            <div className="mb-5 text-6xl">⚙️</div>
            <h3 className="mb-3 text-2xl font-bold">GearNest</h3>
            <p className="text-slate-300">Rent Smart. Work Better.</p>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="font-semibold uppercase tracking-wider text-[#F59E0B]">
              Our Purpose
            </p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Mission & Vision
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-8 transition hover:shadow-lg">
              <div className="mb-4 text-4xl">🎯</div>
              <h3 className="mb-4 text-2xl font-bold">Our Mission</h3>
              <p className="leading-8 text-slate-600">
                Our mission is to create a reliable platform where people can
                easily rent the equipment they need without the high cost of
                purchasing it.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-8 transition hover:shadow-lg">
              <div className="mb-4 text-4xl">🚀</div>
              <h3 className="mb-4 text-2xl font-bold">Our Vision</h3>
              <p className="leading-8 text-slate-600">
                We envision a future where equipment sharing becomes easier,
                more affordable, and accessible to everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUs />

      {/* How It Works */}
      <HowItWorks />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl rounded-2xl bg-[#F59E0B] px-8 py-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-[#101D32] md:text-4xl">
            Ready to Get Started?
          </h2>

          <p className="mx-auto mb-8 max-w-2xl leading-7 text-[#101D32]">
            Join GearNest today and discover a smarter way to rent and share
            equipment.
          </p>

          <Link
            href="/register"
            className="mr-4 inline-block rounded-lg bg-[#101D32] px-8 py-3 font-semibold text-white transition hover:bg-[#1B2B45]"
          >
            Sign Up
          </Link>
          <Link
            href="/equipment"
            className="inline-block rounded-lg bg-[#101D32] px-8 py-3 font-semibold text-white transition hover:bg-[#1B2B45]"
          >
            Explore Equipment
          </Link>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
