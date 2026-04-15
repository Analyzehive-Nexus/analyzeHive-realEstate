"use client"

import { useState } from "react"
import { 
  Building2, Search, Filter, Plus, FileDown, Phone,
  Star, ShoppingBag, CreditCard, Box, MapPin, Mail, AlertTriangle
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Mock array replaced by props

const OrderHistory = [
  { id: "PO-26-089", date: "Mar 15, 2026", items: "Cement OPC (x200)", amt: "₹70,000", status: "Delivered" },
  { id: "PO-26-074", date: "Feb 28, 2026", items: "Cement PPC (x150)", amt: "₹48,000", status: "Delivered" },
  { id: "PO-26-061", date: "Feb 10, 2026", items: "Cement OPC (x300)", amt: "₹1,05,000", status: "Delivered" },
];

const PaymentHistory = [
  { date: "Mar 16, 2026", amt: "₹25,000", ref: "NEFT-HDFCXXXX123", bal: "₹45,000" },
  { date: "Mar 05, 2026", amt: "₹48,000", ref: "UPI-SBIXXXX456", bal: "₹0" },
  { date: "Feb 15, 2026", amt: "₹1,05,000", ref: "CHEQUE-009812", bal: "₹0" },
];

const formatCur = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);

// HELPER COMPONENTS
const SectionHeading = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">{title}</h2>
  </div>
);

const PearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0' }}>
    {children}
  </Card>
);

const InteractivePearlCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Card className={`overflow-hidden ${className}`} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8ECF0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s ease' }}>
    {children}
  </Card>
);

