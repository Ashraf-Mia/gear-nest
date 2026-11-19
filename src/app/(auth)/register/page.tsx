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

import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { TRegisterForm } from "@/types";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries()) as TRegisterForm;
    if (user.password !== user.confirmPassword) {
      toast.warning("Passwords don't match", {
        description: "Password and confirm password must be the same.",
      });
      return;
    }

    if (user.password.length < 8) {
      toast.warning("Password too short", {
        description: "Your password must be at least 8 characters long.",
      });
      return;
    }

    if (!/[A-Z]/.test(user.password)) {
      toast.warning("Weak password", {
        description: "Include at least one uppercase letter (A-Z).",
      });
      return;
    }

    if (!/[a-z]/.test(user.password)) {
      toast.warning("Weak password", {
        description: "Include at least one lowercase letter (a-z).",
      });
      return;
    }

    if (!/[0-9]/.test(user.password)) {
      toast.warning("Weak password", {
        description: "Include at least one number (0-9).",
      });
      return;
    }

    const { data, error } = await authClient.signUp.email({
      name: user.name,
      email: user.email,
      image: user.image,
      password: user.password,
    });

    console.log({ data, error });

    if (error) {
      toast.warning("Sign up failed", {
        description: error.message || "Something went wrong. Try again.",
      });
      return;
    }

    if (data) {
      toast.success("Welcome!", {
        description: "Your account has been created successfully.",
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
      <h2 className="text-2xl font-bold sm:text-3xl">Create your account</h2>
      <p className="mb-6 mt-2 text-sm text-muted-foreground">
        Join GearNest to rent or list equipment.
      </p>

      <form onSubmit={onSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g. John Doe"
              className="h-11"
            />
          </Field>

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
            <FieldLabel htmlFor="image">Photo URL</FieldLabel>
            <Input
              id="image"
              name="image"
              type="url"
              required
              placeholder="https://example.com/photo.jpg"
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
                placeholder="Min 8 chars, A-z, 0-9"
                className="h-11 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                required
                placeholder="Re-enter your password"
                className="h-11 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
              >
                {showConfirm ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
          </Field>

          <Button type="submit" className="h-11 w-full cursor-pointer">
            Create Account
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
          className="h-11 cursor-pointer"
          onClick={() => handleSocial("google")}
        >
          <FcGoogle className="size-5" /> Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 cursor-pointer"
          onClick={() => handleSocial("facebook")}
        >
          <FaFacebook className="size-5 text-[#1877F2]" /> Facebook
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
