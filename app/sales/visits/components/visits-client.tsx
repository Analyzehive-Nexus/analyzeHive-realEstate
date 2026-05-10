"use client";
import { ResponsiveTable } from "@/components/ui/responsive-table";


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { NativeSelect as Select } from "@/components/ui/native-select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/toast"
import { scheduleVisitAction, updateVisitStatusAction } from "../actions"
import { Calendar as CalendarIcon, List, Plus } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state";

type Visit = {
  visit_id: string
  scheduled_at: string
  status: string
  reminder_sent: boolean
  lead: { id: string, name: string, phone: string }
  flat: { flat_id: string, project: string, flat_number: string }
}

export function VisitsClient({ initialVisits, leads, flats }: { 
  initialVisits: Visit[], 
  leads: any[], 
  flats: any[] 
}) {
  const [visits, setVisits] = useState<Visit[]>(initialVisits)
  const [view, setView] = useState<"list" | "calendar">("list")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  async function handleScheduleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    // Validate datetime
    const dt = formData.get("scheduled_at") as string
    if (!dt) {
      toast({ title: "Date/Time is required", variant: "destructive" })
      setIsSubmitting(false)
      return
    }

    // Convert local datetime-local value to ISO UTC string
    const isoDate = new Date(dt).toISOString()
    formData.set("scheduled_at", isoDate)

    const res = await scheduleVisitAction(formData)
    if (res.success) {
      // Optimistic update
      const data = res.data as any;
      const newVisit = {
        ...data,
        lead: Array.isArray(data.leads_customers) ? data.leads_customers[0] : data.leads_customers,
        flat: Array.isArray(data.flats_inventory) ? data.flats_inventory[0] : data.flats_inventory,
      } as Visit;
      setVisits(prev => [...prev, newVisit].sort((a,b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()))
      toast({ title: "Visit Scheduled Successfully" })
      setIsAddOpen(false)
    } else {
      toast({ title: "Error scheduling visit", description: res.error, variant: "destructive" })
    }
    setIsSubmitting(false)
  }

  async function handleStatusChange(visitId: string, status: string) {
    const res = await updateVisitStatusAction(visitId, status)
    if (res.success) {
      setVisits(visits.map(v => v.visit_id === visitId ? { ...v, status } : v))
      toast({ title: "Status updated" })
    } else {
      toast({ title: "Failed to update status", variant: "destructive" })
    }
  }

  // Simplified calendar rendering logic for current month
  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay()
  
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDayOfMonth + 1
    if (day > 0 && day <= daysInMonth) {
      return new Date(today.getFullYear(), today.getMonth(), day)
    }
    return null
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm dark:bg-slate-950 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Button 
            variant={view === "list" ? "default" : "outline"}
            onClick={() => setView("list")}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" /> List View
          </Button>
          <Button 
            variant={view === "calendar" ? "default" : "outline"}
            onClick={() => setView("calendar")}
            className="flex items-center gap-2"
          >
            <CalendarIcon className="h-4 w-4" /> Monthly View
          </Button>
        </div>
        
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2"/> Schedule Visit
        </Button>
      </div>

      {view === "list" ? (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm dark:bg-slate-950 dark:border-slate-800">
          <ResponsiveTable>
<Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead Name</TableHead>
                <TableHead>Flat</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reminder Sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-slate-500">No scheduled visits.</TableCell>
                </TableRow>
              ) : visits.map(visit => {
                const isPast = new Date(visit.scheduled_at) < new Date() && visit.status === "Scheduled"
                return (
                  <TableRow key={visit.visit_id}>
                    <TableCell className="font-medium">
                      {visit.lead?.name} <span className="text-xs text-slate-400 block">{visit.lead?.phone}</span>
                    </TableCell>
                    <TableCell>{visit.flat?.project} - {visit.flat?.flat_number}</TableCell>
                    <TableCell>
                      <div className={isPast ? "text-red-500 font-medium" : ""}>
                        {new Date(visit.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={visit.status}
                        onChange={(e) => handleStatusChange(visit.visit_id, e.target.value)}
                        className="h-8 w-32 text-xs"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="No Show">No Show</option>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {visit.reminder_sent ? (
                        <Badge variant="success">Yes</Badge>
                      ) : (
                         <Badge variant="secondary">No</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
</ResponsiveTable>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm dark:bg-slate-950 dark:border-slate-800 text-center">
            <h3 className="text-xl font-semibold mb-6">{today.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 dark:bg-slate-800 dark:border-slate-800 rounded-lg overflow-hidden">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                 <div key={d} className="bg-slate-50 dark:bg-slate-900 py-2 text-sm font-semibold">{d}</div>
              ))}
              {calendarDays.map((date, i) => {
                if (!date) return <div key={i} className="bg-white dark:bg-slate-950 p-2 min-h-[100px]" />
                const dayVisits = visits.filter(v => new Date(v.scheduled_at).toDateString() === date.toDateString())
                const isToday = date.toDateString() === today.toDateString()
                
                return (
                  <div key={i} className={`bg-white dark:bg-slate-950 p-2 min-h-[120px] text-left border-t border-slate-100 dark:border-slate-800 relative ${isToday ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-sm ${isToday ? 'bg-blue-600 text-white font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                      {date.getDate()}
                    </span>
                    <div className="mt-2 flex flex-col gap-1">
                      {dayVisits.map(v => (
                        <div key={v.visit_id} 
                             className={`text-xs p-1 rounded border-l-2 ${v.status === 'Completed' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' : v.status === 'No Show' ? 'border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400' : 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400'} truncate cursor-pointer hover:opacity-80`}
                             title={`${new Date(v.scheduled_at).toLocaleTimeString([], {timeStyle: 'short'})} ${v.lead?.name}`}
                        >
                          {new Date(v.scheduled_at).toLocaleTimeString([], {timeStyle: 'short'})} <br/> {v.lead?.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
        </div>
      )}

      {/* Schedule Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <form onSubmit={handleScheduleSubmit}>
            <DialogHeader>
              <DialogTitle>Schedule Site Visit</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="lead_id">Select Lead</Label>
                <Select id="lead_id" name="lead_id" required defaultValue="">
                  <option value="" disabled>-- Choose a Lead --</option>
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.phone})</option>
                  ))}
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="flat_id">Select Flat</Label>
                <Select id="flat_id" name="flat_id" required defaultValue="">
                  <option value="" disabled>-- Choose Available Flat --</option>
                  {flats.map(f => (
                    <option key={f.flat_id} value={f.flat_id}>{f.project} - {f.flat_number}</option>
                  ))}
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="scheduled_at">Date & Time</Label>
                {/* Fallback to native datetime-local for simpler robust UI */}
                <Input type="datetime-local" id="scheduled_at" name="scheduled_at" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Scheduling..." : "Schedule Visit"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
