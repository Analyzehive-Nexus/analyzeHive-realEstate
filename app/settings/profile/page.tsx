"use client";

import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", avatar_initials: "" });

  useEffect(() => {
    async function load() {
      const data = await getUserProfile();
      setProfile(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateUserProfile(formData);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Profile updated successfully" });
    }
    setSaving(false);
  };

  const handlePasswordChange = () => {
    window.location.href = "https://dashboard.workos.com/account/password"; // or WorkOS hosted auth page
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <Link href="/settings/company">
          <Button variant="outline">Company Settings (MD Only)</Button>
        </Link>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" defaultValue={profile.name} required />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" defaultValue={profile.email} disabled className="bg-gray-50" />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed. Contact support.</p>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" defaultValue={profile.phone || ""} />
            </div>
            <div>
              <Label htmlFor="avatar_initials">Avatar Initials (e.g., JD)</Label>
              <Input id="avatar_initials" name="avatar_initials" defaultValue={profile.avatar_initials || ""} maxLength={2} />
              <p className="text-xs text-gray-500">Max 2 characters, shown in sidebar.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent>
            <Button type="button" variant="outline" onClick={handlePasswordChange}>
              Change Password via WorkOS
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : null}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
