"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronDown,
  FileText,
  ImagePlus,
  Loader2,
  Package,
  RotateCcw,
  Send,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createEquipment } from "@/lib/api/equipment";
import { uploadImage } from "@/lib/api/upload";
import {
  EQUIPMENT_CATEGORIES,
  EQUIPMENT_CONDITIONS,
  RENTAL_TYPES,
} from "@/lib/equipment-options";

const selectClass =
  "h-11 w-full appearance-none rounded-lg border border-input bg-card px-3 pr-9 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

function RequiredMark() {
  return (
    <span className="text-primary" aria-hidden="true">
      *
    </span>
  );
}

type AddEquipmentFormProps = {
  owner: {
    id: string;
    name: string;
    email: string;
  };
};

export default function AddEquipmentForm({ owner }: AddEquipmentFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setImageUrl("");
    setIsUploading(true);

    try {
      const url = await uploadImage(file);

      // Store the hosted URL. This is what gets saved with the equipment.
      setImageUrl(url);
      setImagePreview(url);

      toast.success("Image uploaded", {
        description: "Your equipment photo is ready.",
      });
    } catch (error) {
      setImageUrl("");
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
    setImageUrl("");
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReset = () => {
    // The browser resets the normal inputs automatically. We only need to
    // clear the image state because it is stored in React state.
    removeImage();
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isUploading) {
      toast.warning("Please wait", {
        description: "Your image is still uploading.",
      });
      return;
    }

    if (!imageUrl) {
      toast.warning("Image required", {
        description: "Please upload an equipment image before submitting.",
      });
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      category: String(formData.get("category") ?? ""),
      location: String(formData.get("location") ?? ""),
      brand: String(formData.get("brand") ?? ""),
      model: String(formData.get("model") ?? ""),
      rentalPrice: Number(formData.get("rentalPrice")),
      rentalType: String(formData.get("rentalType") ?? ""),
      availableQuantity: Number(formData.get("availableQuantity")),
      condition: String(formData.get("condition") ?? ""),
      image: imageUrl,
      rentalTerms: String(formData.get("rentalTerms") ?? ""),
      ownerId: owner.id,
      ownerName: owner.name,
      ownerEmail: owner.email,
    };

    setIsSubmitting(true);

    try {
      await createEquipment(payload);

      toast.success("Equipment submitted", {
        description: "Your listing is now pending admin approval.",
      });

      // Clear the form so the owner can add another item.
      form.reset();
      removeImage();
      router.refresh();
    } catch (error) {
      toast.error("Submission failed", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* ------------------------- Basic details ------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="size-4 text-primary" />
            Equipment Details
          </CardTitle>
          <CardDescription>
            Tell renters what you are listing and where it is located.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="name">
                  Equipment Name <RequiredMark />
                </FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Bosch Rotary Hammer"
                  className="h-11"
                />
              </Field>

              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="description">
                  Description <RequiredMark />
                </FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  required
                  placeholder="Describe the equipment, its features, and what is included."
                  className="min-h-28"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="category">
                  Category <RequiredMark />
                </FieldLabel>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    required
                    defaultValue=""
                    className={selectClass}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {EQUIPMENT_CATEGORIES.map((category) => (
                      <option
                        key={category}
                        value={category}
                        className="bg-card text-card-foreground"
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="location">
                  Location <RequiredMark />
                </FieldLabel>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  required
                  placeholder="e.g. Dhanmondi, Dhaka"
                  className="h-11"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="brand">
                  Brand <RequiredMark />
                </FieldLabel>
                <Input
                  id="brand"
                  name="brand"
                  type="text"
                  required
                  placeholder="e.g. Bosch"
                  className="h-11"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="model">
                  Model <RequiredMark />
                </FieldLabel>
                <Input
                  id="model"
                  name="model"
                  type="text"
                  required
                  placeholder="e.g. GBH 2-26"
                  className="h-11"
                />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* ------------------------- Rental details ------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" />
            Rental Details
          </CardTitle>
          <CardDescription>
            Set your price, rental period, and available quantity.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="rentalPrice">
                  Rental Price <RequiredMark />
                </FieldLabel>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="rentalPrice"
                    name="rentalPrice"
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="h-11 pl-7"
                  />
                </div>
                <FieldDescription>
                  The price for one rental period.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="rentalType">
                  Rental Type <RequiredMark />
                </FieldLabel>
                <div className="relative">
                  <select
                    id="rentalType"
                    name="rentalType"
                    required
                    defaultValue=""
                    className={selectClass}
                  >
                    <option value="" disabled>
                      Select a rental type
                    </option>
                    {RENTAL_TYPES.map((type) => (
                      <option
                        key={type}
                        value={type}
                        className="bg-card text-card-foreground"
                      >
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="availableQuantity">
                  Available Quantity <RequiredMark />
                </FieldLabel>
                <Input
                  id="availableQuantity"
                  name="availableQuantity"
                  type="number"
                  min="1"
                  step="1"
                  required
                  placeholder="1"
                  className="h-11"
                />
                <FieldDescription>
                  How many units are available to rent?
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="condition">
                  Equipment Condition <RequiredMark />
                </FieldLabel>
                <div className="relative">
                  <select
                    id="condition"
                    name="condition"
                    required
                    defaultValue=""
                    className={selectClass}
                  >
                    <option value="" disabled>
                      Select the condition
                    </option>
                    {EQUIPMENT_CONDITIONS.map((condition) => (
                      <option
                        key={condition}
                        value={condition}
                        className="bg-card text-card-foreground"
                      >
                        {condition}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* ------------------------- Image upload ------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImagePlus className="size-4 text-primary" />
            Equipment Image
          </CardTitle>
          <CardDescription>
            Upload a clear photo of the equipment. Images are hosted on ImgBB.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* This hidden input sends the uploaded ImgBB URL with the form. */}
          <input type="hidden" name="image" value={imageUrl} />

          <input
            ref={fileInputRef}
            id="equipmentImage"
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
                alt="Equipment preview"
                className="h-56 w-full object-cover sm:h-72"
              />

              {isUploading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-black/55 text-sm font-medium text-white">
                  <Loader2 className="size-5 animate-spin" />
                  Uploading to ImgBB...
                </div>
              )}

              <div className="absolute top-3 right-3 z-20 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="bg-background/90 hover:bg-background"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  Replace
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="destructive"
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
              className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/40 px-4 py-10 text-center transition-colors hover:border-primary/60 hover:bg-accent/60 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ImagePlus className="size-6" />
              </span>
              <span className="text-sm font-medium">
                Click to upload an image
              </span>
              <span className="text-xs text-muted-foreground">
                JPG, PNG, or WEBP &middot; Max 5 MB
              </span>
            </button>
          )}

          <FieldDescription>
            A good photo helps renters trust your listing.
          </FieldDescription>
        </CardContent>
      </Card>

      {/* ------------------------- Terms ------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-4 text-primary" />
            Rental Terms and Conditions
          </CardTitle>
          <CardDescription>
            Explain the rules renters must follow.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Field>
            <FieldLabel htmlFor="rentalTerms">
              Terms and Conditions <RequiredMark />
            </FieldLabel>
            <Textarea
              id="rentalTerms"
              name="rentalTerms"
              required
              placeholder="e.g. A valid ID is required. Late returns are charged an extra daily fee. The renter is responsible for any damage."
              className="min-h-32"
            />
            <FieldDescription>
              Include deposit, damage, late return, and cancellation rules.
            </FieldDescription>
          </Field>
        </CardContent>
      </Card>

      {/* ------------------------- Submit ------------------------- */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button
          type="reset"
          variant="outline"
          className="h-11"
          onClick={handleReset}
          disabled={isSubmitting || isUploading}
        >
          <RotateCcw className="size-4" />
          Reset Form
        </Button>

        <Button
          type="submit"
          className="h-11"
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="size-4" />
              Submit for Approval
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
