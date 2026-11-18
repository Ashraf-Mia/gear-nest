import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image
          src="/images/truck.webp"
          alt="Equipment truck"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/60 to-navy-dark/20" />

        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <Link href="/">
            <Image
              src="/images/white-logo.png"
              alt="GearNest"
              width={150}
              height={40}
              className="h-9 w-auto"
            />
          </Link>
          <div>
            <h2 className="text-4xl font-bold leading-snug !text-white">
              Rent the gear you need,{" "}
              <span className="text-primary">when you need it.</span>
            </h2>
            <p className="mt-3 text-slate-200">
              Verified owners. Secure payments. Flexible rental.
            </p>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen flex-col bg-navy-dark lg:bg-background">
        <div className="relative h-56 shrink-0 lg:hidden">
          <Image
            src="/images/truck.webp"
            alt="Equipment truck"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/60 to-navy-dark/30" />

          <div className="absolute inset-0 flex flex-col justify-between p-5 pb-10">
            <Link href="/">
              <Image
                src="/images/white-logo.png"
                alt="GearNest"
                width={130}
                height={36}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-lg font-semibold text-white">
              Rent the gear you need,{" "}
              <span className="text-primary">when you need it.</span>
            </p>
          </div>
        </div>

        <div className="relative -mt-6 flex flex-1 justify-center rounded-t-3xl bg-background px-5 pb-10 pt-8 sm:px-8 lg:mt-0 lg:items-center lg:rounded-none">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
