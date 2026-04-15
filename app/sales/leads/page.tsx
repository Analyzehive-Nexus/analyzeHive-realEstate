'use client';

import { useEffect, useState, useMemo } from 'react';
import { createBrowserClient } from '@/lib/supabase-browser';
import { useToast } from '@/components/ui/toast';
import { 
  Users, UserPlus, PhoneCall, Calendar, CheckCircle2, 
  Search, Download, Plus, Eye, MessageCircle, Edit, Trash2,
  MapPin, Phone, Building2, Loader2, Filter, XCircle, FileText
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

const LEAD_STATUSES = [
  { value: 'New', color: 'blue' },
  { value: 'Contacted', color: 'yellow' },
  { value: 'Site Visit Scheduled', color: 'purple' },
  { value: 'Negotiation', color: 'orange' },
  { value: 'Converted', color: 'green' },
  { value: 'Lost', color: 'red' }
];

function getStatusColor(status: string) {
  switch ((status||'').toLowerCase()) {
    case 'new': return "bg-blue-100 text-[#0066FF] border-none"
    case 'contacted': return "bg-yellow-100 text-yellow-700 border-none"
    case 'site visit scheduled': case 'site visit': return "bg-purple-100 text-purple-700 border-none"
    case 'negotiation': return "bg-orange-100 text-orange-700 border-none"
    case 'converted': return "bg-green-100 text-green-700 border-none"
    case 'lost': return "bg-red-100 text-red-700 border-none"
    default: return "bg-gray-100 text-gray-700 border-none"
  }
}

function getSourceColor(source: string) {
  switch ((source||'').toLowerCase()) {
    case 'meta': return "bg-indigo-100 text-indigo-700 border-none"
    case 'google': return "bg-orange-100 text-orange-700 border-none"
    case '99acres': return "bg-teal-100 text-teal-700 border-none"
    case 'direct': return "bg-slate-100 text-slate-700 border-none"
    default: return "bg-gray-100 text-gray-700 border-none"
  }
}

export default function LeadsPage() {
  const { toast } = useToast();
  const supabase = createBrowserClient();
  
  const [leads, setLeads] = useState<any[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [brokerFilter, setBrokerFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Add lead sheet state
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'Direct',
    assignedUserId: '',
    projectInterest: '',
    flatTypeInterest: '',
    notes: ''
  });

  // Edit lead sheet state
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [editingLead, setEditingLead] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    name: '', phone: '', email: '',
    source: '', assignedUserId: '',
    projectInterest: '', flatTypeInterest: '',
    notes: '', status: ''
  });

  // Schedule Visit state
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedLeadForVisit, setSelectedLeadForVisit] = useState<any | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [visitForm, setVisitForm] = useState({
    flatId: '',
    visitDate: '',
    visitTime: '',
    brokerId: '',
    notes: ''
  });
  const [availableFlats, setAvailableFlats] = useState<any[]>([]);

  useEffect(() => {
    fetchLeads();
    fetchBrokers();
    fetchAvailableFlats();

    const channel = supabase
      .channel('leads-page-' + Date.now())
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'leads_customers'
      }, (payload) => {
        console.log('Lead change detected:', payload.eventType);
        fetchLeads(); // Refetch all leads
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('leads_customers')
      .select(`
        *,
        assigned_user:users(
          id, name, avatar_initials
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Leads fetch error:', error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setLeads(data || []);
    setLoading(false);
  };

  const fetchBrokers = async () => {
    const { data } = await supabase
      .from('users')
      .select('id, name, avatar_initials, role')
      .in('role', ['BROKER', 'VP_SALES', 'MD', 'ADMIN']);
    setBrokers(data || []);
  };

  const fetchAvailableFlats = async () => {
    const { data } = await supabase
      .from('flats_inventory')
      .select('flat_id, flat_number, project, type, price')
      .in('status', ['Available', 'On Hold'])
      .order('project')
      .order('flat_number');
    setAvailableFlats(data || []);
  };

  // Filtered leads using useMemo
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = !searchQuery ||
        lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone?.includes(searchQuery) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' ||
        lead.status === statusFilter;

      const matchesSource = sourceFilter === 'all' ||
        lead.source === sourceFilter;

      const matchesBroker = brokerFilter === 'all' ||
        lead.assigned_user_id === brokerFilter;

      const matchesDateFrom = !dateFrom ||
        new Date(lead.created_at) >= new Date(dateFrom);

      const matchesDateTo = !dateTo ||
        new Date(lead.created_at) <= new Date(dateTo);

      return matchesSearch && matchesStatus &&
        matchesSource && matchesBroker &&
        matchesDateFrom && matchesDateTo;
    });
  }, [leads, searchQuery, statusFilter, sourceFilter, brokerFilter, dateFrom, dateTo]);

  // KPI stats from real data
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'New').length;
  const contacted = leads.filter(l => l.status === 'Contacted').length;
  const siteVisits = leads.filter(l => l.status?.includes('Site Visit')).length;
  const converted = leads.filter(l => l.status === 'Converted').length;

  // Add lead function
  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast({
        title: 'Validation Error',
        description: 'Name and phone are required',
        variant: 'destructive'
      });
      return;
    }

    setAddLoading(true);

    const { data, error } = await supabase
      .from('leads_customers')
      .insert({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        source: formData.source || 'Direct',
        status: 'New',
        assigned_user_id: formData.assignedUserId || null,
        project_interest: formData.projectInterest || null,
        flat_type_interest: formData.flatTypeInterest || null,
        notes: formData.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_activity: new Date().toISOString()
      })
      .select('*, assigned_user:users(id, name, avatar_initials)')
      .single();

    if (error) {
      toast({
        title: 'Error adding lead',
        description: error.message,
        variant: 'destructive'
      });
      setAddLoading(false);
      return;
    }

    // Add new lead to state immediately
    setLeads(prev => [data, ...prev]);

    toast({
      title: 'Lead added successfully',
      description: `${formData.name} has been added`
    });

    setFormData({
      name: '', phone: '', email: '',
      source: 'Direct', assignedUserId: '',
      projectInterest: '', flatTypeInterest: '',
      notes: ''
    });
    setShowAddSheet(false);
    setAddLoading(false);
  };

  // Update lead status
  const updateLeadStatus = async (id: string, status: string) => {
    // Optimistic UI update
    setLeads(prev => prev.map(l => 
      l.id === id ? { ...l, status, last_activity: new Date().toISOString() } : l
    ));

    const { error } = await supabase
      .from('leads_customers')
      .update({
        status,
        last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      fetchLeads(); // Fallback on error
    } else {
      toast({ title: `Status updated to ${status}` });
    }
  };

  // Edit handlers
  const handleEditClick = (lead: any) => {
    setEditingLead(lead);
    setEditForm({
      name: lead.name || '',
      phone: lead.phone || '',
      email: lead.email || '',
      source: lead.source || '',
      assignedUserId: lead.assigned_user_id || '',
      projectInterest: lead.project_interest || '',
      flatTypeInterest: lead.flat_type_interest || '',
      notes: lead.notes || '',
      status: lead.status || 'New'
    });
    setShowEditSheet(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;

    // Optimistic UI update
    setLeads(prev => prev.map(l =>
      l.id === editingLead.id
        ? {
            ...l,
            name: editForm.name,
            phone: editForm.phone,
            email: editForm.email,
            source: editForm.source,
            status: editForm.status,
            assigned_user_id: editForm.assignedUserId,
            notes: editForm.notes,
            project_interest: editForm.projectInterest,
            flat_type_interest: editForm.flatTypeInterest,
            updated_at: new Date().toISOString()
          }
        : l
    ));

    setShowEditSheet(false);
    setEditingLead(null);

    const { error } = await supabase
      .from('leads_customers')
      .update({
        name: editForm.name,
        phone: editForm.phone,
        email: editForm.email || null,
        source: editForm.source,
        status: editForm.status,
        assigned_user_id: editForm.assignedUserId || null,
        project_interest: editForm.projectInterest || null,
        flat_type_interest: editForm.flatTypeInterest || null,
        notes: editForm.notes || null,
        updated_at: new Date().toISOString(),
        last_activity: new Date().toISOString()
      })
      .eq('id', editingLead.id);

    if (error) {
      toast({
        title: 'Error updating lead',
        description: error.message,
        variant: 'destructive'
      });
      fetchLeads(); // Fallback on error
    } else {
      toast({ title: 'Lead updated successfully' });
    }
  };

  // Schedule Visit handler
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!visitForm.visitDate || !visitForm.visitTime) {
      toast({
        title: 'Required fields missing',
        description: 'Please select date and time',
        variant: 'destructive'
      });
      return;
    }

    setScheduleLoading(true);

    const scheduledAt = new Date(
      visitForm.visitDate + 'T' + 
      visitForm.visitTime + ':00'
    ).toISOString();

    const { error: visitError } = await supabase
      .from('site_visits')
      .insert({
        lead_id: selectedLeadForVisit.id,
        flat_id: visitForm.flatId || null,
        assigned_user_id: 
          visitForm.brokerId || 
          selectedLeadForVisit.assigned_user_id || 
          null,
        scheduled_at: scheduledAt,
        status: 'Scheduled',
        reminder_sent: false,
        notes: visitForm.notes || null,
        created_at: new Date().toISOString()
      });

    if (visitError) {
      toast({
        title: 'Failed to schedule visit',
        description: visitError.message,
        variant: 'destructive'
      });
      setScheduleLoading(false);
      return;
    }

    // Update lead status to Site Visit Scheduled
    await supabase
      .from('leads_customers')
      .update({
        status: 'Site Visit Scheduled',
        last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', selectedLeadForVisit.id);

    const formattedDate = new Date(scheduledAt)
      .toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    const formattedTime = new Date(scheduledAt)
      .toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

    toast({
      title: 'Site visit scheduled!',
      description: 
        `${selectedLeadForVisit.name} — ` +
        `${formattedDate} at ${formattedTime}`
    });

    // Reset form and close
    setVisitForm({
      flatId: '', visitDate: '',
      visitTime: '', brokerId: '', notes: ''
    });
    setShowScheduleDialog(false);
    setSelectedLeadForVisit(null);
    setScheduleLoading(false);
  };

  // Delete lead
  const deleteLead = async (id: string) => {
    // Optimistic UI update
    setLeads(prev => prev.filter(l => l.id !== id));

    const { error } = await supabase
      .from('leads_customers')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      fetchLeads(); // Fallback on error
    } else {
      toast({ title: 'Lead deleted' });
      if (selectedLead?.id === id) setSelectedLead(null);
    }
  };

  // Export CSV
  const exportCSV = () => {
    const headers = [
      'Name', 'Phone', 'Email', 'Source',
      'Status', 'Assigned Broker', 'Created Date'
    ];
    const rows = filteredLeads.map(l => [
      l.name || '',
      l.phone || '',
      l.email || '',
      l.source || '',
      l.status || '',
      l.assigned_user?.name || '',
      new Date(l.created_at).toLocaleDateString('en-IN')
    ]);
    const csv = [headers, ...rows]
      .map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'CSV exported successfully' });
  };

  if (error) {
    return (
      <div className="p-12 text-center space-y-4">
        <XCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold">Error loading leads</h2>
        <p className="text-gray-500 max-w-md mx-auto">{error}</p>
        <Button onClick={fetchLeads} variant="outline" className="rounded-[10px]">
          <Loader2 className="mr-2 h-4 w-4" /> Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1700px] mx-auto pb-24 space-y-8 font-sans">
      
      {/* HEADER & KPI CARDS */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Lead Management</h1>
            <p className="text-[#64748B] text-sm mt-1">Manage, filter, and track all your prospective buyers</p>
          </div>
          <Button
            onClick={() => setShowAddSheet(true)}
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold px-4 py-2 rounded-[10px] text-sm shadow-md transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          {loading ? (
            Array(5).fill(0).map((_, i) => (
              <Card key={i} className="bg-white border-[#E8ECF0] rounded-[16px]">
                <CardContent className="p-4 flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-[10px]" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            [
              { label: "Total", value: totalLeads, icon: Users, color: "from-blue-600 to-blue-400", shadow: "shadow-blue-500/30" },
              { label: "New Today", value: newLeads, icon: UserPlus, color: "from-cyan-500 to-cyan-400", shadow: "shadow-cyan-500/30" },
              { label: "Contacted", value: contacted, icon: PhoneCall, color: "from-yellow-500 to-amber-400", shadow: "shadow-yellow-500/30" },
              { label: "Site Visit", value: siteVisits, icon: Calendar, color: "from-purple-600 to-purple-400", shadow: "shadow-purple-500/30" },
              { label: "Converted", value: converted, icon: CheckCircle2, color: "from-green-500 to-emerald-400", shadow: "shadow-green-500/30" },
            ].map((kpi, i) => (
              <Card 
                key={i}
                className="overflow-hidden bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-[#CBD5E1]"
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-[10px] bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white shadow-md ${kpi.shadow} shrink-0`}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-bold text-[#0F172A] leading-none">{kpi.value}</h3>
                    <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] mt-1">{kpi.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      {/* FILTER BAR */}
      <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
        <div className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex-1 w-full flex flex-col md:flex-row gap-3">
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                   placeholder="Search name, phone, email..." 
                   className="w-full pl-9 rounded-[10px] border-gray-200 bg-[#F8FAFC] focus:bg-white text-sm" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[150px] rounded-[10px] border-gray-200 bg-[#F8FAFC]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Site Visit Scheduled">Site Visit Scheduled</SelectItem>
                  <SelectItem value="Negotiation">Negotiation</SelectItem>
                  <SelectItem value="Converted">Converted</SelectItem>
                  <SelectItem value="Lost">Lost</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-full md:w-[150px] rounded-[10px] border-gray-200 bg-[#F8FAFC]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="Meta">Meta</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                  <SelectItem value="99acres">99acres</SelectItem>
                  <SelectItem value="Direct">Direct</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Button onClick={exportCSV} variant="outline" className="rounded-[10px] border-gray-200 bg-white text-[#0F172A] font-semibold">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-50 items-center">
            <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mr-2">Advanced:</span>
            <Select value={brokerFilter} onValueChange={setBrokerFilter}>
              <SelectTrigger className="w-[180px] h-8 text-xs rounded-[8px] border-none bg-gray-100">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brokers</SelectItem>
                {brokers.map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
               <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-8 text-xs w-[130px] rounded-[8px] bg-gray-100 border-none" />
               <span className="text-xs text-gray-400">to</span>
               <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-8 text-xs w-[130px] rounded-[8px] bg-gray-100 border-none" />
            </div>
            {(statusFilter !== 'all' || sourceFilter !== 'all' || brokerFilter !== 'all' || searchQuery || dateFrom || dateTo) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setStatusFilter('all'); setSourceFilter('all'); setBrokerFilter('all');
                  setSearchQuery(''); setDateFrom(''); setDateTo('');
                }}
                className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* ADD LEAD DIALOG */}
      <Dialog open={showAddSheet} onOpenChange={setShowAddSheet}>
        <DialogContent
          className="max-w-[560px] w-full rounded-2xl p-0 overflow-hidden max-h-[90vh]"
        >
          {/* Dark header */}
          <div className="bg-[#0A1628] px-6 py-5 flex items-center justify-between">
            <div>
              <DialogTitle className="text-white text-lg font-semibold">
                Add New Lead
              </DialogTitle>
              <p className="text-blue-300 text-sm mt-1">
                Fill in the details below
              </p>
            </div>
            <button
              onClick={() => setShowAddSheet(false)}
              className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable form */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <form
              id="add-lead-form"
              onSubmit={handleAddLead}
              className="px-6 py-5 space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Full Name *</Label>
                  <Input
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="rounded-[10px] h-10"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Phone Number *</Label>
                  <Input
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                    className="rounded-[10px] h-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    className="rounded-[10px] h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Lead Source *</Label>
                  <Select
                    value={formData.source}
                    onValueChange={val => setFormData(p => ({ ...p, source: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Meta">Meta</SelectItem>
                      <SelectItem value="Google">Google</SelectItem>
                      <SelectItem value="99acres">99acres</SelectItem>
                      <SelectItem value="Direct">Direct</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Assign Broker</Label>
                  <Select
                    value={formData.assignedUserId}
                    onValueChange={val => setFormData(p => ({ ...p, assignedUserId: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select broker" />
                    </SelectTrigger>
                    <SelectContent>
                      {brokers.map(b => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Project Interest</Label>
                  <Select
                    value={formData.projectInterest}
                    onValueChange={val => setFormData(p => ({ ...p, projectInterest: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tower A">Tower A</SelectItem>
                      <SelectItem value="Tower B">Tower B</SelectItem>
                      <SelectItem value="Villas">Villas</SelectItem>
                      <SelectItem value="Commercial Hub">Commercial Hub</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Flat Type Interest</Label>
                <Select
                  value={formData.flatTypeInterest}
                  onValueChange={val => setFormData(p => ({ ...p, flatTypeInterest: val }))}
                >
                  <SelectTrigger className="rounded-[10px] h-10">
                    <SelectValue placeholder="Select flat type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1BHK">1BHK</SelectItem>
                    <SelectItem value="2BHK">2BHK</SelectItem>
                    <SelectItem value="3BHK">3BHK</SelectItem>
                    <SelectItem value="4BHK">4BHK</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Notes</Label>
                <Textarea
                  placeholder="Additional notes..."
                  value={formData.notes}
                  onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                  rows={3}
                  className="rounded-[10px] resize-none"
                />
              </div>
            </form>
          </div>

          {/* Sticky footer */}
          <div className="border-t px-6 py-4 flex gap-3 bg-white">
            <Button
              type="submit"
              form="add-lead-form"
              disabled={addLoading}
              className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-[10px] h-10"
            >
              {addLoading ? 'Adding...' : 'Add Lead'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-[10px] h-10 px-6"
              onClick={() => {
                setShowAddSheet(false);
                setFormData({
                  name: '', phone: '', email: '',
                  source: 'Direct', assignedUserId: '',
                  projectInterest: '',
                  flatTypeInterest: '', notes: ''
                });
              }}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* LEADS TABLE */}
      <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-8 space-y-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                ))}
             </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-20">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900">{searchQuery ? 'No results found' : 'No leads found'}</h3>
              <p className="text-gray-500 mb-6">{searchQuery ? 'Try adjusting your filters' : 'Add your first lead'}</p>
              {!searchQuery && <Button onClick={() => setShowAddSheet(true)} className="rounded-[10px] bg-[#0066FF]">Add First Lead</Button>}
            </div>
          ) : (
          <Table>
            <TableHeader className="bg-[#F8FAFC] border-b border-gray-200">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="w-[50px] text-center pl-4 text-[12px] font-semibold text-[#64748B] uppercase">#</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] py-4">Name + ID</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Phone + Email</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Source</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Status</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Broker</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Project</TableHead>
                <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Dates</TableHead>
                <TableHead className="text-right pr-6 text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead, index) => {
                const brokerInitial1 = lead.assigned_user?.name?.charAt(0) || 'U';
                const brokerInitial2 = lead.assigned_user?.name?.split(' ')[1]?.charAt(0) || '';
                const brokerName = lead.assigned_user?.name || 'Unassigned';
                const projectName = lead.project_interest || lead.preferred_project || 'Any';
                
                return (
                <TableRow key={lead.id} className={`group hover:bg-[#F0F4F8]/60 transition-colors border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]/30'}`}>
                  <TableCell className="w-[50px] text-center pl-4 text-gray-400 font-medium text-sm">{index + 1}</TableCell>
                  <TableCell className="py-4">
                    <div className="font-bold text-[#0F172A] text-[14px]">{lead.name}</div>
                    <div className="text-[12px] text-gray-400 font-medium">ID: {(lead.id || '').substring(0,8)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-[13px] font-medium text-[#0F172A] flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400"/> {lead.phone}</div>
                    <div className="text-[12px] text-[#64748B]">{lead.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getSourceColor(lead.source)} text-[11px] rounded-full uppercase border-transparent`}>{lead.source || 'Direct'}</Badge>
                  </TableCell>
                   <TableCell>
                    <Select
                      value={lead.status}
                      onValueChange={(newStatus) => updateLeadStatus(lead.id, newStatus)}
                    >
                      <SelectTrigger className="w-[160px] h-7 text-xs border-0 p-0 focus:ring-0 bg-transparent hover:bg-gray-50 rounded-full px-2">
                        <Badge className={`${getStatusColor(lead.status)} shadow-none text-[11px] rounded-full font-bold uppercase tracking-wide border-transparent pointer-events-none`}>
                          {lead.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {LEAD_STATUSES.map(s => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#0066FF] to-indigo-400 text-white font-bold flex items-center justify-center text-[9px] shadow-sm">{brokerInitial1}{brokerInitial2}</div>
                      <span className="text-[13px] font-medium text-[#0F172A]">{brokerName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#0F172A]">
                      <Building2 className="w-3.5 h-3.5 text-gray-400" /> {projectName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-[13px] text-[#0F172A] font-medium">
                      {new Date(lead.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      {new Date(lead.created_at).toLocaleTimeString('en-IN', {
                        hour: '2-digit', minute: '2-digit', hour12: true
                      })}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      Last active: {lead.last_activity ? 
                        new Date(lead.last_activity).toLocaleTimeString('en-IN', {
                          hour: '2-digit', minute: '2-digit', hour12: true
                        }) : 'N/A'
                      }
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[8px] text-[#64748B] hover:text-[#0066FF] hover:bg-blue-50" onClick={() => setSelectedLead(lead)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[90vw] sm:max-w-[520px] p-0 border-l border-gray-200">
                          <div className="p-6 border-b border-gray-100 bg-[#F8FAFC]">
                            <div className="flex items-start gap-4">
                              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#0066FF] to-indigo-500 text-white font-bold flex items-center justify-center text-[20px] shadow-md">
                                {selectedLead?.name?.split(' ')[0]?.[0] || 'U'}{selectedLead?.name?.split(' ')[1]?.[0] || ''}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h2 className="text-xl font-bold text-[#0F172A]">{selectedLead?.name}</h2>
                                  <Badge className={`${getStatusColor(selectedLead?.status || '')} shadow-none text-[11px] rounded-full font-bold uppercase border-transparent`}>{selectedLead?.status}</Badge>
                                </div>
                                <p className="text-sm text-[#64748B] mb-2">ID: {(selectedLead?.id || '').substring(0,8)} • Added {new Date(selectedLead?.created_at || Date.now()).toLocaleDateString()}</p>
                                <Badge variant="outline" className={`${getSourceColor(selectedLead?.source || '')} text-[10px] rounded-full uppercase border-transparent`}>{selectedLead?.source || 'Direct'}</Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(100vh-250px)]">
                            <div className="space-y-3">
                              <h3 className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Contact Info</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#F8FAFC] p-3 rounded-[12px] border border-gray-100">
                                  <p className="text-[11px] text-[#64748B] uppercase font-bold mb-1">Phone</p>
                                  <p className="text-[14px] font-semibold text-[#0F172A]">{selectedLead?.phone}</p>
                                </div>
                                <div className="bg-[#F8FAFC] p-3 rounded-[12px] border border-gray-100">
                                  <p className="text-[11px] text-[#64748B] uppercase font-bold mb-1">Email</p>
                                  <p className="text-[14px] font-semibold text-[#0F172A]">{selectedLead?.email || 'N/A'}</p>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h3 className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Project Interest</h3>
                                <p className="text-sm font-semibold">{selectedLead?.project_interest || 'Any / All'}</p>
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Assigned To</h3>
                                <p className="text-sm font-semibold">{selectedLead?.assigned_user?.name || 'Unassigned'}</p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h3 className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Notes</h3>
                              <div className="bg-[#F8FAFC] p-4 rounded-[12px] border border-gray-100 min-h-[100px] text-sm text-[#0F172A]">
                                {selectedLead?.notes || 'No notes added yet.'}
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                               <h3 className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Update Status</h3>
                               <div className="flex flex-wrap gap-2">
                                  {['New', 'Contacted', 'Site Visit Scheduled', 'Negotiation', 'Converted', 'Lost'].map(st => (
                                    <Button 
                                      key={st} 
                                      variant={selectedLead?.status === st ? "default" : "outline"} 
                                      onClick={() => updateLeadStatus(selectedLead?.id, st)}
                                      className={`text-[11px] h-8 rounded-full px-4 ${selectedLead?.status === st ? 'bg-[#0066FF]' : ''}`}
                                    >
                                      {st}
                                    </Button>
                                  ))}
                               </div>
                            </div>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white flex flex-wrap gap-2">
                            <Button onClick={() => updateLeadStatus(selectedLead?.id, 'Converted')} className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white rounded-[10px] shadow-md font-semibold h-11">
                               <CheckCircle2 className="w-4 h-4 mr-2" /> Convert Lead
                            </Button>
                            <Button onClick={() => deleteLead(selectedLead?.id)} variant="ghost" className="border-none text-red-500 hover:bg-red-50 hover:text-red-600 rounded-[10px] h-11 px-6">
                               <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </SheetContent>
                      </Sheet>
                      <Button onClick={() => handleEditClick(lead)} variant="ghost" size="icon" className="h-8 w-8 rounded-[8px] text-[#64748B] hover:text-[#0066FF] hover:bg-blue-50">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={() => {
                          setSelectedLeadForVisit(lead);
                          setVisitForm({
                            flatId: lead.flat_id || '',
                            visitDate: '',
                            visitTime: '',
                            brokerId: lead.assigned_user_id || '',
                            notes: ''
                          });
                          setShowScheduleDialog(true);
                        }} 
                        variant="ghost" size="icon" className="h-8 w-8 rounded-[8px] text-[#25D366] hover:text-[#1DA851] hover:bg-green-50"
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => deleteLead(lead.id)} variant="ghost" size="icon" className="h-8 w-8 rounded-[8px] text-red-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                )})}
            </TableBody>
          </Table>
          )}
        </div>
      </Card>

      {/* EDIT LEAD DIALOG */}
      <Dialog open={showEditSheet} onOpenChange={setShowEditSheet}>
        <DialogContent
          className="max-w-[560px] w-full rounded-2xl p-0 overflow-hidden max-h-[90vh]"
        >
          {/* Dark header */}
          <div className="bg-[#0A1628] px-6 py-5 flex items-center justify-between">
            <div>
              <DialogTitle className="text-white text-lg font-semibold">
                Edit Lead
              </DialogTitle>
              <p className="text-blue-300 text-sm mt-1">
                Update lead information and status
              </p>
            </div>
            <button
              onClick={() => setShowEditSheet(false)}
              className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable form */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <form
              id="edit-lead-form"
              onSubmit={handleSaveEdit}
              className="px-6 py-5 space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Full Name *</Label>
                  <Input
                    placeholder="Enter full name"
                    value={editForm.name}
                    onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                    className="rounded-[10px] h-10"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Phone Number *</Label>
                  <Input
                    placeholder="10-digit number"
                    value={editForm.phone}
                    onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))}
                    className="rounded-[10px] h-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={editForm.email}
                    onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
                    className="rounded-[10px] h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Lead Source *</Label>
                  <Select
                    value={editForm.source}
                    onValueChange={val => setEditForm(p => ({ ...p, source: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Meta">Meta</SelectItem>
                      <SelectItem value="Google">Google</SelectItem>
                      <SelectItem value="99acres">99acres</SelectItem>
                      <SelectItem value="Direct">Direct</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Current Status *</Label>
                  <Select
                    value={editForm.status}
                    onValueChange={val => setEditForm(p => ({ ...p, status: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAD_STATUSES.map(s => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Assign Broker</Label>
                  <Select
                    value={editForm.assignedUserId}
                    onValueChange={val => setEditForm(p => ({ ...p, assignedUserId: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select broker" />
                    </SelectTrigger>
                    <SelectContent>
                      {brokers.map(b => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Project Interest</Label>
                  <Select
                    value={editForm.projectInterest}
                    onValueChange={val => setEditForm(p => ({ ...p, projectInterest: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tower A">Tower A</SelectItem>
                      <SelectItem value="Tower B">Tower B</SelectItem>
                      <SelectItem value="Villas">Villas</SelectItem>
                      <SelectItem value="Commercial Hub">Commercial Hub</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Flat Type</Label>
                  <Select
                    value={editForm.flatTypeInterest}
                    onValueChange={val => setEditForm(p => ({ ...p, flatTypeInterest: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select flat type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1BHK">1BHK</SelectItem>
                      <SelectItem value="2BHK">2BHK</SelectItem>
                      <SelectItem value="3BHK">3BHK</SelectItem>
                      <SelectItem value="4BHK">4BHK</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Notes</Label>
                <Textarea
                  placeholder="Additional notes..."
                  value={editForm.notes}
                  onChange={e => setEditForm(p => ({ ...p, notes: e.target.value }))}
                  rows={3}
                  className="rounded-[10px] resize-none"
                />
              </div>
            </form>
          </div>

          {/* Sticky footer */}
          <div className="border-t px-6 py-4 flex gap-3 bg-white">
            <Button
              type="submit"
              form="edit-lead-form"
              disabled={addLoading}
              className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-[10px] h-10"
            >
              {addLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-[10px] h-10 px-6"
              onClick={() => setShowEditSheet(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* SCHEDULE VISIT DIALOG */}
      <Dialog
        open={showScheduleDialog}
        onOpenChange={(open) => {
          setShowScheduleDialog(open);
          if (!open) {
            setSelectedLeadForVisit(null);
            setVisitForm({
              flatId: '', visitDate: '',
              visitTime: '', brokerId: '', notes: ''
            });
          }
        }}
      >
        <DialogContent className="max-w-[480px] rounded-2xl p-0 overflow-hidden">
          <div className="bg-[#0A1628] px-6 py-5">
            <DialogTitle className="text-white text-lg font-semibold">
              Schedule Site Visit
            </DialogTitle>
            {selectedLeadForVisit && (
              <p className="text-blue-300 text-sm mt-1">
                {selectedLeadForVisit.name} · {selectedLeadForVisit.phone}
              </p>
            )}
          </div>

          <form onSubmit={handleScheduleSubmit} className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Select Property</Label>
              <Select
                value={visitForm.flatId}
                onValueChange={val => setVisitForm(p => ({...p, flatId: val}))}
              >
                <SelectTrigger className="rounded-[10px]">
                  <SelectValue placeholder="Choose a flat (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {availableFlats.map(flat => (
                    <SelectItem key={flat.flat_id} value={flat.flat_id}>
                      {flat.flat_number} — {flat.project} ({flat.type}) — ₹{(flat.price/100000).toFixed(1)}L
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Visit Date *</Label>
                <Input
                  type="date"
                  value={visitForm.visitDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setVisitForm(p => ({...p, visitDate: e.target.value}))}
                  className="rounded-[10px]"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Visit Time *</Label>
                <Input
                  type="time"
                  value={visitForm.visitTime}
                  onChange={e => setVisitForm(p => ({...p, visitTime: e.target.value}))}
                  className="rounded-[10px]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Assign Broker</Label>
              <Select
                value={visitForm.brokerId}
                onValueChange={val => setVisitForm(p => ({...p, brokerId: val}))}
              >
                <SelectTrigger className="rounded-[10px]">
                  <SelectValue placeholder="Select broker" />
                </SelectTrigger>
                <SelectContent>
                  {brokers.map(b => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Notes</Label>
              <Textarea
                placeholder="Special instructions or notes..."
                value={visitForm.notes}
                onChange={e => setVisitForm(p => ({...p, notes: e.target.value}))}
                className="rounded-[10px] resize-none"
                rows={2}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={scheduleLoading}
                className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-[10px] h-10"
              >
                {scheduleLoading ? 'Scheduling...' : 'Confirm Visit'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-[10px] h-10 px-6"
                onClick={() => {
                  setShowScheduleDialog(false);
                  setSelectedLeadForVisit(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
