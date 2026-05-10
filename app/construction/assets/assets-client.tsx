"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, Settings2, ShieldCheck, AlertTriangle, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { addAsset, updateAssetStatus } from "./actions";
import { EmptyState } from "@/components/ui/empty-state";

type Asset = {
  asset_id: string;
  name: string;
  type: string;
  status: string;
  last_updated: string;
};

export default function AssetsClient({ assets }: { assets: Asset[] }) {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleAddAsset(formData: FormData) {
    setIsLoading(true);
    const result = await addAsset(formData);
    setIsLoading(false);

    if (result?.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Asset added successfully." });
      setIsAddOpen(false);
    }
  }

  async function handleStatusChange(assetId: string, newStatus: string) {
    const result = await updateAssetStatus(assetId, newStatus);
    if (result?.error) {
      toast({ title: "Update Failed", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Status Updated", description: `Asset status changed to ${newStatus}.` });
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      case "Maintenance": return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
      case "Decommissioned": return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active": return <ShieldCheck className="h-4 w-4 mr-1.5" />;
      case "Maintenance": return <AlertTriangle className="h-4 w-4 mr-1.5" />;
      case "Decommissioned": return <PowerOff className="h-4 w-4 mr-1.5" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Assets & Machinery</h1>
          <p className="text-slate-500 mt-1">Manage heavy equipment and track their operational status.</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register New Asset</DialogTitle>
            </DialogHeader>
            <form action={handleAddAsset} className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Asset Name/Model</Label>
                <Input id="name" name="name" placeholder="e.g. CAT Excavator 320" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Equipment Type</Label>
                  <Select name="type" required defaultValue="Excavator">
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excavator">Excavator</SelectItem>
                      <SelectItem value="Generator">Generator</SelectItem>
                      <SelectItem value="Crane">Crane</SelectItem>
                      <SelectItem value="Mixer">Mixer</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Initial Status</Label>
                  <Select name="status" defaultValue="Active">
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Asset'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {assets.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            No assets registered yet.
          </div>
        ) : assets.map(asset => (
          <Card key={asset.asset_id} className="relative overflow-hidden border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
            <div className={`absolute top-0 left-0 w-1 h-full ${asset.status === 'Active' ? 'bg-green-500' : asset.status === 'Maintenance' ? 'bg-yellow-500' : 'bg-slate-400'}`} />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold truncate pr-2" title={asset.name}>
                  {asset.name}
                </CardTitle>
                <Settings2 className="h-5 w-5 text-slate-400 shrink-0" />
              </div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{asset.type}</div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="mt-2 text-xs text-slate-400">
                Last updated: {format(new Date(asset.last_updated), "MMM d, yyyy")}
              </div>
            </CardContent>
            <CardFooter className="pt-2 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
              <Select defaultValue={asset.status} onValueChange={(val) => handleStatusChange(asset.asset_id, val)}>
                <SelectTrigger className={`h-8 border text-xs font-semibold px-2 w-full justify-start ${getStatusColor(asset.status)}`}>
                  <div className="flex items-center">
                    {getStatusIcon(asset.status)}
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                </SelectContent>
              </Select>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
