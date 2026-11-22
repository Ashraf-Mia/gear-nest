"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { confirmPayment } from "@/lib/api/booking-api";
// import { confirmPayment } from "@/lib/booking-api";

type Result = { transactionId: string; amount: number };

function SuccessContent() {
  const sessionId = useSearchParams().get("session_id");

  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("Payment session not found.");
      return;
    }

    confirmPayment(sessionId)
      .then(setResult)
      .catch((err) => setError(err.message));
  }, [sessionId]);

  if (error) {
    return (
      <div className="text-center">
        <XCircle className="mx-auto size-16 text-destructive" />
        <h1 className="mt-4 text-2xl">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center">
        <Loader2 className="mx-auto size-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Confirming your payment...</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <CheckCircle2 className="mx-auto size-16 text-green-600" />
      <h1 className="mt-4 text-2xl">Payment Successful!</h1>
      <p className="mt-2 text-muted-foreground">
        Your booking has been confirmed.
      </p>

      <div className="mx-auto mt-6 max-w-sm space-y-2 rounded-xl border bg-card p-4 text-left text-sm">
        <p className="flex justify-between gap-4">
          <span className="text-muted-foreground">Amount Paid</span>
          <span className="font-semibold">${result.amount}</span>
        </p>
        <p className="flex justify-between gap-4">
          <span className="text-muted-foreground">Transaction ID</span>
          <span className="truncate font-mono text-xs">
            {result.transactionId}
          </span>
        </p>
      </div>

      <Link
        href="/dashboard/customer/rentals"
        className={buttonVariants({ className: "mt-6" })}
      >
        View My Rentals
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-4 py-16">
      <Suspense
        fallback={<Loader2 className="size-10 animate-spin text-primary" />}
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
