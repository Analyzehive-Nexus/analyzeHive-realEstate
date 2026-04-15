"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from '@/lib/supabase-browser'
import { 
  Calendar as CalendarIcon, Clock, MapPin, Phone, MessageCircle, 
  CheckCircle2, XCircle, UserPlus, ChevronLeft, ChevronRight,
  MoreVertical, Plus, Trash2, Loader2, RefreshCw
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/toast"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

function getStatusColor(status: string) {
  switch ((status || '').toLowerCase()) {
    case 'scheduled': return "bg-blue-100 text-[#0066FF] border-none"
    case 'completed': return "bg-green-100 text-green-700 border-none"
    case 'no show': return "bg-red-100 text-red-700 border-none"
    case 'rescheduled': return "bg-orange-100 text-orange-700 border-none"
    default: return "bg-gray-100 text-gray-700 border-none"
  }
}

export default function VisitsClient() {
  const [visits, setVisits] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [flats, setFlats] = useState<any[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [addingLoading, setAddingLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("today");
  
  const [formData, setFormData] = useState({
    leadId: '', flatId: '', scheduledDate: new Date().toISOString().split('T')[0], 
    scheduledTime: '10:00', assignedBrokerId: '', notes: ''
  });

  const { toast } = useToast();
  const supabase = createBrowserClient();

  useEffect(() => {
    fetchData();

    // Real-time subscriptions
    const channel = supabase
      .channel('visits-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_visits' }, () => fetchData())
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch visits
    const { data: visitsData, error: visitsError } = await supabase
      .from('site_visits')
      .select(`
        *,
        lead:leads_customers(id, name, phone),
        flat:flats_inventory(flat_id, flat_number, project),
        broker:users(id, name)
      `)
      .order('scheduled_at', { ascending: true });

    if (visitsData) setVisits(visitsData);

    // Fetch dependencies for dropdowns
    const { data: leadsData } = await supabase.from('leads_customers').select('id, name, phone');
    if (leadsData) setLeads(leadsData);
    
    const { data: flatsData } = await supabase.from('flats_inventory').select('flat_id, flat_number, project');
    if (flatsData) setFlats(flatsData);

    const { data: brokersData } = await supabase.from('users').select('id, name').in('role', ['BROKER', 'VP_SALES', 'ADMIN']);
    if (brokersData) setBrokers(brokersData);

    setLoading(false);
  };

  const addVisit = async () => {
    if (!formData.leadId || !formData.flatId || !formData.scheduledDate || !formData.scheduledTime) {
      toast({ title: 'Validation Error', description: 'Please fill all required fields.', variant: 'destructive' });
      return;
    }
    
    setAddingLoading(true);
    
    const datetime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}:00`).toISOString();
    
    const { error } = await supabase
      .from('site_visits')
      .insert({
        lead_id: formData.leadId,
        flat_id: formData.flatId,
        broker_id: formData.assignedBrokerId || null,
        scheduled_at: datetime,
        status: 'Scheduled',
        notes: formData.notes
      });
      
    setAddingLoading(false);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Site visit scheduled successfully' });
      setShowAddDialog(false);
      setFormData({ leadId: '', flatId: '', scheduledDate: new Date().toISOString().split('T')[0], scheduledTime: '10:00', assignedBrokerId: '', notes: '' });
    }
  };

  const updateVisitStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('site_visits')
      .update({ status })
      .eq('id', id);
      
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: `Visit marked as ${status}` });
    }
  };

  const deleteVisit = async (id: string) => {
    const { error } = await supabase
      .from('site_visits')
      .delete()
      .eq('id', id);
      
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Visit deleted' });
    }
  };

  // Prepare derived data for UI
  const visitsDataUI = visits.map(v => {
    const d = new Date(v.scheduled_at);
    return {
      ...v,
      dateObj: d,
      dateStr: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      timeStr: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      leadName: v.lead?.name || 'Unknown Lead',
      leadPhone: v.lead?.phone || 'N/A',
      propertyName: v.flat ? `${v.flat.project} - ${v.flat.flat_number}` : 'Unknown Property',
      brokerName: v.broker?.name || 'Unassigned',
      status: v.status || 'Scheduled'
    };
  });

  const getFilteredVisits = () => {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (activeTab) {
      case "today":
        return visitsDataUI.filter(v => {
          const vDate = new Date(v.dateObj);
          vDate.setHours(0,0,0,0);
          return vDate.getTime() === today.getTime();
        });
      case "upcoming":
        return visitsDataUI.filter(v => {
          const vDate = new Date(v.dateObj);
          vDate.setHours(0,0,0,0);
          return vDate.getTime() > today.getTime() && v.status === "Scheduled";
        });
      case "completed":
        return visitsDataUI.filter(v => v.status === "Completed");
      case "noshow":
        return visitsDataUI.filter(v => v.status === "No Show");
      default:
        return visitsDataUI;
    }
  }

  const visitDates = visitsDataUI.map(v => v.dateObj);

  // KPIs
  const todayDate = new Date();
  todayDate.setHours(0,0,0,0);
  const totalVisits = visits.length;
  const todayVisits = visitsDataUI.filter(v => {
    const d = new Date(v.dateObj);
    d.setHours(0,0,0,0);
    return d.getTime() === todayDate.getTime();
  }).length;
  const completedVisits = visits.filter(v => v.status === 'Completed').length;
  const noShows = visits.filter(v => v.status === 'No Show').length;

  if (loading) {
    return (
      <div className="p-8 max-w-[1700px] mx-auto pb-24 space-y-8 animate-pulse text-center pt-20">
         <Loader2 className="w-8 h-8 mx-auto animate-spin text-[#0066FF]" />
         <p className="text-gray-500 mt-4 font-medium">Loading visits schedule...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1700px] mx-auto pb-24 space-y-8 font-sans">
      
      {/* HEADER & KPI CARDS */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Site Visit Scheduler</h1>
          <p className="text-[#64748B] text-sm mt-1">Manage broker appointments and property tours</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Today's Visits", value: todayVisits, icon: Clock, color: "from-blue-600 to-blue-400", shadow: "shadow-blue-500/30" },
            { label: "Total Visits", value: totalVisits, icon: CalendarIcon, color: "from-purple-600 to-purple-400", shadow: "shadow-purple-500/30" },
            { label: "Completed", value: completedVisits, icon: CheckCircle2, color: "from-emerald-500 to-emerald-400", shadow: "shadow-emerald-500/30" },
            { label: "No Shows", value: noShows, icon: XCircle, color: "from-red-500 to-red-400", shadow: "shadow-red-500/30" },
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

      {/* DUAL COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-[#F8FAFC] border border-gray-200 p-1 rounded-[12px] h-12 inline-flex">
                <TabsTrigger value="today" className="rounded-[8px] px-6 text-[13px] font-bold data-[state=active]:bg-white data-[state=active]:text-[#0066FF] data-[state=active]:shadow-sm">
                  Today
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="rounded-[8px] px-6 text-[13px] font-bold data-[state=active]:bg-white data-[state=active]:text-[#0066FF] data-[state=active]:shadow-sm">
                  Upcoming
                </TabsTrigger>
                <TabsTrigger value="completed" className="rounded-[8px] px-6 text-[13px] font-bold data-[state=active]:bg-white data-[state=active]:text-[#0066FF] data-[state=active]:shadow-sm">
                  Completed
                </TabsTrigger>
                <TabsTrigger value="noshow" className="rounded-[8px] px-6 text-[13px] font-bold data-[state=active]:bg-white data-[state=active]:text-[#0066FF] data-[state=active]:shadow-sm">
                  No Show
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-0 space-y-4 outline-none">
              {getFilteredVisits().length > 0 ? (
                getFilteredVisits().map((visit) => (
                  <Card key={visit.id} className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] overflow-hidden hover:border-[#CBD5E1] transition-colors">
                    <CardContent className="p-0 flex flex-col sm:flex-row">
                      {/* Left Date/Time Badge */}
                      <div className="bg-[#F8FAFC] border-b sm:border-b-0 sm:border-r border-gray-100 p-4 flex sm:flex-col items-center justify-center sm:w-32 shrink-0 gap-3 sm:gap-1">
                        <div className="text-center">
                          <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest">{visit.dateObj.toLocaleDateString("en-US", { month: "short" })}</p>
                          <p className="text-[28px] font-bold text-[#0F172A] leading-none">{visit.dateObj.getDate()}</p>
                        </div>
                        <div className="hidden sm:block w-8 h-[1px] bg-gray-200 my-1" />
                        <div className="flex items-center text-[#0066FF] font-bold text-[13px]">
                          <Clock className="w-3.5 h-3.5 mr-1" /> {visit.timeStr}
                        </div>
                      </div>
                      
                      {/* Right Detail Panel */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 mt-1 rounded-full bg-slate-100 flex items-center justify-center text-[13px] font-bold text-slate-700 shadow-inner">
                              {(visit.leadName || 'U').split(' ')[0]?.[0] || 'U'}{(visit.leadName || '').split(' ')[1]?.[0] || ''}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <h3 className="text-[16px] font-bold text-[#0F172A]">{visit.leadName}</h3>
                                <Badge className={`${getStatusColor(visit.status)} shadow-none text-[10px] rounded-full font-bold uppercase tracking-wide px-2 py-0`}>
                                  {visit.status}
                                </Badge>
                              </div>
                              <p className="text-[13px] text-[#64748B] flex items-center gap-1.5 font-medium mb-1">
                                <Phone className="w-3.5 h-3.5" /> {visit.leadPhone}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-[10px] rounded-full tracking-wider font-bold border-gray-200 text-gray-500 bg-white shadow-sm">
                                  <MapPin className="w-3 h-3 mr-1 text-orange-400" /> {visit.propertyName}
                                </Badge>
                                <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200 shadow-sm">
                                  <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[8px] font-bold">
                                    {(visit.brokerName || 'U').split(' ')[0]?.[0] || 'U'}
                                  </div>
                                  <span className="text-[10px] font-bold text-[#64748B]">{visit.brokerName}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Desktop action buttons */}
                          <div className="hidden sm:flex flex-col gap-2 items-end">
                            {visit.status === 'Scheduled' ? (
                              <>
                                <Button onClick={() => updateVisitStatus(visit.id, 'Completed')} className="h-8 bg-[#10B981] hover:bg-[#059669] text-white rounded-[8px] shadow-sm font-semibold text-[12px] w-[130px]">
                                  Mark Complete
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-8 rounded-[8px] border-gray-200 text-[#0F172A] hover:bg-gray-50 font-semibold text-[12px] w-[130px]">
                                      Manage <ChevronRight className="w-3 h-3 ml-1" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-[180px]">
                                    <DropdownMenuItem onClick={() => updateVisitStatus(visit.id, 'Rescheduled')}>
                                      <RefreshCw className="mr-2 h-4 w-4" /> Reschedule
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => updateVisitStatus(visit.id, 'No Show')}>
                                      <XCircle className="mr-2 h-4 w-4" /> Mark No Show
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => deleteVisit(visit.id)} className="text-red-600">
                                      <Trash2 className="mr-2 h-4 w-4" /> Delete Visit
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </>
                            ) : (
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => deleteVisit(visit.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {visit.notes && (
                          <div className="bg-orange-50/50 border border-orange-100 rounded-[8px] p-2.5 mt-2">
                            <p className="text-[12px] text-orange-800 font-medium">📋 Notes: {visit.notes}</p>
                          </div>
                        )}
                        
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-[16px] border border-[#E8ECF0]">
                  <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-[#0F172A]">No visits found</h3>
                  <p className="text-sm text-[#64748B]">There are no visits for this category.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT COLUMN: Calendar */}
        <div className="space-y-6">
          <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] overflow-hidden sticky top-6">
            <div className="bg-[#F8FAFC] border-b border-gray-100 p-4">
              <h3 className="font-bold text-[#0F172A] flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#0066FF]" /> Master Calendar
              </h3>
            </div>
            <CardContent className="p-4 pt-4 flex flex-col items-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md w-full"
                modifiers={{ booked: visitDates }}
                modifiersStyles={{
                  booked: { fontWeight: 'bold', backgroundColor: '#EFF6FF', color: '#0066FF', borderRadius: '50%' }
                }}
                classNames={{
                  head_cell: "text-muted-foreground font-semibold text-[11px] uppercase tracking-wider w-9",
                  cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-medium aria-selected:opacity-100 rounded-full hover:bg-gray-100",
                  day_selected: "bg-[#0066FF] text-white hover:bg-[#0066FF] hover:text-white focus:bg-[#0066FF] focus:text-white rounded-full",
                  day_today: "bg-gray-100 text-gray-900 rounded-full",
                }}
              />
              
              <div className="w-full h-px bg-gray-100 my-4" />
              
              <div className="w-full">
                <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em] mb-2">{date ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Selected Date"}</p>
                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                  {visitsDataUI.filter(v => v.dateObj.getDate() === date?.getDate() && v.dateObj.getMonth() === date?.getMonth()).length > 0 ? (
                     visitsDataUI.filter(v => v.dateObj.getDate() === date?.getDate() && v.dateObj.getMonth() === date?.getMonth()).map(v => (
                      <div key={v.id} className="flex items-center gap-3 p-2 rounded-[8px] hover:bg-gray-50 border border-transparent hover:border-gray-100">
                        <div className={`w-2 h-2 rounded-full ${v.status === 'Completed' ? 'bg-green-500' : 'bg-[#0066FF]'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-[#0F172A] truncate">{v.leadName}</p>
                          <p className="text-[11px] font-medium text-[#64748B] truncate">{v.timeStr} • {v.propertyName}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[13px] text-gray-500 italic p-2">No visits scheduled for this date.</p>
                  )}
                </div>
              </div>

              <div className="w-full mt-6">
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] shadow-md font-semibold h-11">
                      <Plus className="mr-2 h-4 w-4" /> Schedule New Visit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Schedule Site Visit</DialogTitle>
                      <DialogDescription>
                        Set up a new property tour for an existing lead.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Lead Name</label>
                        <Select value={formData.leadId} onValueChange={(v) => setFormData({...formData, leadId: v})}>
                          <SelectTrigger className="w-full rounded-[10px] border-gray-200">
                            <SelectValue placeholder="Search connected lead..." />
                          </SelectTrigger>
                          <SelectContent>
                            {leads.map(l => (
                              <SelectItem key={l.id} value={l.id}>{l.name} ({l.phone})</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Property</label>
                        <Select value={formData.flatId} onValueChange={(v) => setFormData({...formData, flatId: v})}>
                          <SelectTrigger className="w-full rounded-[10px] border-gray-200">
                            <SelectValue placeholder="Select Property..." />
                          </SelectTrigger>
                          <SelectContent>
                            {flats.map(f => (
                              <SelectItem key={f.flat_id} value={f.flat_id}>{f.project} - {f.flat_number}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Date</label>
                          <Input type="date" value={formData.scheduledDate} onChange={e => setFormData({...formData, scheduledDate: e.target.value})} className="rounded-[10px] border-gray-200" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Time</label>
                          <Input type="time" value={formData.scheduledTime} onChange={e => setFormData({...formData, scheduledTime: e.target.value})} className="rounded-[10px] border-gray-200" />
                        </div>
                      </div>
                       <div className="space-y-2">
                        <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Assign Broker</label>
                        <Select value={formData.assignedBrokerId} onValueChange={v => setFormData({...formData, assignedBrokerId: v})}>
                          <SelectTrigger className="w-full rounded-[10px] border-gray-200">
                            <SelectValue placeholder="Select Broker" />
                          </SelectTrigger>
                          <SelectContent>
                            {brokers.map(b => (
                              <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.05em]">Additional Notes</label>
                        <Textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Any specific requirements?" className="rounded-[10px] border-gray-200 bg-[#F8FAFC]" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddDialog(false)} className="rounded-[10px] font-semibold border-gray-200">Cancel</Button>
                      <Button onClick={addVisit} disabled={addingLoading} className="rounded-[10px] font-semibold bg-[#0066FF] hover:bg-[#0052CC] text-white">
                        {addingLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Confirm Booking
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  )
}
