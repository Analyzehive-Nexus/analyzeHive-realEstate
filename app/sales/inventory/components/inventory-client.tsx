"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NativeSelect as Select } from "@/components/ui/native-select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast"
import { updateFlatStatusAction } from "../actions"

type Flat = {
  flat_id: string
  project: string
  flat_number: string
  type: string
  floor: number
  area_sqft: number
  price: number
  status: string
  updated_at: string
}

const statusColors: Record<string, any> = {
  "Available": "success",
  "On Hold": "warning",
  "Sold": "destructive"
}

export function InventoryClient({ initialData }: { initialData: Flat[] }) {
  const [data, setData] = useState<Flat[]>(initialData)
  const [filterStatus, setFilterStatus] = useState("All")
  const [filterProject, setFilterProject] = useState("All")
  
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null)
  const [newStatus, setNewStatus] = useState<string>("")
  const [isUpdating, setIsUpdating] = useState(false)
  
  const { toast } = useToast()

  const projects = useMemo(() => {
    const list = Array.from(new Set(data.map(f => f.project)))
    return list.sort()
  }, [data])

  const filteredData = data.filter(flat => {
    if (filterStatus !== "All" && flat.status !== filterStatus) return false
    if (filterProject !== "All" && flat.project !== filterProject) return false
    return true
  })

  function openStatusDialog(flat: Flat) {
    setSelectedFlat(flat)
    setNewStatus(flat.status)
  }

  async function handleUpdateStatus() {
    if (!selectedFlat) return
    setIsUpdating(true)
    
    const res = await updateFlatStatusAction(selectedFlat.flat_id, newStatus)
    
    if (res.success) {
      setData(data.map(f => f.flat_id === selectedFlat.flat_id ? { ...f, status: newStatus } : f))
      toast({ title: "Status updated successfully" })
      setSelectedFlat(null)
    } else {
      toast({ title: "Update failed", description: res.error, variant: "destructive" })
    }
    
    setIsUpdating(false)
  }

  // Format currency
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(amount)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm dark:bg-slate-950 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant={filterStatus === "All" ? "default" : "outline"} 
              onClick={() => setFilterStatus("All")}
            >
              All
            </Button>
            <Button 
              variant={filterStatus === "Available" ? "default" : "outline"} 
              className={filterStatus === "Available" ? "bg-emerald-500 hover:bg-emerald-600 border-transparent text-white dark:bg-emerald-600 dark:hover:bg-emerald-700" : ""}
              onClick={() => setFilterStatus("Available")}
            >
              Available
            </Button>
            <Button 
              variant={filterStatus === "On Hold" ? "default" : "outline"} 
              className={filterStatus === "On Hold" ? "bg-amber-500 hover:bg-amber-600 border-transparent text-white dark:bg-amber-600 dark:hover:bg-amber-700" : ""}
              onClick={() => setFilterStatus("On Hold")}
            >
              On Hold
            </Button>
            <Button 
              variant={filterStatus === "Sold" ? "default" : "outline"} 
              className={filterStatus === "Sold" ? "bg-red-500 hover:bg-red-600 border-transparent text-white dark:bg-red-600 dark:hover:bg-red-700" : ""}
              onClick={() => setFilterStatus("Sold")}
            >
              Sold
            </Button>
          </div>

          <div className="ml-0 sm:ml-4 w-48">
            <Select value={filterProject} onChange={(e) => setFilterProject(e.target.value)}>
              <option value="All">All Projects</option>
              {projects.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Select>
          </div>
        </div>
        
        <div className="flex items-center text-sm font-medium text-slate-500">
          Showing {filteredData.length} units
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredData.map(flat => (
          <Card 
            key={flat.flat_id} 
            className="cursor-pointer hover:shadow-md transition-shadow group relative overflow-hidden"
            onClick={() => openStatusDialog(flat)}
          >
            <div className={`absolute top-0 left-0 w-full h-1 ${flat.status === 'Available' ? 'bg-emerald-500' : flat.status === 'On Hold' ? 'bg-amber-500' : 'bg-red-500'}`} />
            
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardDescription className="uppercase tracking-wider text-xs mb-1">{flat.project}</CardDescription>
                  <CardTitle className="text-xl">{flat.flat_number}</CardTitle>
                </div>
                <Badge variant={statusColors[flat.status] || "default"}>{flat.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm mt-2">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs text-muted-foreground">Type</span>
                  <span className="font-medium">{flat.type}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs text-muted-foreground">Floor</span>
                  <span className="font-medium">{flat.floor}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs text-muted-foreground">Area</span>
                  <span className="font-medium">{flat.area_sqft} sqft</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs text-muted-foreground">Price</span>
                  <span className="font-medium">{formatINR(flat.price)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredData.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No inventory found matching criteria.
          </div>
        )}
      </div>

      {/* Status Update Dialog */}
      <Dialog open={!!selectedFlat} onOpenChange={(v) => { if(!v) setSelectedFlat(null) }}>
        {selectedFlat && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Inventory Status</DialogTitle>
              <DialogDescription>
                Flat {selectedFlat.flat_number} from {selectedFlat.project} is currently {selectedFlat.status}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <Label className="mb-2 block">New Status</Label>
              <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="Available">Available</option>
                <option value="On Hold">On Hold</option>
                <option value="Sold">Sold</option>
              </Select>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedFlat(null)} disabled={isUpdating}>Cancel</Button>
              <Button onClick={handleUpdateStatus} disabled={isUpdating || newStatus === selectedFlat.status}>
                {isUpdating ? "Updating..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
