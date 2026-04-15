'use client';

import { createBrowserClient } from '@/lib/supabase-browser';
import { useEffect, useState } from 'react';
import { 
  Building2, LayoutDashboard, Users, Calendar, MessageCircle, TrendingUp, IndianRupee, Search, MoreHorizontal, MessageSquare, Phone, MapPin, Clock, GripVertical, CheckSquare, Hexagon,
  Eye, Edit, Trash2, Plus, X
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';

// Helper styles
function getStatusColor(status: string) {
  if (!status) return "bg-gray-100 text-gray-700 border-none";
  switch (status.toLowerCase()) {
    case 'new': case 'available': return "bg-blue-100 text-[#0066FF] border-none"
    case 'contacted': case 'on hold': return "bg-yellow-100 text-yellow-700 border-none"
    case 'site visit scheduled': case 'site visit': return "bg-purple-100 text-purple-700 border-none"
    case 'negotiation': return "bg-orange-100 text-orange-700 border-none"
    case 'converted': case 'sold': case 'confirmed': return "bg-green-100 text-green-700 border-none"
    case 'lost': return "bg-red-100 text-red-700 border-none"
    case 'scheduled': return "bg-indigo-100 text-indigo-700 border-none"
    case 'pending': return "bg-slate-100 text-slate-700 border-none"
    default: return "bg-gray-100 text-gray-700 border-none"
  }
}

function getSourceColor(source: string) {
  if (!source) return "bg-gray-100 text-gray-700 border-none";
  switch (source.toLowerCase()) {
    case 'meta': return "bg-indigo-100 text-indigo-700 border-none"
    case 'google': return "bg-orange-100 text-orange-700 border-none"
    case '99acres': return "bg-teal-100 text-teal-700 border-none"
    case 'direct': return "bg-slate-100 text-slate-700 border-none"
    default: return "bg-gray-100 text-gray-700 border-none"
  }
}

const whatsappData = [
  { text: "Brochure sent to Rajesh Kumar", time: "2 min ago", status: "Delivered" },
  { text: "Reminder sent to Priya Sharma", time: "1 hr ago", status: "Read" },
];

export default function SalesDashboardClient() {
  const supabase = createBrowserClient();
  const [leads, setLeads] = useState<any[]>([]);
  const [flats, setFlats] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: '', phone: '', email: '',
    source: '', status: '',
    assignedUserId: '', notes: '',
    projectInterest: '', flatTypeInterest: ''
  });
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '',
    source: 'Direct', assignedUserId: '',
    projectInterest: '', flatTypeInterest: '',
    notes: ''
  });
  const [visitForm, setVisitForm] = useState({
    flatId: '', visitDate: '',
    visitTime: '', brokerId: '', notes: ''
  });
  const [availableFlats, setAvailableFlats] = useState<any[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    fetchAllData();
    fetchBrokers();
    fetchAvailableFlats();

    // Real-time subscriptions
    const leadsChannel = supabase
      .channel('home-leads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads_customers' }, () => fetchAllData())
      .subscribe();

    const flatsChannel = supabase
      .channel('home-flats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'flats_inventory' }, () => fetchAllData())
      .subscribe();

    const visitsChannel = supabase
      .channel('home-visits')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_visits' }, () => fetchAllData())
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(flatsChannel);
      supabase.removeChannel(visitsChannel);
    };
  }, []);

  const fetchAllData = async () => {
    const [
      { data: leadsData },
      { data: flatsData },
      { data: visitsData }
    ] = await Promise.all([
      supabase
        .from('leads_customers')
        .select('*, assigned_user:users(id,name,avatar_initials)')
        .order('created_at', { ascending: false }),
      supabase
        .from('flats_inventory')
        .select('*')
        .order('project')
        .order('flat_number'),
      supabase
        .from('site_visits')
        .select(`
          *,
          lead:leads_customers(id,name,phone),
          flat:flats_inventory(flat_id,flat_number,project,type),
          broker:users(id,name,avatar_initials)
        `)
        .order('scheduled_at', { ascending: true })
    ]);

    setLeads(leadsData || []);
    setFlats(flatsData || []);
    setVisits(visitsData || []);
    setLoading(false);
  };

  const fetchBrokers = async () => {
    const { data } = await supabase
      .from('users')
      .select('id, name, role')
      .in('role', ['BROKER', 'VP_SALES', 'MD']);
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

  const updateLeadStatus = async (id: string, status: string) => {
    // Update local state immediately (optimistic UI)
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
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive'
      });
      fetchAllData(); // Restore on failure
    } else {
      toast({ 
        title: `Status updated`,
        description: `Moved to ${status}`
      });
    }
  };

  const handleSaveEdit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedLead) return;

    // Update local state immediately (optimistic UI)
    setLeads(prev => prev.map(l =>
      l.id === selectedLead.id
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
    setSelectedLead(null);

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
      .eq('id', selectedLead.id);

    if (error) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive'
      });
      fetchAllData(); // Restore on failure
    } else {
      toast({ title: 'Lead updated successfully' });
    }
  };

  const handleAddLead = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.name || !formData.phone) {
      toast({
        title: 'Name and phone are required',
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

    // Add new lead to top of list immediately (optimistic UI fallback - actually it's adding the real data)
    setLeads(prev => [data, ...prev]);

    toast({
      title: 'Lead added!',
      description: `${formData.name} added successfully`
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

  const deleteLead = async (id: string) => {
    // Remove from local state IMMEDIATELY (optimistic UI)
    setLeads(prev => prev.filter(l => l.id !== id));

    const { error } = await supabase
      .from('leads_customers')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Delete failed',
        description: error.message,
        variant: 'destructive'
      });
      fetchAllData(); // Restore on failure
    } else {
      toast({ title: 'Lead deleted successfully' });
    }
  };

  // Calculate ALL KPI values from real data
  const totalLeads = leads.length;
  
  const todayVisits = visits.filter(v => {
    const today = new Date().toISOString().split('T')[0];
    return v.scheduled_at?.startsWith(today);
  }).length;
  
  const convertedLeads = leads.filter(l => l.status === 'Converted').length;
  
  const soldFlats = flats.filter(f => f.status === 'Sold');
  const revenuePipeline = soldFlats.reduce((sum, f) => sum + (f.price || 0), 0);

  const unitsSold = soldFlats.length;

  const kanbanData = {
    New: { color: "border-blue-500", items: leads.filter(l => l.status === 'New') },
    Contacted: { color: "border-yellow-400", items: leads.filter(l => l.status === 'Contacted') },
    SiteVisit: { color: "border-purple-500", items: leads.filter(l => l.status === 'Site Visit Scheduled') },
    Negotiation: { color: "border-orange-500", items: leads.filter(l => l.status === 'Negotiation') },
    Converted: { color: "border-green-500", items: leads.filter(l => l.status === 'Converted') },
    Lost: { color: "border-red-500", items: leads.filter(l => l.status === 'Lost') }
  };

  return (
    <div className="p-8 max-w-[1700px] mx-auto pb-24 space-y-8 font-sans">
      
      {/* SECTION 1 - KPI Cards */}
      <section>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card 
            className="overflow-hidden hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:border-[#CBD5E1] transition-all duration-200"
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E8ECF0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              padding: '20px',
              cursor: 'pointer'
            }}
          >
            <CardContent className="p-0 flex flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-[12px] bg-gradient-to-br from-[#0066FF] to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0">
                <Users className="h-8 w-8" />
              </div>
              <div className="flex flex-col justify-center w-full">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight tracking-tight">{totalLeads}</h3>
                    <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mt-0.5">Total Leads</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="overflow-hidden hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:border-[#CBD5E1] transition-all duration-200"
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E8ECF0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              padding: '20px',
              cursor: 'pointer'
            }}
          >
            <CardContent className="p-0 flex flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-[12px] bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 shrink-0">
                <Calendar className="h-8 w-8" />
              </div>
              <div className="flex flex-col justify-center w-full">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight tracking-tight">{todayVisits}</h3>
                    <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mt-0.5">Visits Today</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="overflow-hidden hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:border-[#CBD5E1] transition-all duration-200"
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E8ECF0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              padding: '20px',
              cursor: 'pointer'
            }}
          >
            <CardContent className="p-0 flex flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-[12px] bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-green-500/30 shrink-0">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div className="flex flex-col justify-center w-full">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight tracking-tight">{convertedLeads}</h3>
                    <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mt-0.5">Converted</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="overflow-hidden hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:border-[#CBD5E1] transition-all duration-200"
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E8ECF0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              padding: '20px',
              cursor: 'pointer'
            }}
          >
            <CardContent className="p-0 flex flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-[12px] bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 shrink-0">
                <IndianRupee className="h-8 w-8" />
              </div>
              <div className="flex flex-col justify-center w-full">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight tracking-tight">₹{(revenuePipeline/10000000).toFixed(1)}Cr</h3>
                    <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mt-0.5">Revenue Pipeline</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* MID SECTION - Kanban & Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SECTION 2 - Lead Pipeline Kanban Board */}
        <section className="lg:col-span-2 space-y-4 flex flex-col h-[500px]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">Pipeline Kanban</h2>
            <Button variant="outline" className="text-[#64748B] rounded-[10px] text-[13px] font-semibold h-8 border-gray-200">View Board</Button>
          </div>
          
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 h-full">
            {Object.entries(kanbanData).map(([stage, colInfo]) => (
              <div key={stage} className={`min-w-[300px] max-w-[300px] bg-[#F8FAFC] rounded-xl p-3 flex flex-col h-full border-t-[3px] shadow-sm ${colInfo.color}`}>
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="font-semibold text-[#0F172A] text-[14px]">
                    {stage.replace(/([A-Z])/g, ' $1').trim()} 
                    <span className="ml-2 text-[12px] text-gray-500 font-medium">({colInfo.items.length})</span>
                  </h3>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {colInfo.items.length === 0 ? (
                    <div className="text-sm text-gray-400 text-center mt-4">No leads</div>
                  ) : colInfo.items.map((lead: any, i: number) => (
                    <div key={i} className="p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group relative" style={{ background: '#FFFFFF', border: '1px solid #E8ECF0', borderRadius: '16px' }}>
                      <div className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="h-4 w-4 text-gray-300 hover:text-gray-500" />
                      </div>
                      <div className="font-bold text-[#0F172A] text-[14px] group-hover:text-[#0066FF] transition-colors">{lead.name}</div>
                      <div className="text-[#64748B] text-[13px] mt-1 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5"/> {lead.phone}</div>
                      <div className="flex items-center justify-between mt-4">
                        <Badge variant="secondary" className={`${getSourceColor(lead.source)} text-[11px] rounded-full px-2.5 py-0.5 font-semibold`}>{lead.source}</Badge>
                        <div className="flex items-center gap-2 text-[11px] text-[#64748B] font-medium">
                          <Clock className="w-3 h-3" /> {new Date(lead.created_at).toLocaleDateString()}
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#0066FF] to-[#6366F1] text-white font-bold flex items-center justify-center text-[9px] shadow-sm">
                            {lead.assigned_user?.avatar_initials || 'UN'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 7 - WhatsApp Activity Feed */}
        <section className="lg:col-span-1 space-y-4 flex flex-col h-[500px]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#25D366]" /> WhatsApp Activity
            </h2>
          </div>
          <Card className="flex-1 flex flex-col overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E8ECF0', borderRadius: '16px' }}>
            <div className="p-3 border-b border-gray-100 bg-[#F8FAFC]">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-200/50 p-1 rounded-[10px]">
                  <TabsTrigger value="all" className="rounded-[8px] text-[11px] font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#0F172A] text-gray-500">All</TabsTrigger>
                  <TabsTrigger value="sent" className="rounded-[8px] text-[11px] font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#0F172A] text-gray-500">Sent</TabsTrigger>
                  <TabsTrigger value="delivered" className="rounded-[8px] text-[11px] font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#0F172A] text-gray-500">Deliv</TabsTrigger>
                  <TabsTrigger value="read" className="rounded-[8px] text-[11px] font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-[#0F172A] text-gray-500">Read</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardContent className="p-0 flex-1 overflow-auto">
              <div className="divide-y divide-gray-100">
                {whatsappData.map((activity, i) => {
                  const statusColor = activity.status === 'Read' ? 'bg-[#3B82F6]' : activity.status === 'Delivered' ? 'bg-[#9CA3AF]' : 'bg-[#D1D5DB]'
                  return (
                  <div key={i} className="p-4 hover:bg-[#F0F4F8]/50 transition-colors flex items-start gap-3 group cursor-pointer">
                    <div className="h-8 w-8 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <MessageCircle className="h-4 w-4 text-[#10B981]" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-[13px] font-medium text-[#0F172A] group-hover:text-[#0066FF] transition-colors pr-2 leading-tight">{activity.text}</p>
                      <div className="flex flex-row gap-2 items-center justify-between mt-2">
                        <p className="text-[11px] text-[#64748B] font-semibold">{activity.time}</p>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-[#64748B] uppercase">{activity.status}</span>
                          <div className={`h-2 w-2 rounded-full ${statusColor}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </CardContent>
            <div className="p-3 border-t border-gray-100 bg-[#F8FAFC]">
               <Button className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold shadow-sm rounded-[10px]">Open Web WhatsApp</Button>
            </div>
          </Card>
        </section>
      </div>

      {/* SECTION 3 - Leads Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">Active Leads Database</h2>
          <Button
            onClick={() => setShowAddSheet(true)}
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold px-4 py-2 rounded-[10px] text-sm shadow-md transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
        <Card className="overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E8ECF0', borderRadius: '16px' }}>
          
          <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between bg-white items-center">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search name, phone, email..." className="w-full pl-9 rounded-[10px] border-gray-200 bg-[#F8FAFC] focus:bg-white text-sm" />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[150px] rounded-[10px] border-gray-200 bg-[#F8FAFC]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[150px] rounded-[10px] border-gray-200 bg-[#F8FAFC]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="meta">Meta Ads</SelectItem>
                  <SelectItem value="google">Google Ads</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#F8FAFC] border-b border-gray-200">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-[50px] text-center pl-4">
                    <CheckSquare className="w-4 h-4 text-gray-400" />
                  </TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] py-4">Lead Info</TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Contact</TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Platform</TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Pipeline Status</TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Assigned To</TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em]">Date Added</TableHead>
                  <TableHead className="text-right pr-6"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.slice(0, 10).map((lead: any, index: number) => (
                  <TableRow key={lead.id} className={`group hover:bg-[#F0F4F8]/60 transition-colors border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]/50'}`}>
                    <TableCell className="w-[50px] text-center pl-4">
                      <div className="w-4 h-4 border border-gray-300 rounded-[4px] mx-auto group-hover:border-[#0066FF] transition-colors" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="font-bold text-[#0F172A] text-[14px]">{lead.name}</div>
                      <div className="text-[12px] text-gray-400 font-medium">ID: {lead.id.substring(0,8)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-[13px] font-medium text-[#0F172A] flex items-center gap-1.5"><Phone className="w-3 h-3 text-gray-400"/> {lead.phone}</div>
                      <div className="text-[12px] text-[#64748B]">{lead.email || 'No email'}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getSourceColor(lead.source)} text-[11px] rounded-full uppercase`}>{lead.source}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(lead.status)} shadow-none text-[11px] rounded-full font-bold uppercase tracking-wide`}>{lead.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#0066FF] to-indigo-400 text-white font-bold flex items-center justify-center text-[9px] shadow-sm">
                          {lead.assigned_user?.avatar_initials || 'UN'}
                        </div>
                        <span className="text-[13px] font-medium text-[#0F172A]">{lead.assigned_user?.name || 'Unassigned'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[13px] text-[#64748B] font-medium">{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
                            >
                              <MoreHorizontal className="w-4 h-4 text-gray-500" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-lg">
                            {/* View Details */}
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer"
                              onClick={() => {
                                setSelectedLead(lead);
                                setEditForm({
                                  name: lead.name || '',
                                  phone: lead.phone || '',
                                  email: lead.email || '',
                                  source: lead.source || '',
                                  status: lead.status || 'New',
                                  assignedUserId: lead.assigned_user_id || '',
                                  notes: lead.notes || '',
                                  projectInterest: lead.project_interest || '',
                                  flatTypeInterest: lead.flat_type_interest || ''
                                });
                                setShowEditSheet(true);
                              }}
                            >
                              <Eye className="w-4 h-4 text-blue-500" />
                              View Details
                            </DropdownMenuItem>

                            {/* Edit Lead */}
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer"
                              onClick={() => {
                                setSelectedLead(lead);
                                setEditForm({
                                  name: lead.name || '',
                                  phone: lead.phone || '',
                                  email: lead.email || '',
                                  source: lead.source || '',
                                  status: lead.status || 'New',
                                  assignedUserId: lead.assigned_user_id || '',
                                  notes: lead.notes || '',
                                  projectInterest: lead.project_interest || '',
                                  flatTypeInterest: lead.flat_type_interest || ''
                                });
                                setShowEditSheet(true);
                              }}
                            >
                              <Edit className="w-4 h-4 text-gray-500" />
                              Edit Lead
                            </DropdownMenuItem>

                            {/* Schedule Visit */}
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer"
                              onClick={() => {
                                setSelectedLead(lead);
                                setVisitForm({
                                  flatId: '',
                                  visitDate: '',
                                  visitTime: '',
                                  brokerId: lead.assigned_user_id || '',
                                  notes: ''
                                });
                                setShowScheduleDialog(true);
                              }}
                            >
                              <Calendar className="w-4 h-4 text-purple-500" />
                              Schedule Visit
                            </DropdownMenuItem>

                            {/* WhatsApp */}
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer"
                              onClick={() => {
                                const phone = lead.phone?.replace(/\D/g, '');
                                window.open(`https://wa.me/91${phone}`, '_blank');
                              }}
                            >
                              <MessageCircle className="w-4 h-4 text-green-500" />
                              WhatsApp
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer text-blue-600"
                              onClick={() => updateLeadStatus(lead.id, 'Contacted')}
                            >
                              <TrendingUp className="w-4 h-4" />
                              Mark as Contacted
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="gap-2 cursor-pointer text-purple-600"
                              onClick={() => updateLeadStatus(lead.id, 'Site Visit Scheduled')}
                            >
                              <Calendar className="w-4 h-4" />
                              Mark Site Visit Scheduled
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="gap-2 cursor-pointer text-orange-600"
                              onClick={() => updateLeadStatus(lead.id, 'Negotiation')}
                            >
                              <TrendingUp className="w-4 h-4" />
                              Mark as Negotiation
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="gap-2 cursor-pointer text-green-600"
                              onClick={() => updateLeadStatus(lead.id, 'Converted')}
                            >
                              <TrendingUp className="w-4 h-4" />
                              Mark as Converted
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                              onClick={() => {
                                if (window.confirm(`Delete lead ${lead.name}? This cannot be undone.`)) {
                                  deleteLead(lead.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Lead
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </section>

      {/* BOTTOM LAYOUT - Inventory & Scheduler */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* SECTION 5 - Flat Inventory */}
        <section className="lg:col-span-3 space-y-4 flex flex-col h-full">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">Available Inventory</h2>
            <Button variant="ghost" className="text-[#0066FF] font-semibold hover:bg-blue-50 rounded-[10px]">Filter View</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flats.slice(0, 6).map((inv: any, i: number) => {
              const bColor = inv.status === 'Available' ? 'bg-emerald-500' : inv.status === 'Sold' ? 'bg-red-500' : 'bg-amber-500'
              return (
              <Card key={i} className="relative overflow-hidden group shadow-[0_2px_8px_rgba(0,0,0,0.04)] card-hover hover:border-[#CBD5E1] transition-all duration-200" style={{ background: '#FFFFFF', border: '1px solid #E8ECF0', borderRadius: '16px' }}>
                <div className={`h-2 w-full ${bColor} absolute top-0 left-0 right-0`} />
                <CardContent className="p-5 pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-[24px] font-bold text-[#0F172A] leading-none">{inv.flat_number}</h3>
                    <Badge variant="outline" className="text-[11px] rounded-full tracking-wider font-bold border-gray-200 text-gray-500 bg-[#F8FAFC]">
                      {inv.type}
                    </Badge>
                  </div>
                  <div className="space-y-2 mt-4 mb-5">
                    <p className="text-[13px] text-[#64748B] flex items-center gap-2 font-medium"><MapPin className="w-4 h-4 text-gray-400" /> Floor {inv.floor || '1'}</p>
                    <p className="text-[13px] text-[#64748B] flex items-center gap-2 font-medium"><Hexagon className="w-4 h-4 text-gray-400" /> {inv.area_sqft} sq.ft area</p>
                  </div>
                  <div className="flex items-end justify-between border-t border-gray-100 pt-3">
                    <div>
                      <p className="text-[10px] text-[#64748B] uppercase font-bold tracking-[0.05em]">Asking Price</p>
                      <p className="text-[16px] font-bold text-[#0F172A]">₹{(inv.price / 100000).toFixed(1)}L</p>
                    </div>
                    <Badge className={`${getStatusColor(inv.status)} text-[10px] rounded-full shadow-none font-bold uppercase tracking-wide`}>{inv.status}</Badge>
                  </div>
                  
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-md rounded-[10px] font-medium">View Plot Details</Button>
                  </div>
                </CardContent>
              </Card>
            )})}
            {flats.length === 0 && <div className="col-span-3 text-center py-10 text-gray-500">No inventory found</div>}
          </div>
        </section>

        {/* SECTION 6 - Site Visit Scheduler */}
        <section className="lg:col-span-2 space-y-4 flex flex-col h-full">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#0066FF]" /> Agenda & Visits
            </h2>
            <Button variant="ghost" className="text-[#0066FF] font-semibold hover:bg-blue-50 rounded-[10px] h-8 text-[13px]">Open Cal</Button>
          </div>
          <Card className="flex-1 flex flex-col overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E8ECF0', borderRadius: '16px' }}>
            <div className="p-4 border-b border-gray-100 bg-[#F8FAFC] flex justify-between items-center">
              <div className="font-bold text-[#0F172A] text-[15px]">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="h-7 w-7 rounded-[8px] text-gray-500 bg-white border-gray-200"><span className="text-[12px] font-bold">{"<"}</span></Button>
                <Button variant="outline" size="icon" className="h-7 w-7 rounded-[8px] text-gray-500 bg-white border-gray-200"><span className="text-[12px] font-bold">{">"}</span></Button>
              </div>
            </div>
            <CardContent className="p-0 flex-1">
              <div className="divide-y divide-gray-100">
                {visits.slice(0, 5).map((visit: any, i: number) => (
                  <div key={i} className="p-4 hover:bg-[#F0F4F8]/60 transition-colors flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-[#F8FAFC] border border-gray-200 text-[#0F172A] font-bold rounded-[10px] flex flex-col items-center justify-center shadow-sm shrink-0">
                        <span className="text-[9px] uppercase text-gray-400 font-semibold leading-none mb-0.5">{new Date(visit.scheduled_at).toLocaleDateString('en-US', {weekday: 'short'})}</span>
                        <span className="text-[13px] leading-none">{new Date(visit.scheduled_at).getDate()}</span>
                      </div>
                      <div>
                        <p className="font-bold text-[14px] text-[#0F172A] group-hover:text-[#0066FF] transition-colors">{visit.lead?.name || 'Unknown'}</p>
                        <p className="text-[12px] font-medium text-[#64748B] flex items-center gap-1.5 mt-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" /> {new Date(visit.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <Badge className={`${getStatusColor(visit.status)} text-[10px] rounded-full shadow-none font-bold uppercase`}>{visit.status || 'Pending'}</Badge>
                      <p className="text-[12px] font-bold text-gray-400 tracking-wide">#{visit.flat?.flat_number || 'TBD'}</p>
                    </div>
                  </div>
                ))}
                {visits.length === 0 && <div className="p-10 text-center text-gray-500">No scheduled visits</div>}
              </div>
            </CardContent>
          </Card>
        </section>

      </div>

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
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable form */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <form
              id="add-lead-form"
              onSubmit={handleAddLead}
              className="px-6 py-5 space-y-4"
            >
              {/* Row 1: Name + Phone */}
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

              {/* Row 2: Email + Source */}
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

              {/* Row 3: Broker + Project */}
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

              {/* Row 4: Flat Type */}
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

              {/* Notes */}
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
                {selectedLead?.name} · {selectedLead?.phone}
              </p>
            </div>
            <button
              onClick={() => setShowEditSheet(false)}
              className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable form */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="px-6 py-5 space-y-4">
              {/* Row 1: Name + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Full Name *</Label>
                  <Input
                    value={editForm.name}
                    onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                    className="rounded-[10px] h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Phone *</Label>
                  <Input
                    value={editForm.phone}
                    onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))}
                    className="rounded-[10px] h-10"
                  />
                </div>
              </div>

              {/* Row 2: Email + Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Email</Label>
                  <Input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
                    className="rounded-[10px] h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Status</Label>
                  <Select
                    value={editForm.status}
                    onValueChange={val => setEditForm(p => ({ ...p, status: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="Site Visit Scheduled">Site Visit Scheduled</SelectItem>
                      <SelectItem value="Negotiation">Negotiation</SelectItem>
                      <SelectItem value="Converted">Converted</SelectItem>
                      <SelectItem value="Lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3: Source + Broker */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Source</Label>
                  <Select
                    value={editForm.source}
                    onValueChange={val => setEditForm(p => ({ ...p, source: val }))}
                  >
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue />
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
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Assigned Broker</Label>
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

              {/* Row 4: Project + Flat Type */}
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
                      <SelectValue placeholder="Select type" />
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

              {/* Notes */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Notes</Label>
                <Textarea
                  value={editForm.notes}
                  onChange={e => setEditForm(p => ({ ...p, notes: e.target.value }))}
                  rows={3}
                  className="rounded-[10px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Sticky footer */}
          <div className="border-t px-6 py-4 flex gap-3 bg-white">
            <Button
              className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-[10px] h-10"
              onClick={handleSaveEdit}
            >
              Save Changes
            </Button>
            <Button
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
            setSelectedLead(null);
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
            {selectedLead && (
              <p className="text-blue-300 text-sm mt-1">
                {selectedLead.name} · {selectedLead.phone}
              </p>
            )}
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!visitForm.visitDate || !visitForm.visitTime) {
                toast({
                  title: 'Date and time required',
                  variant: 'destructive'
                });
                return;
              }

              const scheduledAt = new Date(
                visitForm.visitDate + 'T' + visitForm.visitTime + ':00'
              ).toISOString();

              const { error } = await supabase
                .from('site_visits')
                .insert({
                  lead_id: selectedLead.id,
                  flat_id: visitForm.flatId || null,
                  assigned_user_id:
                    visitForm.brokerId ||
                    selectedLead.assigned_user_id ||
                    null,
                  scheduled_at: scheduledAt,
                  status: 'Scheduled',
                  reminder_sent: false,
                  notes: visitForm.notes || null,
                  created_at: new Date().toISOString()
                });

              if (!error) {
                await supabase
                  .from('leads_customers')
                  .update({
                    status: 'Site Visit Scheduled',
                    last_activity: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', selectedLead.id);

                toast({
                  title: 'Visit scheduled!',
                  description: `${selectedLead.name} — ${
                    new Date(scheduledAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })
                  } at ${visitForm.visitTime}`
                });
                setShowScheduleDialog(false);
                setSelectedLead(null);
                setVisitForm({
                  flatId: '', visitDate: '',
                  visitTime: '', brokerId: '', notes: ''
                });
              } else {
                toast({
                  title: 'Failed to schedule',
                  description: error.message,
                  variant: 'destructive'
                });
              }
            }}
            className="px-6 py-5 space-y-4"
          >
            <div className="space-y-1.5">
              <Label>Property (optional)</Label>
              <Select
                value={visitForm.flatId}
                onValueChange={val => setVisitForm(p => ({...p, flatId: val}))}
              >
                <SelectTrigger className="rounded-[10px]">
                  <SelectValue placeholder="Select flat" />
                </SelectTrigger>
                <SelectContent>
                  {availableFlats.map(f => (
                    <SelectItem key={f.flat_id} value={f.flat_id}>
                      {f.flat_number} — {f.project} ({f.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={visitForm.visitDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setVisitForm(p => ({ ...p, visitDate: e.target.value }))}
                  className="rounded-[10px]"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Time *</Label>
                <Input
                  type="time"
                  value={visitForm.visitTime}
                  onChange={e => setVisitForm(p => ({ ...p, visitTime: e.target.value }))}
                  className="rounded-[10px]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Assign Broker</Label>
              <Select
                value={visitForm.brokerId}
                onValueChange={val => setVisitForm(p => ({ ...p, brokerId: val }))}
              >
                <SelectTrigger className="rounded-[10px]">
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
              <Label>Notes</Label>
              <Textarea
                placeholder="Special instructions..."
                value={visitForm.notes}
                onChange={e => setVisitForm(p => ({ ...p, notes: e.target.value }))}
                rows={2}
                className="rounded-[10px] resize-none"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                type="submit"
                className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-[10px] h-10"
              >
                Confirm Visit
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-[10px] h-10 px-6"
                onClick={() => {
                  setShowScheduleDialog(false);
                  setSelectedLead(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
