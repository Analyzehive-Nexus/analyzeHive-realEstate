"use client";
import { ResponsiveTable } from "@/components/ui/responsive-table";


import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase-browser";
import {
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Plus,
  Eye,
  Loader2,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/empty-state";

type Document = {
  id: string;
  document_type: string;
  file_url: string | null;
  status: "Pending" | "Verified" | "Rejected";
  uploaded_at: string;
  lead_id: string;
  lead: {
    id: string;
    name: string;
    phone: string;
  } | null;
};

type Lead = {
  id: string;
  name: string;
  phone: string;
};

export default function DocumentsClient() {
  const supabase = createBrowserClient();
  const { toast } = useToast();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Add document dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newDoc, setNewDoc] = useState({
    lead_id: "",
    document_type: "Aadhaar Card",
    file_url: "",
  });

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);

    // Fetch documents with lead join
    const { data: docsData, error: docsError } = await supabase
      .from("documents")
      .select(`
        id,
        document_type,
        file_url,
        status,
        uploaded_at,
        lead_id,
        lead:leads_customers(id, name, phone)
      `)
      .order("uploaded_at", { ascending: false });

    if (docsError) {
      console.error("Error fetching documents:", docsError);
      toast({ title: "Error", description: docsError.message, variant: "destructive" });
    } else {
      setDocuments(docsData as unknown as Document[]);
    }

    // Fetch leads for dropdown
    const { data: leadsData } = await supabase
      .from("leads_customers")
      .select("id, name, phone")
      .order("name");
    setLeads(leadsData || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // Real‑time subscription for documents
    const channel = supabase
      .channel("documents-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "documents" },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // KPIs from real data
  const totalDocs = documents.length;
  const pendingDocs = documents.filter((d) => d.status === "Pending").length;
  const verifiedDocs = documents.filter((d) => d.status === "Verified").length;
  const rejectedDocs = documents.filter((d) => d.status === "Rejected").length;

  // Add document (status Pending)
  const handleAddDocument = async () => {
    if (!newDoc.lead_id || !newDoc.document_type) {
      toast({
        title: "Missing fields",
        description: "Please select lead and document type",
        variant: "destructive",
      });
      return;
    }

    setAdding(true);

    const { error } = await supabase.from("documents").insert({
      lead_id: newDoc.lead_id,
      document_type: newDoc.document_type,
      file_url: newDoc.file_url || null,
      status: "Pending",
      uploaded_at: new Date().toISOString(),
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Document added", description: "Status is Pending" });
      setAddOpen(false);
      setNewDoc({ lead_id: "", document_type: "Aadhaar Card", file_url: "" });
    }
    setAdding(false);
  };

  // Update document status
  const updateStatus = async (docId: string, newStatus: "Verified" | "Rejected") => {
    // Optimistic update
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === docId ? { ...doc, status: newStatus } : doc))
    );

    const { error } = await supabase
      .from("documents")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", docId);

    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      fetchData(); // rollback
    } else {
      toast({ title: `Document ${newStatus.toLowerCase()}` });
    }
  };

  // Delete document
  const deleteDocument = async (docId: string) => {
    // Optimistic removal
    setDocuments((prev) => prev.filter((doc) => doc.id !== docId));

    const { error } = await supabase.from("documents").delete().eq("id", docId);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      fetchData();
    } else {
      toast({ title: "Document deleted" });
    }
  };

  // Filter documents by search term
  const filteredDocs = documents.filter(
    (doc) =>
      doc.lead?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.document_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper for status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Pending</Badge>;
      case "Verified":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Verified</Badge>;
      case "Rejected":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Document Verification</h1>
          <p className="text-gray-500 text-sm mt-1">Manage KYC and customer documents</p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="bg-[#0066FF] hover:bg-[#0052CC]">
          <Plus className="w-4 h-4 mr-2" /> Verify Document
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{totalDocs}</h3>
              <p className="text-xs text-gray-500 uppercase font-bold">Total Documents</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{pendingDocs}</h3>
              <p className="text-xs text-gray-500 uppercase font-bold">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{verifiedDocs}</h3>
              <p className="text-xs text-gray-500 uppercase font-bold">Verified</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{rejectedDocs}</h3>
              <p className="text-xs text-gray-500 uppercase font-bold">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="flex justify-end">
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by lead or document..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Documents Table */}
      <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <ResponsiveTable>
<Table>
            <TableHeader className="bg-[#F8FAFC]">
              <TableRow>
                <TableHead>Lead Name</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Uploaded Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No documents found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocs.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {doc.lead?.name || "Unknown"}
                      <div className="text-xs text-gray-500">{doc.lead?.phone}</div>
                    </TableCell>
                    <TableCell>{doc.document_type}</TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(doc.uploaded_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      {doc.status === "Pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => updateStatus(doc.id, "Verified")}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" /> Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => updateStatus(doc.id, "Rejected")}
                          >
                            <XCircle className="w-4 h-4 mr-1" /> Reject
                          </Button>
                        </>
                      )}
                      {doc.status !== "Pending" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteDocument(doc.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                      {doc.file_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(doc.file_url!, "_blank")}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
</ResponsiveTable>
        </div>
      </Card>

      {/* Add Document Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Document for Verification</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Select Lead *</Label>
              <Select
                value={newDoc.lead_id}
                onValueChange={(val) => setNewDoc({ ...newDoc, lead_id: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a lead..." />
                </SelectTrigger>
                <SelectContent>
                  {leads.map((lead) => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.name} ({lead.phone})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Document Type *</Label>
              <Select
                value={newDoc.document_type}
                onValueChange={(val) => setNewDoc({ ...newDoc, document_type: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aadhaar Card">Aadhaar Card</SelectItem>
                  <SelectItem value="PAN Card">PAN Card</SelectItem>
                  <SelectItem value="Bank Statement">Bank Statement</SelectItem>
                  <SelectItem value="Income Proof">Income Proof</SelectItem>
                  <SelectItem value="Sale Agreement">Sale Agreement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>File URL (optional)</Label>
              <Input
                placeholder="https://..."
                value={newDoc.file_url}
                onChange={(e) => setNewDoc({ ...newDoc, file_url: e.target.value })}
              />
              <p className="text-xs text-gray-500">Provide a link to the uploaded file</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDocument} disabled={adding}>
              {adding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Add Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
