"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Eye,
  EyeOff,
  ImagePlus,
  Link2,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/getTokenFromClient";
import { TRegisterForm, TRegisterRole } from "@/types";

const selectClass =
  "h-11 w-full appearance-none rounded-lg border border-input bg-transparent px-3 pr-9 text-base text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 md:text-sm";

export default function RegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Upload the selected image to our API route, which then sends it to ImgBB.
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.target;
    const file = input.files?.[0];

    if (!file) return;

    // Basic checks before sending the file to the server.
    if (!file.type.startsWith("image/")) {
      toast.warning("Invalid file", {
        description: "Please choose an image file such as JPG, PNG, or WEBP.",
      });
      input.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warning("Image too large", {
        description: "Please choose an image smaller than 5 MB.",
      });
      input.value = "";
      return;
    }

    // Show the image immediately while it uploads.
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setUploadedImageUrl("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "ImgBB did not return an image URL.");
      }

      setUploadedImageUrl(data.url);
      setImagePreview(data.url);

      toast.success("Image uploaded", {
        description: "Your profile photo is ready.",
      });
    } catch (error) {
      setUploadedImageUrl("");
      setImagePreview("");

      toast.error("Image upload failed", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsUploading(false);
      // Clear the file input so the same file can be selected again later.
      input.value = "";
    }
  };

  const removeImage = () => {
    setUploadedImageUrl("");
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
      role: (formData.get("role") === "owner"
        ? "owner"
        : "customer") as TRegisterRole,
      image: imageMode === "url" ? imageUrl.trim() : uploadedImageUrl,
    } satisfies TRegisterForm;

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

    if (isUploading) {
      toast.warning("Please wait", {
        description: "Your image is still uploading.",
      });
      return;
    }

    if (!user.image) {
      toast.warning("Photo required", {
        description:
          imageMode === "url"
            ? "Enter an image URL or upload a photo."
            : "Please upload a profile photo.",
      });
      return;
    }

    const { data, error } = await authClient.signUp.email({
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      password: user.password,
    });

    if (error) {
      toast.warning("Sign up failed", {
        description: error.message || "Something went wrong. Try again.",
      });
      return;
    }

    if (data) {
      // Start fresh with the new account's token.
      clearTokenCache();

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
            <FieldLabel htmlFor="role">I want to join as</FieldLabel>
            <div className="relative">
              <select
                id="role"
                name="role"
                defaultValue="customer"
                className={selectClass}
              >
                <option
                  value="customer"
                  className="bg-card text-card-foreground"
                >
                  Customer - rent equipment
                </option>
                <option value="owner" className="bg-card text-card-foreground">
                  Owner - list equipment
                </option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <FieldDescription>
              Customers rent gear. Owners list their own equipment.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel
              htmlFor={imageMode === "url" ? "imageUrl" : "imageFile"}
            >
              Profile Photo
            </FieldLabel>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={imageMode === "url" ? "default" : "outline"}
                className="h-9 cursor-pointer"
                onClick={() => setImageMode("url")}
              >
                <Link2 className="size-4" />
                Image URL
              </Button>
              <Button
                type="button"
                variant={imageMode === "upload" ? "default" : "outline"}
                className="h-9 cursor-pointer"
                onClick={() => setImageMode("upload")}
              >
                <Upload className="size-4" />
                Upload File
              </Button>
            </div>

            {imageMode === "url" ? (
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="h-11"
              />
            ) : (
              <>
                <input
                  ref={fileInputRef}
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="h-40 w-full object-cover"
                    />

                    {isUploading && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-black/55 text-sm font-medium text-white">
                        <Loader2 className="size-5 animate-spin" />
                        Uploading...
                      </div>
                    )}

                    <div className="absolute top-3 right-3 z-20 flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="cursor-pointer bg-background/90 hover:bg-background"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        Replace
                      </Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={removeImage}
                        disabled={isUploading}
                        aria-label="Remove image"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/40 px-4 py-6 text-center transition-colors hover:border-primary/60 hover:bg-accent/60 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <ImagePlus className="size-5" />
                    </span>
                    <span className="text-sm font-medium">
                      Click to upload an image
                    </span>
                    <span className="text-xs text-muted-foreground">
                      JPG, PNG, or WEBP &middot; Max 5 MB
                    </span>
                  </button>
                )}
              </>
            )}

            <FieldDescription>
              Paste a link to your photo or upload one from your device.
            </FieldDescription>
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

          <Button
            type="submit"
            className="h-11 w-full cursor-pointer"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Uploading image...
              </>
            ) : (
              "Create Account"
            )}
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
