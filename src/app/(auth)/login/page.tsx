"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries()) as {
      email: string;
      password: string;
    };

    const { data, error } = await authClient.signIn.email({
      email: user.email,
      password: user.password,
    });

    if (error) {
      toast.add({
        type: "Warning",
        title: "Login failed",
        description: "Invalid email or password.",
      });
      return;
    }

    if (data) {
      toast.add({
        type: "Success",
        title: "Welcome back!",
        description: "You have logged in successfully.",
      });
      router.push("/");
      router.refresh();
    }
  };

  const handleSocial = async (provider: "google" | "facebook") => {
    await authClient.signIn.social({ provider, callbackURL: "/" });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold sm:text-3xl">Welcome back 👋</h2>
      <p className="mb-6 mt-2 text-sm text-muted-foreground">
        Login to your GearNest account.
      </p>

      <form onSubmit={onSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="h-11"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                className="h-11 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
          </Field>

          <Button type="submit" className="h-11 w-full">
            Login
          </Button>
        </FieldGroup>
      </form>

      <p className="my-5 text-center text-sm text-muted-foreground">
        or continue with
      </p>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-11"
          onClick={() => handleSocial("google")}
        >
          <FcGoogle className="size-5" /> Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11"
          onClick={() => handleSocial("facebook")}
        >
          <FaFacebook className="size-5 text-[#1877F2]" /> Facebook
        </Button>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
