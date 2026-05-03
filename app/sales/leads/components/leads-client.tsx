"use client"

import { useState } from "react"
import { createLeadAction, updateLeadStatusAction } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { NativeSelect as Select } from "@/components/ui/native-select"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useToast } from "@/components/ui/toast"
import { Search, Plus } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state";

type Lead = {
  id: string
  name: string
  phone: string
  email: string | null
  source: string
  status: string
  assigned_broker_id: string
  created_at: string
}

const statusColors: Record<string, any> = {
  "New": "default",
  "Contacted": "secondary",
  "Site Visit Scheduled": "warning",
  "Negotiation": "warning",
  "Converted": "success",
  "Lost": "destructive"
}

export function LeadsClient({ initialData, currentBrokerName }: { initialData: Lead[], currentBrokerName: string }) {
  const [data, setData] = useState<Lead[]>(initialData)
  const [filterStatus, setFilterStatus] = useState("All")
  const [filterSource, setFilterSource] = useState("All")
  const [search, setSearch] = useState("")

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isSubmiting, setIsSubmitting] = useState(false)

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  
  const { toast } = useToast()

  const filteredData = data.filter(lead => {
    if (filterStatus !== "All" && lead.status !== filterStatus) return false
    if (filterSource !== "All" && lead.source !== filterSource) return false
    if (search && !lead.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  async function handleAddSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    const res = await createLeadAction(formData)
    if (res.success) {
      toast({ title: "Lead created successfully", variant: "default" })
      // Optimistic update wrapper since revalidatePath doesn't immediately push new data if not refreshed yet
      setData([res.data, ...data])
      setIsAddOpen(false)
    } else {
      toast({ title: "Error creating lead", description: res.error, variant: "destructive" })
    }
    setIsSubmitting(false)
  }

  async function handleStatusChange(leadId: string, newStatus: string) {
    const res = await updateLeadStatusAction(leadId, newStatus)
    if (res.success) {
      setData(data.map(l => l.id === leadId ? { ...l, status: newStatus } : l))
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null)
      toast({ title: "Status updated" })
    } else {
      toast({ title: "Update failed", description: res.error, variant: "destructive" })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm dark:bg-slate-950 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <div className="relative max-w-sm w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input 
              placeholder="Search by name..." 
              className="pl-9" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-40">
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Site Visit Scheduled">Site Visit Scheduled</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </Select>

          <Select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className="w-40">
            <option value="All">All Sources</option>
            <option value="Meta">Meta</option>
            <option value="Google">Google</option>
            <option value="99acres">99acres</option>
            <option value="Direct">Direct</option>
          </Select>
        </div>
        
        <Button onClick={() => setIsAddOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Lead
        </Button>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm dark:bg-slate-950 dark:border-slate-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Broker</TableHead>
              <TableHead>Created Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-slate-500">No leads found.</TableCell>
              </TableRow>
            ) : filteredData.map(lead => (
              <TableRow key={lead.id} onClick={() => setSelectedLead(lead)} className="cursor-pointer">
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell><Badge variant="outline">{lead.source}</Badge></TableCell>
                <TableCell><Badge variant={statusColors[lead.status] || "default"}>{lead.status}</Badge></TableCell>
                <TableCell className="text-slate-500">{lead.assigned_broker_id || "Unassigned"}</TableCell>
                <TableCell className="text-slate-500">{new Date(lead.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Lead Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" required placeholder="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" required placeholder="+91 9999999999" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address <span className="text-slate-400 font-normal">(optional)</span></Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="source">Source</Label>
                <Select id="source" name="source" defaultValue="Direct">
                  <option value="Direct">Direct</option>
                  <option value="Meta">Meta</option>
                  <option value="Google">Google</option>
                  <option value="99acres">99acres</option>
                </Select>
              </div>
              <input type="hidden" name="assigned_broker" value={currentBrokerName} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={isSubmiting}>Cancel</Button>
              <Button type="submit" disabled={isSubmiting}>{isSubmiting ? "Saving..." : "Add Lead"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Lead Detail Sheet */}
      <Sheet open={!!selectedLead} onOpenChange={(open) => { if (!open) setSelectedLead(null) }}>
        {selectedLead && (
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-2xl">{selectedLead.name}</SheetTitle>
              <SheetDescription>Created on {new Date(selectedLead.created_at).toLocaleString()}</SheetDescription>
            </SheetHeader>
            <div className="grid gap-6 py-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <Label className="text-slate-500">Phone</Label>
                  <div className="font-medium">{selectedLead.phone}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-slate-500">Email</Label>
                  <div className="font-medium">{selectedLead.email || "-"}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-slate-500">Source</Label>
                  <div><Badge variant="outline">{selectedLead.source}</Badge></div>
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-slate-500">Broker</Label>
                  <div className="font-medium">{selectedLead.assigned_broker_id || "Unassigned"}</div>
                </div>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                <h4 className="font-semibold mb-4 text-lg">Update Status</h4>
                <div className="grid gap-2">
                  <Label>Current Status</Label>
                  <Select 
                    value={selectedLead.status} 
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                  </Select>
                </div>
              </div>
            </div>
            <div className="absolute bottom-6 right-6">
              <Button variant="outline" onClick={() => setSelectedLead(null)}>Close</Button>
            </div>
          </SheetContent>
        )}
      </Sheet>

    </div>
  )
}