export default function VendorsClient({ initialVendors }: { initialVendors: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  const vendorsList = initialVendors.map((v, i) => ({
    id: v.id?.substring(0,8) || `VND-10${i+1}`,
    name: v.name || 'Unknown Vendor',
    cat: v.category || 'General',
    contact: v.contact_person || 'N/A',
    phone: v.phone || '--',
    email: v.email || '--',
    out: v.outstanding_balance || 0,
    limit: v.credit_limit || 0,
    date: "Mar 15, 2026", // Mocking last order date
    orders: 0, // Mocking orders
    rating: v.rating || 4,
    status: v.status || 'Active'
  }));

  const filteredVendors = vendorsList.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 max-w-[1800px] mx-auto pb-24 space-y-8 font-sans text-[#0F172A]">
      <div className="flex flex-col mb-4 gap-1">
        <h1 className="text-2xl font-bold text-[#0F172A]">Vendor & Supplier Management</h1>
        <p className="text-sm text-slate-500">Manage supplier profiles, track orders, monitor outstanding payments, and record invoices.</p>
      </div>

      {/* KPI CARDS */}
      <section className="grid gap-6 md:grid-cols-4">
        <InteractivePearlCard className="p-5">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Vendors</p>
            <h3 className="text-[32px] font-bold text-[#0F172A] leading-tight">{vendorsList.length}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#10B981]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Active Accounts</p>
            <h3 className="text-[32px] font-bold text-[#10B981] leading-tight flex items-center gap-2"><Building2 className="w-6 h-6 text-[#10B981]"/> {vendorsList.filter(v => v.status === 'Active').length}</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#EF4444]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Total Outstanding</p>
            <h3 className="text-[32px] font-bold text-[#EF4444] leading-tight">₹{(vendorsList.reduce((acc, v) => acc + v.out, 0) / 100000).toFixed(2)}L</h3>
          </CardContent>
        </InteractivePearlCard>
        <InteractivePearlCard className="p-5 border-l-4 border-l-[#0066FF]">
          <CardContent className="p-0 flex flex-col justify-center">
            <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-[0.05em] mb-1">Orders This Month</p>
            <h3 className="text-[32px] font-bold text-[#0066FF] leading-tight flex items-center gap-2"><ShoppingBag className="w-6 h-6 text-[#0066FF]"/> 14</h3>
          </CardContent>
        </InteractivePearlCard>
      </section>

      {/* FILTER BAR  */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[16px] border border-[#E8ECF0]">
        <div className="flex flex-1 gap-4 items-center w-full">
          <div className="relative w-full max-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search vendors..." 
              className="pl-9 bg-slate-50 border-slate-200 h-10 rounded-[10px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px] h-10 bg-slate-50 border-slate-200 rounded-[10px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="cement">Cement</SelectItem>
              <SelectItem value="steel">Steel</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px] h-10 bg-slate-50 border-slate-200 rounded-[10px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px] h-10 bg-slate-50 border-slate-200 rounded-[10px]">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="h-10 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[10px] shadow-sm font-bold flex gap-2">
          <Plus className="w-4 h-4" /> Add Vendor
        </Button>
      </section>

      {/* VENDORS FULL TABLE */}
      <section>
        <PearlCard>
          <Table>
            <TableHeader className="bg-[#FAFBFC] border-b border-[#E8ECF0]">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase py-4">Vendor Info</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase">Contact details</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right">Outstanding / Limit</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-center">Last Order</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-center">Rating</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-center">Status</TableHead>
                <TableHead className="font-semibold text-xs text-[#64748B] uppercase text-right w-[160px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((v) => (
                <TableRow key={v.id} className="hover:bg-blue-50/40 border-b border-[#E8ECF0]/60 transition-colors">
                  <TableCell>
                    <div className="font-bold text-[14px] text-[#0F172A]">{v.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-mono text-slate-400">{v.id}</span>
                      <Badge variant="outline" className="bg-slate-50 text-slate-600 rounded-[4px] text-[9px] font-bold tracking-wider uppercase border-slate-200">{v.cat}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-[13px] text-[#0F172A] flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400"/> {v.phone}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{v.contact}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`font-bold text-[15px] ${v.out > 50000 ? 'text-red-600' : 'text-[#0F172A]'}`}>₹{(v.out).toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Limit: ₹{(v.limit).toLocaleString('en-IN')}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-medium text-[13px] text-slate-700">{v.date}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{v.orders} orders total</div>
                  </TableCell>
                  <TableCell className="text-center">
                     <div className="flex justify-center text-amber-400 gap-0.5">
                       {[...Array(5)].map((_, idx) => (
                          <Star key={idx} className={`w-3.5 h-3.5 ${idx < v.rating ? 'fill-current' : 'text-slate-200 fill-slate-200'}`} />
                       ))}
                     </div>
                  </TableCell>
                  <TableCell className="text-center">
                     {v.status === 'Active' ? 
                       <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shadow-none text-[10px] uppercase rounded-[4px] tracking-wider font-bold">Active</Badge> : 
                       <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 shadow-none text-[10px] uppercase rounded-[4px] tracking-wider font-bold border border-slate-200">Pending</Badge>
                     }
                  </TableCell>
                  <TableCell className="text-right space-x-1.5 whitespace-nowrap">
                     <Sheet>
                       <SheetTrigger asChild>
                         <Button variant="outline" size="sm" className="h-8 text-[11px] rounded-[6px] font-bold text-[#0F172A] border-[#E8ECF0] hover:bg-slate-50 shadow-sm" onClick={() => setSelectedVendor(v)}>Profile</Button>
                       </SheetTrigger>
                       <SheetContent className="sm:max-w-[550px] overflow-y-auto">
                         <SheetHeader className="mb-6 border-b border-[#E8ECF0] pb-4">
                           <SheetTitle className="text-2xl font-bold">{v.name}</SheetTitle>
                           <div className="flex items-center gap-2 mt-2">
                             <Badge variant="outline" className="bg-slate-50 text-slate-700 font-bold">{v.cat}</Badge>
                             <div className="flex text-amber-500 gap-0.5 items-center">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="text-sm font-bold text-[#0F172A]">{v.rating}.0</span>
                             </div>
                             {v.status === 'Active' && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shadow-none text-[10px] uppercase rounded-[4px] tracking-wider font-bold ml-auto border-none">Active Vendor</Badge>}
                           </div>
                         </SheetHeader>
                         
                         <div className="space-y-6">
                           {/* Quick Contacts */}
                           <div className="grid grid-cols-2 gap-3 mb-6">
                              <div className="bg-slate-50 p-3 rounded-[10px] border border-[#E8ECF0] flex gap-3 items-center">
                                 <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0066FF] flex items-center justify-center shrink-0"><Phone className="w-4 h-4"/></div>
                                 <div className="overflow-hidden">
                                   <p className="text-[10px] uppercase font-bold text-slate-400">Call</p>
                                   <p className="font-semibold text-[13px] text-[#0F172A] truncate">{v.phone}</p>
                                 </div>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-[10px] border border-[#E8ECF0] flex gap-3 items-center">
                                 <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0"><Mail className="w-4 h-4"/></div>
                                 <div className="overflow-hidden">
                                   <p className="text-[10px] uppercase font-bold text-slate-400">Email</p>
                                   <p className="font-semibold text-[13px] text-[#0F172A] truncate" title={v.email}>{v.email}</p>
                                 </div>
                              </div>
                           </div>

                           {/* Financials Overview */}
                           <div className="bg-red-50/50 p-6 rounded-[12px] border border-red-100 shadow-sm flex items-center justify-between">
                             <div>
                               <p className="text-[12px] uppercase font-bold text-red-700 mb-1 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4"/> Current Outstanding Balance</p>
                               <h2 className="text-4xl font-bold text-red-600 tracking-tight">₹{(v.out).toLocaleString('en-IN')}</h2>
                             </div>
                             <Button className="bg-red-600 hover:bg-red-700 text-white rounded-[8px] font-bold shadow-sm shadow-red-200">Record Payment</Button>
                           </div>

                           {/* History Tables */}
                           <div className="space-y-4">
                             <div className="flex justify-between items-center mb-2">
                               <h4 className="text-[14px] font-bold text-[#0F172A] flex items-center gap-2"><ShoppingBag className="w-4 h-4"/> Recent Orders</h4>
                               <Button variant="outline" size="sm" className="h-7 text-[10px] rounded-[6px] text-[#0066FF] border-[#E8ECF0] hover:bg-blue-50 font-bold px-2">View All</Button>
                             </div>
                             <div className="border border-[#E8ECF0] rounded-[10px] bg-white overflow-hidden shadow-sm">
                                <Table>
                                  <TableHeader className="bg-slate-50"><TableRow className="border-none"><TableHead className="py-2 text-[10px]">PO #</TableHead><TableHead className="py-2 text-[10px]">Items</TableHead><TableHead className="py-2 text-[10px] text-right">Amount</TableHead></TableRow></TableHeader>
                                  <TableBody>
                                    {OrderHistory.map((o, ix) => (
                                      <TableRow key={ix} className="border-[#E8ECF0] hover:bg-transparent"><TableCell className="py-2.5 text-[12px] font-bold text-[#0066FF]">{o.id}</TableCell><TableCell className="py-2.5 text-[12px] font-medium text-slate-600">{o.items}</TableCell><TableCell className="py-2.5 text-[12px] font-bold text-right">{o.amt}</TableCell></TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                             </div>

                             <div className="flex justify-between items-center mb-2 mt-6">
                               <h4 className="text-[14px] font-bold text-[#0F172A] flex items-center gap-2"><CreditCard className="w-4 h-4"/> Payment History</h4>
                               <Button variant="outline" size="sm" className="h-7 text-[10px] rounded-[6px] text-slate-500 border-[#E8ECF0] hover:bg-slate-50 font-bold px-2">View All</Button>
                             </div>
                             <div className="border border-[#E8ECF0] rounded-[10px] bg-white overflow-hidden shadow-sm">
                                <Table>
                                  <TableHeader className="bg-slate-50"><TableRow className="border-none"><TableHead className="py-2 text-[10px]">Date</TableHead><TableHead className="py-2 text-[10px]">Reference</TableHead><TableHead className="py-2 text-[10px] text-right">Amount</TableHead></TableRow></TableHeader>
                                  <TableBody>
                                    {PaymentHistory.map((p, ix) => (
                                      <TableRow key={ix} className="border-[#E8ECF0] hover:bg-transparent"><TableCell className="py-2.5 text-[12px] font-medium text-slate-500">{p.date}</TableCell><TableCell className="py-2.5 text-[12px] font-mono text-slate-600">{p.ref}</TableCell><TableCell className="py-2.5 text-[12px] font-bold text-emerald-600 text-right">{p.amt}</TableCell></TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                             </div>
                           </div>

                         </div>
                       </SheetContent>
                     </Sheet>

                     <Dialog>
                       <DialogTrigger asChild>
                         <Button size="sm" className="h-8 text-[11px] rounded-[6px] bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold shadow-sm" onClick={() => setSelectedVendor(v)}>New Order</Button>
                       </DialogTrigger>
                       <DialogContent className="sm:max-w-[650px]">
                         <DialogHeader>
                           <DialogTitle>Place New Purchase Order</DialogTitle>
                         </DialogHeader>
                         {selectedVendor && (
                            <div className="grid gap-5 py-4">
                               <div className="p-4 bg-slate-50 rounded-[10px] border border-[#E8ECF0] flex justify-between items-center shadow-sm">
                                  <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Vendor Selected</div>
                                    <div className="font-bold text-[16px] text-[#0F172A] flex items-center gap-2">{selectedVendor.name} <Badge variant="outline" className="text-[9px] bg-white">{selectedVendor.cat}</Badge></div>
                                  </div>
                               </div>

                               <div className="space-y-3 border p-4 rounded-[12px] border-[#E8ECF0]">
                                 <div className="flex justify-between items-center border-b border-[#E8ECF0] pb-2">
                                   <Label className="font-bold text-[#0F172A]">Order Items</Label>
                                   <Button variant="ghost" size="sm" className="h-7 text-[#0066FF] px-2 text-[11px] hover:bg-blue-50 font-bold"><Plus className="w-3 h-3 mr-1"/> Add Item</Button>
                                 </div>
                                 <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-500 uppercase px-1">
                                    <div className="col-span-5">Material Description</div>
                                    <div className="col-span-2 text-center">Qty</div>
                                    <div className="col-span-2 text-right">Unit Price</div>
                                    <div className="col-span-3 text-right pr-2">Total</div>
                                 </div>
                                 <div className="grid grid-cols-12 gap-2 mt-1">
                                    <div className="col-span-5"><Input placeholder="Item name" className="h-9 text-[13px] rounded-[6px]" /></div>
                                    <div className="col-span-2"><Input type="number" placeholder="Qty" className="h-9 text-[13px] text-center rounded-[6px]" /></div>
                                    <div className="col-span-2"><Input type="number" placeholder="₹" className="h-9 text-[13px] text-right rounded-[6px]" /></div>
                                    <div className="col-span-3"><Input disabled value="₹0.00" className="h-9 text-[13px] bg-slate-50 font-bold text-right rounded-[6px]" /></div>
                                 </div>
                               </div>

                               <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label className="font-semibold text-slate-700">Expected Delivery Date</Label>
                                    <Input type="date" className="h-10 rounded-[8px]" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="font-semibold text-slate-700">Payment Terms</Label>
                                    <Select defaultValue="net30">
                                      <SelectTrigger className="h-10 rounded-[8px]"><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="adv">100% Advance</SelectItem>
                                        <SelectItem value="net15">Net 15 Days</SelectItem>
                                        <SelectItem value="net30">Net 30 Days</SelectItem>
                                        <SelectItem value="cod">Cash on Delivery</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                               </div>

                               <div className="space-y-2">
                                 <Label className="font-semibold text-slate-700">Additional Notes / Instructions</Label>
                                 <Textarea placeholder="Delivery instructions..." rows={2} className="rounded-[8px]" />
                               </div>
                               
                               <div className="p-4 bg-blue-50 rounded-[10px] border border-blue-100 flex justify-between items-center text-blue-900 mt-2">
                                  <span className="font-bold text-[14px]">Total Order Value</span>
                                  <span className="font-black text-[20px] text-[#0066FF]">₹0.00</span>
                               </div>
                            </div>
                         )}
                         <DialogFooter className="gap-2 sm:gap-0 mt-2">
                           <Button variant="outline" className="rounded-[8px] h-10 font-semibold">Cancel</Button>
                           <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[8px] h-10 font-bold shadow-sm px-6">Generate PO</Button>
                         </DialogFooter>
                       </DialogContent>
                     </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PearlCard>
      </section>

    </div>
  )
}
