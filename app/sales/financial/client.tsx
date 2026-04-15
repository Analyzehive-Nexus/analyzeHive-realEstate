"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from '@/lib/supabase-browser'
import { 
  Wallet, DollarSign, TrendingUp, Clock, Search, Plus, 
  ArrowDownRight, ArrowUpRight, FileText, CheckCircle2, 
  XCircle, Filter, Loader2, IndianRupee
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/toast"

function getStatusStyle(status: string) {
  switch ((status || '').toLowerCase()) {
    case 'completed': return { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 }
    case 'pending': return { bg: "bg-amber-100", text: "text-amber-700", icon: Clock }
    case 'failed': return { bg: "bg-red-100", text: "text-red-700", icon: XCircle }
    default: return { bg: "bg-gray-100", text: "text-gray-700", icon: FileText }
  }
}

export default function FinancialClient() {
  const [ledger, setLedger] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingLoading, setAddingLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    leadId: '', amount: '', type: 'Credit', receiptNo: '', status: 'Completed', notes: ''
  });

  const { toast } = useToast();
  const supabase = createBrowserClient();

  // Generate a random receipt number for the mock workflow
  const generateReceiptNo = () => `RCT-${Math.floor(100000 + Math.random() * 900000)}`;

  useEffect(() => {
    fetchData();

    // Real-time subscriptions
    const channel = supabase
      .channel('financial-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financial_ledger' }, () => fetchData())
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    const { data: ledgerData, error } = await supabase
      .from('financial_ledger')
      .select(`
        *,
        lead:leads_customers(id, name, phone, project_interest)
      `)
      .order('transaction_date', { ascending: false });

    if (ledgerData) setLedger(ledgerData);

    const { data: leadsData } = await supabase.from('leads_customers').select('id, name, phone, project_interest').eq('status', 'Converted'); // Or any other appropriate filter
    if (leadsData) setLeads(leadsData);
    
    if(!leadsData || leadsData.length === 0) {
       // fallback generic leads
       const { data: allLeadsData } = await supabase.from('leads_customers').select('id, name, phone, project_interest').limit(50);
       if (allLeadsData) setLeads(allLeadsData);
    }

    setLoading(false);
  };

  const addPayment = async () => {
    if (!formData.leadId || !formData.amount) {
      toast({ title: 'Validation Error', description: 'Please fill all required fields.', variant: 'destructive' });
      return;
    }
    
    setAddingLoading(true);
    
    const { error } = await supabase
      .from('financial_ledger')
      .insert({
        lead_id: formData.leadId,
        amount: parseFloat(formData.amount),
        type: formData.type,
        receipt_no: formData.receiptNo || generateReceiptNo(),
        status: formData.status,
        notes: formData.notes,
        transaction_date: new Date().toISOString()
      });
      
    setAddingLoading(false);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Payment recorded successfully' });
      setShowAddDialog(false);
      setFormData({ leadId: '', amount: '', type: 'Credit', receiptNo: '', status: 'Completed', notes: '' });
    }
  };

  const formatCur = (v: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  // Compute stats
  const totalRevenue = ledger.filter(l => l.type === 'Credit' && l.status === 'Completed').reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
  const pendingPayments = ledger.filter(l => l.status === 'Pending').reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
  
  // Get active distinct deals based on completed payments (unique lead_id)
  const activeDeals = new Set(ledger.filter(l => l.type === 'Credit' && l.status === 'Completed' && l.lead_id).map(l => l.lead_id)).size;

  const filteredLedger = ledger.filter(l => 
    l.receipt_no?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.lead?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 max-w-[1700px] mx-auto pb-24 space-y-8 animate-pulse text-center pt-20">
         <Loader2 className="w-8 h-8 mx-auto animate-spin text-[#0066FF]" />
         <p className="text-gray-500 mt-4 font-medium">Loading financial ledger...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1700px] mx-auto pb-24 space-y-8 font-sans">
      
      {/* HEADER & KPI CARDS */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Financial Ledger</h1>
          <p className="text-[#64748B] text-sm mt-1">Track all incoming payments, booking amounts, and pending dues</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Total Revenue", value: formatCur(totalRevenue), icon: IndianRupee, color: "from-blue-600 to-blue-400", shadow: "shadow-blue-500/30" },
            { label: "Pending Payments", value: formatCur(pendingPayments), icon: Clock, color: "from-amber-500 to-amber-400", shadow: "shadow-amber-500/30" },
            { label: "Active Deals", value: activeDeals.toString(), icon: TrendingUp, color: "from-emerald-500 to-emerald-400", shadow: "shadow-emerald-500/30" },
            { label: "Recent Txns", value: ledger.length > 50 ? "50+" : ledger.length.toString(), icon: Wallet, color: "from-purple-600 to-purple-400", shadow: "shadow-purple-500/30" },
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
                  <h3 className="text-[20px] font-bold text-[#0F172A] leading-none">{kpi.value}</h3>
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
                 placeholder="Search by receipt or name..." 
                 className="w-full pl-9 rounded-[10px] border-gray-200 bg-[#F8FAFC] focus:bg-white text-sm" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px] rounded-[10px] border-gray-200 bg-[#F8FAFC]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="rounded-[10px] border-gray-200 bg-white text-[#64748B]">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="rounded-[10px] bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold shadow-md">
                  <Plus className="mr-2 h-4 w-4" /> Record Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                  <DialogTitle>Record New Payment</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Lead / Customer</label>
                    <Select value={formData.leadId} onValueChange={v => setFormData({...formData, leadId: v})}>
                      <SelectTrigger className="w-full rounded-[10px] border-gray-200">
                        <SelectValue placeholder="Select Customer..." />
                      </SelectTrigger>
                      <SelectContent>
                        {leads.map(l => (
                          <SelectItem key={l.id} value={l.id}>{l.name} - {l.project_interest || 'General'}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Amount (₹)</label>
                    <Input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="500000" className="rounded-[10px] border-gray-200" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Transaction Type</label>
                      <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}>
                        <SelectTrigger className="w-full rounded-[10px] border-gray-200">
                          <SelectValue placeholder="Type..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Credit">Credit IN</SelectItem>
                          <SelectItem value="Debit">Debit OUT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Status</label>
                      <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                        <SelectTrigger className="w-full rounded-[10px] border-gray-200">
                          <SelectValue placeholder="Status..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Receipt No (Optional)</label>
                    <Input value={formData.receiptNo} onChange={e => setFormData({...formData, receiptNo: e.target.value})} placeholder="Auto-generated if left blank" className="rounded-[10px] border-gray-200" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)} className="rounded-[10px] font-semibold">Cancel</Button>
                  <Button onClick={addPayment} disabled={addingLoading} className="rounded-[10px] font-semibold bg-[#0066FF] hover:bg-[#0052CC] text-white">
                    {addingLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Save Payment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* LEDGER TABLE */}
      {filteredLedger.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No transactions found</h3>
          <p className="text-gray-500 mb-6">Record your first payment to see it here.</p>
        </div>
      ) : (
      <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#F8FAFC] border-b border-gray-200">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] py-4 pl-6">Receipt No</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Date</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Customer</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Project</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Type</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Status</TableHead>
                <TableHead className="text-right pr-6 text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Amount (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLedger.map((txn, index) => {
                const style = getStatusStyle(txn.status);
                const Icon = style.icon;
                const dateStr = new Date(txn.transaction_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                const isCredit = txn.type === 'Credit';
                
                return (
                  <TableRow key={txn.id} className="group hover:bg-[#F0F4F8]/60 transition-colors border-b border-gray-100 bg-white">
                    <TableCell className="pl-6 py-4">
                      <div className="font-bold text-[#0F172A] text-[13px]">{txn.receipt_no}</div>
                      <div className="text-[11px] text-gray-400 font-medium">Txn ID: {(txn.id || '').substring(0,8)}...</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-[13px] text-[#64748B] font-medium">{dateStr}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-[#0F172A] text-[14px]">{txn.lead?.name || 'Unknown'}</div>
                      <div className="text-[11px] text-gray-400 font-medium">{txn.lead?.phone || 'N/A'}</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-[13px] font-medium text-[#0F172A]">{txn.lead?.project_interest || 'General'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-medium text-[13px]">
                         {isCredit ? (
                           <ArrowDownRight className="w-4 h-4 text-emerald-500" />
                         ) : (
                           <ArrowUpRight className="w-4 h-4 text-red-500" />
                         )}
                         <span className={isCredit ? 'text-emerald-600' : 'text-red-600'}>
                           {txn.type}
                         </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${style.bg} ${style.text} shadow-none text-[11px] rounded-full font-bold uppercase tracking-wide px-2.5 flex items-center gap-1 w-fit`}>
                        <Icon className="w-3 h-3" /> {txn.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className={`font-bold text-[15px] ${isCredit ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isCredit ? '+' : '-'}{formatCur(txn.amount)}
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
