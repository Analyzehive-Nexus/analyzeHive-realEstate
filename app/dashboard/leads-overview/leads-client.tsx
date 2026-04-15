"use client";

import { Download } from "lucide-react";
import { format } from "date-fns";
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
import { Badge } from "@/components/ui/badge";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  source: string;
  status: string;
  created_at: string;
};

export default function LeadsClient({ leads }: { leads: Lead[] }) {
  
  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = ["ID,Name,Phone,Email,Source,Status,Created At"];
    const rows = leads.map(l => 
      `"${l.id}","${l.name}","${l.phone}","${l.email || ''}","${l.source}","${l.status}","${l.created_at}"`
    );
    
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analyzehive_leads_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'New': return <Badge variant="outline" className="bg-blue-50 text-blue-700">New</Badge>;
      case 'Contacted': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Contacted</Badge>;
      case 'Site Visit Scheduled': return <Badge variant="outline" className="bg-orange-50 text-orange-700">Site Visit</Badge>;
      case 'Negotiation': return <Badge variant="outline" className="bg-purple-50 text-purple-700">Negotiation</Badge>;
      case 'Converted': return <Badge variant="outline" className="bg-emerald-50 text-emerald-700">Converted</Badge>;
      case 'Lost': return <Badge variant="outline" className="bg-slate-50 text-slate-700">Lost</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Leads Directory</h1>
          <p className="text-slate-500 mt-1">Read-only comprehensive view of all prospects and customers.</p>
        </div>
        
        <Button onClick={handleExportCSV} variant="outline" className="bg-white">
          <Download className="h-4 w-4 mr-2" /> Export to CSV
        </Button>
      </div>

      <Card className="border-slate-200">
        <div className="p-0 overflow-auto max-h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-slate-50 z-10 shadow-sm border-b">
              <TableRow>
                <TableHead>Date Added</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center h-24 text-slate-500">No leads found.</TableCell></TableRow>
              ) : leads.map(l => (
                <TableRow key={l.id}>
                  <TableCell className="text-slate-500">{format(new Date(l.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="font-semibold">{l.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{l.phone}</span>
                      <span className="text-xs text-slate-400">{l.email}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary" className="font-normal">{l.source}</Badge></TableCell>
                  <TableCell>{getStatusBadge(l.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
