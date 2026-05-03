"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createDemandRequest } from "./actions";
import { EmptyState } from "@/components/ui/empty-state";

export default function ManagerView({ stockItems, requests }: { stockItems: any[], requests: any[] }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<string>("");

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    const result = await createDemandRequest(formData);
    setIsLoading(false);

    if (result?.error) {
      toast({ title: "Failed to Submit", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Request Submitted", description: "Your demand request has been sent for approval." });
    }
  }

  function handleItemChange(val: string) {
    const item = stockItems.find(i => i.item_id === val);
    if (item) setSelectedUnit(item.unit);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Material Requisition</h1>
        <p className="text-slate-500 mt-1">Request materials for ongoing site work.</p>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-4">
          <CardTitle className="text-lg">New Request</CardTitle>
          <CardDescription>Select material and specify the required quantity.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form action={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="grid gap-2 w-full sm:w-1/2">
              <Label htmlFor="item_id">Select Item</Label>
              <Select name="item_id" required onValueChange={handleItemChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Browse available stock..." />
                </SelectTrigger>
                <SelectContent>
                  {stockItems.map(item => (
                    <SelectItem key={item.item_id} value={item.item_id}>
                      {item.name} (Cur: {item.quantity} {item.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 w-full sm:w-1/4">
              <Label htmlFor="quantity">Quantity Required</Label>
              <div className="relative">
                <Input id="quantity" name="quantity" type="number" step="0.01" min="0.01" required className="pr-16" />
                {selectedUnit && <span className="absolute right-3 top-2 text-sm text-slate-400 select-none">{selectedUnit}</span>}
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white">
              {isLoading ? "Submitting..." : <><Send className="h-4 w-4 mr-2" /> Submit</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">My Recent Requests</h2>
        <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-950">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead className="text-right">Quantity Requested</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Reviewed By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                    No requests found.
                  </TableCell>
                </TableRow>
              ) : requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="text-slate-500">{format(new Date(req.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="font-medium text-slate-900 dark:text-slate-100">{req.stock_items?.name || "Unknown"}</TableCell>
                  <TableCell className="text-right font-medium">{req.quantity_requested} {req.stock_items?.unit}</TableCell>
                  <TableCell className="text-center">
                    {req.status === "Pending" && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900">Pending</Badge>
                    )}
                    {req.status === "Approved" && (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900">Approved</Badge>
                    )}
                    {req.status === "Rejected" && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900">Rejected</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-500">{req.reviewed_by || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
