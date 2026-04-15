"use client";

import { Home, Key, Lock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type Flat = {
  flat_id: string;
  project: string;
  flat_number: string;
  type: string;
  floor: number;
  area_sqft: number;
  price: number;
  status: string;
  updated_at: string;
};

export default function InventoryClient({ flats }: { flats: Flat[] }) {
  
  const totalFlats = flats.length;
  const available = flats.filter(f => f.status === 'Available').length;
  const onHold = flats.filter(f => f.status === 'On Hold').length;
  const sold = flats.filter(f => f.status === 'Sold').length;

  const formatCur = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Available': return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Available</Badge>;
      case 'On Hold': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">On Hold</Badge>;
      case 'Sold': return <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300">Sold</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventory Overview</h1>
        <p className="text-slate-500 mt-1">Track the status and availability of all project units.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Flats</CardTitle>
            <Home className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalFlats}</div>
            <p className="text-xs text-slate-400 mt-1">Across all projects</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Available</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{available}</div>
            <p className="text-xs text-slate-400 mt-1">Ready to sell</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">On Hold</CardTitle>
            <Lock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{onHold}</div>
            <p className="text-xs text-slate-400 mt-1">Pending finalize</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Sold</CardTitle>
            <Key className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{sold}</div>
            <p className="text-xs text-slate-400 mt-1">Successfully closed</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 overflow-hidden mt-6">
        <div className="p-0 overflow-auto max-h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-slate-50 z-10 shadow-sm">
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Flat Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-center">Floor</TableHead>
                <TableHead className="text-right">Area (sqft)</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flats.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center h-24 text-slate-500">No inventory found.</TableCell></TableRow>
              ) : flats.map(f => (
                <TableRow key={f.flat_id}>
                  <TableCell className="font-semibold">{f.project}</TableCell>
                  <TableCell>{f.flat_number}</TableCell>
                  <TableCell><Badge variant="outline" className="font-normal">{f.type}</Badge></TableCell>
                  <TableCell className="text-center">{f.floor || '-'}</TableCell>
                  <TableCell className="text-right font-medium">{f.area_sqft || '-'}</TableCell>
                  <TableCell className="text-right font-semibold text-slate-700">{f.price ? formatCur(f.price) : '-'}</TableCell>
                  <TableCell className="text-center">{getStatusBadge(f.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
