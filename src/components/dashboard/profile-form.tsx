"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Mail, MapPin, Pencil, Phone, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
// import { TProfile } from "@/types";
import { TProfile, TProfileInput } from "@/types";
import { getProfile, updateProfile } from "@/lib/api/profile-api";
// import { getProfile, updateProfile, type ProfileInput } from "@/lib/profile-api";
// import type { Profile } from "@/types";

export default function ProfileForm() {
  const [profile, setProfile] = useState<TProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false); // true হলে ফর্ম দেখায়
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as TProfileInput;

    if (data.name.trim().length < 2) {
      return toast.error("Name must be at least 2 characters");
    }
    if (data.phone && !/^[0-9+\-\s]{7,15}$/.test(data.phone)) {
      return toast.error("Enter a valid phone number");
    }

    try {
      setSaving(true);

      const updated = await updateProfile(data);
      setProfile(updated);

      await authClient.updateUser({
        name: data.name,
        image: data.image || undefined,
      });

      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  if (!profile) {
    return <p className="text-muted-foreground">Profile not found.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">My Profile</h1>
      <p className="mt-1 text-muted-foreground">
        View and update your personal information.
      </p>

      <div className="mt-6 rounded-xl border bg-card">
        <div className="flex flex-col items-center gap-4 border-b p-6 text-center sm:flex-row sm:text-left">
          <Avatar className="size-24 border-2 border-primary">
            <AvatarImage src={profile.image || undefined} alt={profile.name} />
            <AvatarFallback className="bg-navy text-3xl text-white">
              {profile.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <Badge className="mt-2 bg-primary capitalize text-white">
              {profile.role}
            </Badge>
          </div>

          {!editing && (
            <Button onClick={() => setEditing(true)}>
              <Pencil className="size-4" /> Edit Profile
            </Button>
          )}
        </div>

        <div className="p-6">
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={profile.name}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={profile.email} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Profile Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  defaultValue={profile.image}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    defaultValue={profile.phone}
                    placeholder="01XXXXXXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    defaultValue={profile.address}
                    placeholder="House, road, area, city"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditing(false)}
                  disabled={saving}
                >
                  <X className="size-4" /> Cancel
                </Button>
              </div>
            </form>
          ) : (
            <dl className="grid gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-5 text-primary" />
                <div>
                  <dt className="text-sm text-muted-foreground">Email</dt>
                  <dd className="font-medium">{profile.email}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 size-5 text-primary" />
                <div>
                  <dt className="text-sm text-muted-foreground">
                    Phone Number
                  </dt>
                  <dd className="font-medium">
                    {profile.phone || "Not added yet"}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <MapPin className="mt-0.5 size-5 text-primary" />
                <div>
                  <dt className="text-sm text-muted-foreground">Address</dt>
                  <dd className="font-medium">
                    {profile.address || "Not added yet"}
                  </dd>
                </div>
              </div>
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}
