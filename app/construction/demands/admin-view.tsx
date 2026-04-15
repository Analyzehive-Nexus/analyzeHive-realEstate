"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { approveDemandRequest, rejectDemandRequest } from "./actions";

export default function AdminView({ requests }: { requests: any[] }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  async function handleApprove(requestId: string, itemId: string, quantity: number) {
    setIsLoading(requestId);
    const result = await approveDemandRequest(requestId, itemId, quantity);
    setIsLoading(null);

    if (result?.error) {
      toast({ title: "Approval Failed", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Approved", description: `Stock updated. ${result.deducted} units deducted.` });
    }
  }

  async function handleReject(requestId: string) {
    setIsLoading(requestId);
    const result = await rejectDemandRequest(requestId);
    setIsLoading(null);

    if (result?.error) {
      toast({ title: "Rejection Failed", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Rejected", description: "Demand request rejected." });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Pending Requests</h1>
        <p className="text-slate-500 mt-1">Review and approve material demands from site managers.</p>
      </div>

      <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-950">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  No pending requests.
                </TableCell>
              </TableRow>
            ) : requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="text-slate-500">{format(new Date(req.created_at), "MMM d, yyyy")}</TableCell>
                <TableCell className="font-medium text-slate-900 dark:text-slate-100">{req.requested_by}</TableCell>
                <TableCell>{req.stock_items?.name || "Unknown Item"}</TableCell>
                <TableCell className="text-right font-medium">{req.quantity_requested} {req.stock_items?.unit}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900">
                    Pending
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleApprove(req.id, req.item_id, req.quantity_requested)}
                      disabled={isLoading === req.id}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white h-8"
                    >
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleReject(req.id)}
                      disabled={isLoading === req.id}
                      className="h-8"
                    >
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
