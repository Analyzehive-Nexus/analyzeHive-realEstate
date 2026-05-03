"use client";

import { useEffect, useState } from "react";
import { getCompanySettings, updateCompanyName, uploadLogo } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CompanySettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState({ company_name: "", logo_url: "" });

  useEffect(() => {
    async function load() {
      try {
        const data = await getCompanySettings();
        setCompany(data);
      } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
      setLoading(false);
    }
    load();
  }, [toast]);

  const handleNameUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateCompanyName(formData);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Company name updated" });
      const updated = await getCompanySettings();
      setCompany(updated);
    }
    setSaving(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("logo", file);
    const result = await uploadLogo(formData);
    if (result.error) {
      toast({ title: "Upload failed", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Logo uploaded" });
      setCompany((prev) => ({ ...prev, logo_url: result.logo_url! }));
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Company Settings</h1>
        <Link href="/settings/profile">
          <Button variant="outline">Back to Profile</Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Company Logo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            {company.logo_url ? (
              <Image src={company.logo_url} alt="Company Logo" width={80} height={80} className="rounded-lg border object-contain" />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">No logo</div>
            )}
            <div>
              <Label htmlFor="logo" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50">
                  <Upload className="h-4 w-4" /> Upload Logo
                </div>
                <input id="logo" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </Label>
              <p className="text-xs text-gray-500 mt-2">Recommended size: 200x200px, PNG or JPG</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleNameUpdate}>
        <Card>
          <CardHeader>
            <CardTitle>Company Name</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input id="company_name" name="company_name" defaultValue={company.company_name} required />
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : null}
            Save Company Name
          </Button>
        </div>
      </form>
    </div>
  );
}
