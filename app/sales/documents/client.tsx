"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from '@/lib/supabase-browser'
import { 
  FileText, CheckCircle2, Clock, XCircle, Search, Calendar,
  Download, Eye, Check, X, FileCheck, FileWarning, AlertCircle,
  Plus, UploadCloud, Loader2
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/toast"

function getStatusStyle(status: string) {
  switch ((status || '').toLowerCase()) {
    case 'verified': return { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 }
    case 'pending': return { bg: "bg-amber-100", text: "text-amber-700", icon: Clock }
    case 'reviewing': return { bg: "bg-blue-100", text: "text-blue-700", icon: AlertCircle }
    case 'rejected': return { bg: "bg-red-100", text: "text-red-700", icon: XCircle }
    default: return { bg: "bg-gray-100", text: "text-gray-700", icon: FileText }
  }
}

export default function DocumentsClient() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    leadId: '', documentType: 'Aadhaar Card'
  });

  const { toast } = useToast();
  const supabase = createBrowserClient();

  useEffect(() => {
    fetchData();

    // Real-time subscriptions
    const channel = supabase
      .channel('documents-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'documents' }, () => fetchData())
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    const { data: docsData } = await supabase
      .from('documents')
      .select(`
        *,
        lead:leads_customers(id, name),
        verified_by_user:users(id, name)
      `)
      .order('uploaded_at', { ascending: false });

    if (docsData) setDocuments(docsData);

    const { data: leadsData } = await supabase.from('leads_customers').select('id, name');
    if (leadsData) setLeads(leadsData);

    setLoading(false);
  };

  const uploadDocument = async () => {
    if (!formData.leadId || !formData.documentType) {
      toast({ title: 'Error', description: 'Please select lead and document type', variant: 'destructive' });
      return;
    }
    setUploading(true);
    
    // Simulate file upload delay
    await new Promise(r => setTimeout(r, 800));
    
    const mockUrl = `https://mock-storage.flowestate.local/docs/${formData.leadId}/${Date.now()}.pdf`;
    
    const { error } = await supabase
      .from('documents')
      .insert({
        lead_id: formData.leadId,
        document_type: formData.documentType,
        file_url: mockUrl,
        status: 'Pending'
      });
      
    setUploading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Document uploaded successfully' });
      setShowUploadDialog(false);
      setFormData({ leadId: '', documentType: 'Aadhaar Card' });
    }
  };

  const updateDocumentStatus = async (docId: string, status: string) => {
    // In a real app we'd get the current user ID for verified_by
    const { error } = await supabase
      .from('documents')
      .update({ 
        status,
        updated_at: new Date().toISOString()
        // verified_by: currentUserId -> mock omitted for now
      })
      .eq('id', docId);
      
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: `Document marked as ${status}` });
      if (selectedDoc?.id === docId) {
        setSelectedDoc({ ...selectedDoc, status });
      }
    }
  };

  const documentsDataUI = documents.map(d => ({
    ...d,
    leadName: d.lead?.name || 'Unknown Lead',
    dateStr: new Date(d.uploaded_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    verifiedByName: d.verified_by_user?.name || '-',
    size: '1.2 MB'
  }));

  const filteredDocs = documentsDataUI.filter(d => 
    d.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.leadName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDocs = documents.length;
  const verifiedDocs = documents.filter(d => d.status === 'Verified').length;
  const pendingDocs = documents.filter(d => d.status === 'Pending').length;
  const rejectedDocs = documents.filter(d => d.status === 'Rejected').length;

  if (loading) {
    return (
      <div className="p-8 max-w-[1700px] mx-auto pb-24 space-y-8 animate-pulse text-center pt-20">
         <Loader2 className="w-8 h-8 mx-auto animate-spin text-[#0066FF]" />
         <p className="text-gray-500 mt-4 font-medium">Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1700px] mx-auto pb-24 space-y-8 font-sans">
      
      {/* HEADER & KPI CARDS */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Document Verification</h1>
          <p className="text-[#64748B] text-sm mt-1">Review and approve KYC and property documents</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Total Docs", value: totalDocs, icon: FileText, color: "from-blue-600 to-blue-400", shadow: "shadow-blue-500/30" },
            { label: "Verified", value: verifiedDocs, icon: FileCheck, color: "from-emerald-500 to-emerald-400", shadow: "shadow-emerald-500/30" },
            { label: "Pending", value: pendingDocs, icon: Clock, color: "from-amber-500 to-amber-400", shadow: "shadow-amber-500/30" },
            { label: "Rejected", value: rejectedDocs, icon: FileWarning, color: "from-red-500 to-red-400", shadow: "shadow-red-500/30" },
          ].map((kpi, i) => (
            <Card 
              key={i}
              className="overflow-hidden bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-[#CBD5E1]"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-[12px] bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white shadow-md ${kpi.shadow} shrink-0`}>
                  <kpi.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-[24px] font-bold text-[#0F172A] leading-none">{kpi.value}</h3>
                  <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em] mt-1">{kpi.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FILTER BAR */}
      <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
        <div className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex-1 w-full flex flex-wrap gap-3">
            <div className="relative w-full md:max-w-[240px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                 placeholder="Search lead or doc ID..." 
                 className="w-full pl-9 rounded-[10px] border-gray-200 bg-[#F8FAFC] focus:bg-white text-sm" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
              <DialogTrigger asChild>
                <Button className="rounded-[10px] bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold shadow-md">
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Upload New Document</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Lead Name</label>
                    <Select value={formData.leadId} onValueChange={v => setFormData({...formData, leadId: v})}>
                      <SelectTrigger className="w-full rounded-[10px] border-gray-200">
                        <SelectValue placeholder="Select Lead..." />
                      </SelectTrigger>
                      <SelectContent>
                        {leads.map(l => (
                          <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Document Type</label>
                    <Select value={formData.documentType} onValueChange={v => setFormData({...formData, documentType: v})}>
                      <SelectTrigger className="w-full rounded-[10px] border-gray-200">
                        <SelectValue placeholder="Select Type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aadhaar Card">Aadhaar Card</SelectItem>
                        <SelectItem value="PAN Card">PAN Card</SelectItem>
                        <SelectItem value="Income Proof">Income Proof</SelectItem>
                        <SelectItem value="Bank Statement">Bank Statement</SelectItem>
                        <SelectItem value="Sale Agreement">Sale Agreement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="border-2 border-dashed border-gray-200 rounded-[12px] p-8 text-center bg-gray-50 flex flex-col items-center justify-center mt-2 cursor-pointer hover:bg-gray-100">
                    <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm font-semibold text-gray-600">Click to upload file</p>
                    <p className="text-xs text-gray-400">PDF, JPG or PNG (max. 10MB)</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowUploadDialog(false)} className="rounded-[10px] font-semibold">Cancel</Button>
                  <Button onClick={uploadDocument} disabled={uploading} className="rounded-[10px] font-semibold bg-[#0066FF] hover:bg-[#0052CC] text-white">
                    {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Upload File
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* DOCUMENTS TABLE */}
      {filteredDocs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No documents found</h3>
          <p className="text-gray-500 mb-6">Upload documents to start verification.</p>
        </div>
      ) : (
      <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#F8FAFC] border-b border-gray-200">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] py-4 pl-6">Doc ID</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Lead Name</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Document Type</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Uploaded Date</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Status</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Verified By</TableHead>
                <TableHead className="text-right pr-6 text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocs.map((doc, index) => {
                const style = getStatusStyle(doc.status);
                const Icon = style.icon;
                
                return (
                  <TableRow key={doc.id} className="group hover:bg-[#F0F4F8]/60 transition-colors border-b border-gray-100 bg-white">
                    <TableCell className="pl-6 py-4">
                      <div className="font-bold text-[#0F172A] text-[13px]">{(doc.id || '').substring(0,8)}...</div>
                      <div className="text-[11px] text-gray-400 font-medium">{doc.size}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-[#0F172A] text-[14px]">{doc.leadName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#0066FF]" />
                        <span className="text-[13px] font-medium text-[#0F172A]">{doc.document_type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-[13px] text-[#64748B] font-medium">{doc.dateStr}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${style.bg} ${style.text} shadow-none text-[11px] rounded-full font-bold uppercase tracking-wide px-2.5 flex items-center gap-1 w-fit`}>
                        <Icon className="w-3 h-3" /> {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-[13px] font-medium text-[#64748B]">{doc.verifiedByName}</span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-[8px] text-[#0066FF] hover:text-[#0052CC] hover:bg-blue-50 bg-[#F0F4F8] sm:bg-transparent"
                              onClick={() => setSelectedDoc(doc)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-none rounded-[20px] shadow-2xl">
                            <div className="flex flex-col md:flex-row h-[80vh] md:h-[600px]">
                              
                              {/* Left Side: Document Preview (60%) */}
                              <div className="w-full md:w-[60%] bg-[#E2E8F0] p-6 flex flex-col items-center justify-center relative">
                                <div className="absolute top-4 right-4">
                                  <Button variant="outline" size="sm" className="bg-white/90 hover:bg-white text-[#0F172A] border-gray-200 rounded-[8px] h-8 shadow-sm">
                                    <Download className="w-4 h-4 mr-1.5" /> Download
                                  </Button>
                                </div>
                                  <div className="w-full max-w-[400px] aspect-[3/4] bg-white rounded-[12px] shadow-lg border border-gray-200 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                                    <FileText className="w-16 h-16 mb-4 text-[#CBD5E1]" />
                                    <h3 className="text-lg font-bold text-[#0F172A]">{selectedDoc?.document_type}</h3>
                                    <p className="text-sm mt-1">{selectedDoc?.leadName}</p>
                                    <p className="text-xs mt-4 px-4 py-1.5 bg-gray-100 rounded-full">{(selectedDoc?.id || '').substring(0,8)}... • {selectedDoc?.size}</p>
                                  </div>
                              </div>

                              {/* Right Side: Details & Actions (40%) */}
                              <div className="w-full md:w-[40%] bg-white p-6 flex flex-col h-full overflow-y-auto">
                                <DialogHeader className="mb-6 text-left">
                                  <DialogTitle className="text-2xl font-bold text-[#0F172A]">Document Review</DialogTitle>
                                </DialogHeader>

                                <div className="space-y-6 flex-1">
                                  {/* Doc Info */}
                                  <div className="space-y-3 p-4 bg-[#F8FAFC] rounded-[12px] border border-gray-100">
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                      <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Doc ID</span>
                                      <span className="text-[13px] font-bold text-[#0F172A]">{selectedDoc?.id?.substring(0,8)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                      <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Lead</span>
                                      <span className="text-[13px] font-bold text-[#0066FF]">{selectedDoc?.leadName}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                      <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Type</span>
                                      <span className="text-[13px] font-bold text-[#0F172A]">{selectedDoc?.document_type}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Current Status</span>
                                      <Badge className={`${getStatusStyle(selectedDoc?.status || '').bg} ${getStatusStyle(selectedDoc?.status || '').text} shadow-none text-[10px] rounded-[6px] font-bold uppercase`}>
                                        {selectedDoc?.status}
                                      </Badge>
                                    </div>
                                  </div>

                                  {/* Verification Checklist */}
                                  <div className="space-y-3">
                                    <h4 className="text-[13px] font-bold text-[#0F172A]">Verification Checklist</h4>
                                    <div className="space-y-2.5">
                                      {[
                                        "Name perfectly matches lead record",
                                        "Document is not expired",
                                        "Image is clear and legible",
                                        "All pages/corners are visible"
                                      ].map((item, i) => (
                                        <div key={i} className="flex items-start space-x-2">
                                          <Checkbox id={`check-${i}`} className="mt-0.5 border-gray-300 text-[#10B981] rounded-[4px] data-[state=checked]:bg-[#10B981] data-[state=checked]:border-[#10B981]" />
                                          <label htmlFor={`check-${i}`} className="text-[13px] font-medium text-[#64748B] leading-tight cursor-pointer">
                                            {item}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
                                  <Button onClick={() => updateDocumentStatus(selectedDoc.id, 'Verified')} className="w-full bg-[#10B981] hover:bg-[#059669] text-white rounded-[10px] shadow-sm font-semibold h-11" disabled={selectedDoc?.status === 'Verified'}>
                                    <Check className="w-4 h-4 mr-2" /> Approve Document
                                  </Button>
                                  <Button onClick={() => updateDocumentStatus(selectedDoc.id, 'Rejected')} variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-[10px] font-semibold h-11" disabled={selectedDoc?.status === 'Rejected'}>
                                    <X className="w-4 h-4 mr-2" /> Reject
                                  </Button>
                                </div>
                              </div>

                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button onClick={() => updateDocumentStatus(doc.id, 'Verified')} disabled={doc.status === 'Verified'} variant="ghost" size="icon" className="h-8 w-8 rounded-[8px] text-[#10B981] hover:text-[#059669] hover:bg-emerald-50 bg-[#F0FDF4] sm:bg-transparent disabled:opacity-50">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => updateDocumentStatus(doc.id, 'Rejected')} disabled={doc.status === 'Rejected'} variant="ghost" size="icon" className="h-8 w-8 rounded-[8px] text-red-500 hover:text-red-700 hover:bg-red-50 bg-[#FEF2F2] sm:bg-transparent disabled:opacity-50">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
      )}

    </div>
  )
}
