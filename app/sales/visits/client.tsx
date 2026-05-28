"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase-browser";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  XCircle,
  RefreshCw,
  MoreVertical,
  Trash2,
  Loader2,
  Plus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";

type Visit = {
  id: string;
  scheduled_at: string;
  status: string;
  notes: string | null;
  lead: { id: string; name: string; phone: string; email: string | null } | null;
  flat: { flat_id: string; flat_number: string; project: string } | null;
  broker: { id: string; name: string } | null;
};

type Lead = { id: string; name: string; phone: string };
type Flat = { flat_id: string; flat_number: string; project: string };
type Broker = { id: string; name: string };

export default function VisitsClient() {
  const supabase = createBrowserClient();
  const { toast } = useToast();

  const [visits, setVisits] = useState<Visit[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [flats, setFlats] = useState<Flat[]>([]);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("today");

  // Reschedule dialog state
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [newDateTime, setNewDateTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Visit dialog state
  const [newVisitOpen, setNewVisitOpen] = useState(false);
  const [newVisitForm, setNewVisitForm] = useState({
    leadId: "",
    flatId: "",
    visitDate: "",
    visitTime: "",
    brokerId: "",
    notes: "",
  });

  // Helper to format datetime-local input value
  const formatDateTimeLocal = (date: string) => {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  };

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);

    // Fetch visits with joins
    const { data: visitsData, error: visitsError } = await supabase
      .from("site_visits")
      .select(`
        id:visit_id,
        scheduled_at,
        status,
        notes,
        lead:leads_customers(id, name, phone, email),
        flat:flats_inventory(flat_id, flat_number, project),
        broker:users(id, name)
      `)
      .order("scheduled_at", { ascending: true });

    if (visitsError) {
      console.error("Error fetching visits:", visitsError);
      toast({ title: "Error", description: visitsError.message, variant: "destructive" });
    } else {
      setVisits(visitsData as unknown as Visit[]);
    }

    // Fetch leads for reschedule dropdown (optional, we can keep lead name from visit)
    const { data: leadsData } = await supabase
      .from("leads_customers")
      .select("id, name, phone")
      .order("name");
    setLeads(leadsData || []);

    // Fetch flats
    const { data: flatsData } = await supabase
      .from("flats_inventory")
      .select("flat_id, flat_number, project")
      .in("status", ["Available", "On Hold"]);
    setFlats(flatsData || []);

    // Fetch brokers
    const { data: brokersData } = await supabase
      .from("users")
      .select("id, name")
      .in("role", ["BROKER", "VP_SALES", "ADMIN"]);
    setBrokers(brokersData || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // Real-time subscription for visits
    const channel = supabase
      .channel("visits-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_visits" },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter visits based on active tab
  const getFilteredVisits = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return visits.filter((visit) => {
      const visitDate = new Date(visit.scheduled_at);
      visitDate.setHours(0, 0, 0, 0);
      switch (activeTab) {
        case "today":
          return visitDate.getTime() === today.getTime() && visit.status !== "No Show";
        case "upcoming":
          return visitDate.getTime() > today.getTime() && visit.status === "Scheduled";
        case "completed":
          return visit.status === "Completed";
        case "noshow":
          return visit.status === "No Show";
        default:
          return true;
      }
    });
  };

  // Update visit status
  const updateStatus = async (visitId: string, newStatus: string) => {
    // Optimistic update
    setVisits((prev) =>
      prev.map((v) => (v.id === visitId ? { ...v, status: newStatus } : v))
    );

    const { error } = await supabase
      .from("site_visits")
      .update({ status: newStatus })
      .eq("visit_id", visitId);

    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      fetchData(); // revert
    } else {
      toast({ title: `Visit marked as ${newStatus}` });
    }
  };

  // Reschedule visit
  const handleReschedule = async () => {
    if (!selectedVisit || !newDateTime) return;
    setIsSubmitting(true);

    const newScheduledAt = new Date(newDateTime).toISOString();

    // Optimistic update
    setVisits((prev) =>
      prev.map((v) =>
        v.id === selectedVisit.id ? { ...v, scheduled_at: newScheduledAt, status: "Scheduled" } : v
      )
    );

    const { error } = await supabase
      .from("site_visits")
      .update({
        scheduled_at: newScheduledAt,
        status: "Scheduled",
      })
      .eq("visit_id", selectedVisit.id);

    if (error) {
      toast({ title: "Reschedule failed", description: error.message, variant: "destructive" });
      fetchData();
    } else {
      toast({ title: "Visit rescheduled successfully" });
      setRescheduleOpen(false);
      setSelectedVisit(null);
      setNewDateTime("");
    }
    setIsSubmitting(false);
  };

  // Delete visit
  const deleteVisit = async (visitId: string) => {
    // Optimistic removal
    setVisits((prev) => prev.filter((v) => v.id !== visitId));

    const { error } = await supabase.from("site_visits").delete().eq("visit_id", visitId);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      fetchData();
    } else {
      toast({ title: "Visit deleted" });
    }
  };

  // Create new site visit
  const handleCreateVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisitForm.leadId || !newVisitForm.flatId || !newVisitForm.visitDate || !newVisitForm.visitTime) {
      toast({
        title: "Required fields missing",
        description: "Please select lead, flat, date and time",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const scheduledAt = new Date(
      newVisitForm.visitDate + "T" + newVisitForm.visitTime + ":00"
    ).toISOString();

    const { data, error } = await supabase
      .from("site_visits")
      .insert({
        lead_id: newVisitForm.leadId,
        flat_id: newVisitForm.flatId,
        assigned_user_id: newVisitForm.brokerId || null,
        scheduled_at: scheduledAt,
        status: "Scheduled",
        reminder_sent: false,
        notes: newVisitForm.notes || null,
        created_at: new Date().toISOString(),
      })
      .select(`
        id:visit_id,
        scheduled_at,
        status,
        notes,
        lead:leads_customers(id, name, phone, email),
        flat:flats_inventory(flat_id, flat_number, project),
        broker:users(id, name)
      `)
      .single();

    if (error) {
      toast({
        title: "Failed to schedule visit",
        description: error.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Update lead status to Site Visit Scheduled (safeguarded against missing columns)
    await supabase
      .from("leads_customers")
      .update({
        status: "Site Visit Scheduled"
      })
      .eq("id", newVisitForm.leadId);

    toast({
      title: "Site visit scheduled successfully!",
      description: `Visit scheduled for ${(data as any)?.lead?.name || "lead"}`,
    });

    // Reset and close
    setNewVisitForm({
      leadId: "",
      flatId: "",
      visitDate: "",
      visitTime: "",
      brokerId: "",
      notes: "",
    });
    setNewVisitOpen(false);
    setIsSubmitting(false);

    // Refresh lists
    fetchData();
  };

  const filteredVisits = getFilteredVisits();

  // Helper to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      case "No Show":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
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
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Site Visits</h1>
          <p className="text-gray-500 text-sm">Manage property tours and appointments</p>
        </div>
        <Button
          onClick={() => {
            setNewVisitOpen(true);
          }}
          className="bg-[#0066FF] hover:bg-[#0052CC]"
        >
          <Plus className="w-4 h-4 mr-2" /> New Visit
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[#F8FAFC] border border-gray-200 p-1 rounded-[12px] h-12 inline-flex">
          <TabsTrigger value="today" className="rounded-[8px] px-6 text-[13px] font-bold">
            Today
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="rounded-[8px] px-6 text-[13px] font-bold">
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="completed" className="rounded-[8px] px-6 text-[13px] font-bold">
            Completed
          </TabsTrigger>
          <TabsTrigger value="noshow" className="rounded-[8px] px-6 text-[13px] font-bold">
            No Show
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-4">
          {filteredVisits.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900">No visits found</h3>
              <p className="text-gray-500">No visits match the selected filter.</p>
            </div>
          ) : (
            filteredVisits.map((visit) => (
              <Card key={visit.id} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Date/Time block */}
                    <div className="md:w-32 p-4 bg-[#F8FAFC] border-r border-gray-100 flex md:flex-col items-center gap-3 md:gap-1">
                      <div className="text-center">
                        <p className="text-[11px] font-bold text-gray-500 uppercase">
                          {new Date(visit.scheduled_at).toLocaleDateString(undefined, {
                            month: "short",
                          })}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {new Date(visit.scheduled_at).getDate()}
                        </p>
                      </div>
                      <div className="flex items-center text-blue-600 font-semibold text-sm">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {new Date(visit.scheduled_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-4">
                      <div className="flex flex-col md:flex-row md:justify-between gap-4">
                        <div className="space-y-2">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{visit.lead?.name || "Unknown Lead"}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3.5 h-3.5" /> {visit.lead?.phone || "No phone"}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm">
                            <Badge variant="outline" className="text-[11px] font-bold">
                              <MapPin className="w-3 h-3 mr-1" />
                              {visit.flat
                                ? `${visit.flat.project} - ${visit.flat.flat_number}`
                                : "No flat assigned"}
                            </Badge>
                            <div className="flex items-center gap-1 text-gray-600">
                              <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[8px] font-bold">
                                {visit.broker?.name?.charAt(0) || "?"}
                              </div>
                              <span className="text-xs font-medium">{visit.broker?.name || "Unassigned"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(visit.status)} text-[11px] font-bold uppercase px-3 py-1`}>
                            {visit.status}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              {visit.status === "Scheduled" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => updateStatus(visit.id, "Completed")}
                                    className="cursor-pointer"
                                  >
                                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                                    Mark Complete
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => updateStatus(visit.id, "No Show")}
                                    className="cursor-pointer"
                                  >
                                    <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                    Mark No Show
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedVisit(visit);
                                      setNewDateTime(formatDateTimeLocal(visit.scheduled_at));
                                      setRescheduleOpen(true);
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <RefreshCw className="mr-2 h-4 w-4 text-blue-600" />
                                    Reschedule
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem
                                onClick={() => deleteVisit(visit.id)}
                                className="cursor-pointer text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Visit
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      {visit.notes && (
                        <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                          📝 {visit.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reschedule Visit</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="datetime">New Date & Time</Label>
              <Input
                id="datetime"
                type="datetime-local"
                value={newDateTime}
                onChange={(e) => setNewDateTime(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReschedule} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Visit Dialog */}
      <Dialog
        open={newVisitOpen}
        onOpenChange={(open) => {
          setNewVisitOpen(open);
          if (!open) {
            setNewVisitForm({
              leadId: "",
              flatId: "",
              visitDate: "",
              visitTime: "",
              brokerId: "",
              notes: "",
            });
          }
        }}
      >
        <DialogContent className="max-w-[480px] rounded-2xl p-0 overflow-hidden">
          <div className="bg-[#0A1628] px-6 py-5">
            <DialogTitle className="text-white text-lg font-semibold">
              Schedule New Visit
            </DialogTitle>
            <p className="text-blue-300 text-sm mt-1">
              Select lead, flat inventory, date, and assign a broker.
            </p>
          </div>

          <form onSubmit={handleCreateVisit} className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Select Lead *</Label>
              <Select
                value={newVisitForm.leadId}
                onValueChange={(val) => setNewVisitForm((p) => ({ ...p, leadId: val }))}
              >
                <SelectTrigger className="rounded-[10px] bg-white border-gray-200">
                  <SelectValue placeholder="Select a customer / lead" />
                </SelectTrigger>
                <SelectContent>
                  {leads.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name} — {l.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Select Flat *</Label>
              <Select
                value={newVisitForm.flatId}
                onValueChange={(val) => setNewVisitForm((p) => ({ ...p, flatId: val }))}
              >
                <SelectTrigger className="rounded-[10px] bg-white border-gray-200">
                  <SelectValue placeholder="Choose inventory flat" />
                </SelectTrigger>
                <SelectContent>
                  {flats.map((flat) => (
                    <SelectItem key={flat.flat_id} value={flat.flat_id}>
                      {flat.project} — {flat.flat_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Visit Date *</Label>
                <Input
                  type="date"
                  value={newVisitForm.visitDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setNewVisitForm((p) => ({ ...p, visitDate: e.target.value }))}
                  className="rounded-[10px]"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Visit Time *</Label>
                <Input
                  type="time"
                  value={newVisitForm.visitTime}
                  onChange={(e) => setNewVisitForm((p) => ({ ...p, visitTime: e.target.value }))}
                  className="rounded-[10px]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Assign Broker</Label>
              <Select
                value={newVisitForm.brokerId}
                onValueChange={(val) => setNewVisitForm((p) => ({ ...p, brokerId: val }))}
              >
                <SelectTrigger className="rounded-[10px] bg-white border-gray-200">
                  <SelectValue placeholder="Select broker" />
                </SelectTrigger>
                <SelectContent>
                  {brokers.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Notes</Label>
              <Textarea
                placeholder="Special instructions or notes..."
                value={newVisitForm.notes}
                onChange={(e) => setNewVisitForm((p) => ({ ...p, notes: e.target.value }))}
                className="rounded-[10px] resize-none"
                rows={2}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-[10px] h-10"
              >
                {isSubmitting ? "Scheduling..." : "Schedule Visit"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-[10px] h-10 px-6"
                onClick={() => {
                  setNewVisitOpen(false);
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
