"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, Receipt, IndianRupee } from "lucide-react";
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer 
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { logExpense, recordPayment } from "./actions";
import { EmptyState } from "@/components/ui/empty-state";

type FinancialsClientProps = {
  expenses: any[];
  payments: any[];
  leads: { id: string; name: string }[];
  flats: { flat_id: string; project: string; flat_number: string }[];
  pieData: { name: string; value: number }[];
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];

export default function FinancialsClient({ expenses, payments, leads, flats, pieData }: FinancialsClientProps) {
  const { toast } = useToast();
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Format currency
  const formatCur = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  async function handleLogExpense(formData: FormData) {
    setIsLoading(true);
    const result = await logExpense(formData);
    setIsLoading(false);

    if (result?.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Expense logged successfully." });
      setIsExpenseOpen(false);
    }
  }

  async function handleRecordPayment(formData: FormData) {
    setIsLoading(true);
    const result = await recordPayment(formData);
    setIsLoading(false);

    if (result?.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Payment recorded successfully." });
      setIsPaymentOpen(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financials</h1>
        <p className="text-slate-500 mt-1">Track company expenses and incoming payments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 border-slate-200">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>All-time expenses by category</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[300px]">
            {pieData.length === 0 ? (
              <div className="text-slate-500">No expense data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: number) => formatCur(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <div className="col-span-1 lg:col-span-2 space-y-6">
          <Card className="border-slate-200 overflow-hidden flex flex-col h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <CardTitle className="text-lg flex items-center gap-2"><Receipt className="h-5 w-5 text-red-500" /> Recent Expenses</CardTitle>
                <CardDescription className="mt-1">Operational costs and outbound transactions</CardDescription>
              </div>
              <Dialog open={isExpenseOpen} onOpenChange={setIsExpenseOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 mt-4 sm:mt-0">
                    <Plus className="h-4 w-4 mr-1" /> Log Expense
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log New Expense</DialogTitle>
                  </DialogHeader>
                  <form action={handleLogExpense} className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Category</Label>
                        <Select name="category" required defaultValue="Operations">
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Construction">Construction</SelectItem>
                            <SelectItem value="Operations">Operations</SelectItem>
                            <SelectItem value="Salaries">Salaries</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Date</Label>
                        <Input type="date" name="date" required defaultValue={format(new Date(), 'yyyy-MM-dd')} />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Amount (₹)</Label>
                      <Input type="number" name="amount" required min="1" placeholder="e.g. 50000" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Description</Label>
                      <Input name="description" placeholder="Brief details about the expense" />
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Expense'}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="p-0 overflow-auto max-h-[250px] flex-1">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center h-20 text-slate-500">No expenses logged.</TableCell></TableRow>
                  ) : expenses.map(e => (
                    <TableRow key={e.id}>
                      <TableCell className="text-slate-500 text-sm">{format(new Date(e.date), "MMM d, yyyy")}</TableCell>
                      <TableCell><Badge variant="secondary" className="font-normal">{e.category}</Badge></TableCell>
                      <TableCell className="text-sm truncate max-w-[200px]" title={e.description}>{e.description || "-"}</TableCell>
                      <TableCell className="text-right font-medium text-red-600">-{formatCur(e.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>

      <Card className="border-slate-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <CardTitle className="text-lg flex items-center gap-2"><IndianRupee className="h-5 w-5 text-emerald-500" /> Incoming Payments</CardTitle>
            <CardDescription className="mt-1">Payments collected from leads for inventory.</CardDescription>
          </div>
          <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700 mt-4 sm:mt-0">
                <Plus className="h-4 w-4 mr-1" /> Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Payment Received</DialogTitle>
              </DialogHeader>
              <form action={handleRecordPayment} className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label>Lead / Customer</Label>
                  <Select name="leadId" required>
                    <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                    <SelectContent className="max-h-56">
                      {leads.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Purchased Flat</Label>
                  <Select name="flatId" required>
                    <SelectTrigger><SelectValue placeholder="Select flat" /></SelectTrigger>
                    <SelectContent className="max-h-56">
                      {flats.map(f => <SelectItem key={f.flat_id} value={f.flat_id}>{f.project} - {f.flat_number}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Amount Received (₹)</Label>
                    <Input type="number" name="amount" required min="1" placeholder="e.g. 500000" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Payment Date</Label>
                    <Input type="date" name="date" required defaultValue={format(new Date(), 'yyyy-MM-dd')} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Payment'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="p-0 overflow-auto max-h-[400px]">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Flat</TableHead>
                <TableHead className="text-right">Amount (₹)</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center h-24 text-slate-500">No payments recorded.</TableCell></TableRow>
              ) : payments.map(p => (
                <TableRow key={p.payment_id}>
                  <TableCell className="text-slate-500">{format(new Date(p.payment_date), "MMM d, yyyy")}</TableCell>
                  <TableCell className="font-medium">{p.leads_customers?.name || "Unknown"}</TableCell>
                  <TableCell className="text-slate-600">{p.flats_inventory ? `${p.flats_inventory.project}-${p.flats_inventory.flat_number}` : "-"}</TableCell>
                  <TableCell className="text-right font-semibold text-emerald-600">+{formatCur(p.amount)}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={p.status === 'Received' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' : 'bg-yellow-100 text-yellow-800'}>
                      {p.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      
    </div>
  );
}
