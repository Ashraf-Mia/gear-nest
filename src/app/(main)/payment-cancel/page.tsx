import Link from "next/link";
import { XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <XCircle className="size-16 text-destructive" />
      <h1 className="mt-4 text-2xl">Payment Cancelled</h1>
      <p className="mt-2 text-muted-foreground">
        No money was charged. You can try booking again anytime.
      </p>
      <Link href="/equipment" className={buttonVariants({ className: "mt-6" })}>
        Back to Equipment
      </Link>
    </div>
  );
}
