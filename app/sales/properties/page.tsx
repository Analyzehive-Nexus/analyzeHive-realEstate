'use client';

import { useEffect, useState, useMemo } from 'react';
import { createBrowserClient } from '@/lib/supabase-browser';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogTitle
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Plus, LayoutGrid, List, MoreHorizontal,
  Edit, Trash2, Eye, MapPin, 
  Building2, X, Clock, Tag, 
  IndianRupee, TrendingUp, Hexagon,
  Home, CheckCircle2, UserPlus, CreditCard,
  Loader2, Filter, Search, Download, Trash
} from 'lucide-react';

const SortIcon = ({ field, sortField, sortDir }: { field: string, sortField: string, sortDir: string }) => {
  if (sortField !== field) return <div className="inline-block w-4 h-4 ml-1 opacity-0" />;
  return sortDir === 'asc' ? 
    <TrendingUp className="w-3.5 h-3.5 inline ml-1 text-blue-500" /> : 
    <TrendingUp className="w-3.5 h-3.5 inline ml-1 text-blue-500 rotate-180 transition-transform" />;
};

export default function PropertiesPage() {
  const supabase = createBrowserClient();
  const { toast } = useToast();

  // Data state
  const [flats, setFlats] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // View mode
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [groupByProject, setGroupByProject] = useState(false);

  // Filter state
  const [projectFilter, setProjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [floorFilter, setFloorFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sorting state
  const [sortField, setSortField] = useState('flat_number');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedFlat, setSelectedFlat] = useState<any>(null);

  // Form states
  const [formLoading, setFormLoading] = useState(false);
  const [flatForm, setFlatForm] = useState({
    flatNumber: '',
    project: '',
    type: '',
    floor: '',
    areaSqft: '',
    price: '',
    facing: '',
    status: 'Available',
    carParking: '1',
    possessionDate: '',
    bookingAmount: '',
    discountPercent: '0',
    description: ''
  });

  const [bookingForm, setBookingForm] = useState({
    leadId: '',
    paymentType: 'Booking',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMode: 'Bank Transfer',
    referenceNumber: '',
    notes: ''
  });

  // --- HELPERS ---

  const getFlatPayments = (flatId: string) => {
    if (!flatId) return [];
    return payments.filter(p => String(p.flat_id) === String(flatId));
  };
  const getFlatTotalPaid = (flatId: string) => {
    if (!flatId) return 0;
    return getFlatPayments(flatId).reduce((sum, p) => sum + (p.amount || 0), 0);
  };

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  // --- DATA FETCHING ---

  const fetchFlats = async () => {
    const { data, error } = await supabase
      .from('flats_inventory')
      .select(`
        *,
        assigned_lead:leads_customers(
          id, name, phone, email, status
        )
      `)
      .order('project')
      .order('flat_number');
    if (!error) setFlats(data || []);
  };

  const fetchLeads = async () => {
    const { data } = await supabase
      .from('leads_customers')
      .select('id, name, phone, email, status')
      .not('status', 'eq', 'Lost')
      .order('name');
    setLeads(data || []);
  };

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('payment_date', { ascending: false });

    if (error) {
      console.error('Payments error:', error);
      setPayments([]);
      return;
    }

    if (!data || data.length === 0) {
      setPayments([]);
      return;
    }

    // Get unique flat IDs
    const flatIds = Array.from(new Set(
      data.filter(p => p.flat_id).map(p => String(p.flat_id))
    ));

    // Get unique lead IDs  
    const leadIds = Array.from(new Set(
      data.filter(p => p.lead_id).map(p => String(p.lead_id))
    ));

    // Fetch related flats
    let flatsMap: any = {};
    if (flatIds.length > 0) {
      const { data: flatsData } = await supabase
        .from('flats_inventory')
        .select('flat_id, flat_number, project, type')
        .in('flat_id', flatIds);
      flatsData?.forEach(f => {
        flatsMap[String(f.flat_id)] = f;
      });
    }

    // Fetch related leads
    let leadsMap: any = {};
    if (leadIds.length > 0) {
      const { data: leadsData } = await supabase
        .from('leads_customers')
        .select('id, name, phone, email')
        .in('id', leadIds);
      leadsData?.forEach(l => {
        leadsMap[String(l.id)] = l;
      });
    }

    // Join manually
    const enriched = data.map(p => ({
      ...p,
      flat: p.flat_id ? flatsMap[String(p.flat_id)] || null : null,
      lead: p.lead_id ? leadsMap[String(p.lead_id)] || null : null
    }));

    setPayments(enriched);
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchFlats(),
      fetchLeads(),
      fetchPayments()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();

    const flatsChannel = supabase
      .channel('properties-flats')
      .on('postgres_changes', {
        event: '*', schema: 'public',
        table: 'flats_inventory'
      }, () => fetchFlats())
      .subscribe();

    const paymentsChannel = supabase
      .channel('properties-payments')
      .on('postgres_changes', {
        event: '*', schema: 'public',
        table: 'payments'
      }, () => fetchPayments())
      .subscribe();

    return () => {
      supabase.removeChannel(flatsChannel);
      supabase.removeChannel(paymentsChannel);
    };
  }, []);

  // --- HELPERS ---

  const formatPrice = (price: number) => {
    if (!price) return '₹0';
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'On Hold': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Sold': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // --- COMPUTED ---

  const filteredFlats = useMemo(() => {
    return flats.filter(flat => {
      const matchesSearch = !searchQuery ||
        flat.flat_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flat.project?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flat.type?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProject = projectFilter === 'all' || flat.project === projectFilter;
      const matchesType = typeFilter === 'all' || flat.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || flat.status === statusFilter;
      const matchesFloor = floorFilter === 'all' || String(flat.floor) === floorFilter;
      return matchesSearch && matchesProject && matchesType && matchesStatus && matchesFloor;
    });
  }, [flats, searchQuery, projectFilter, typeFilter, statusFilter, floorFilter]);

  const sortedFlats = useMemo(() => {
    return [...filteredFlats].sort((a, b) => {
      const aVal = a[sortField as keyof typeof a] || '';
      const bVal = b[sortField as keyof typeof b] || '';
      const dir = sortDir === 'asc' ? 1 : -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') return (aVal - bVal) * dir;
      return String(aVal).localeCompare(String(bVal)) * dir;
    });
  }, [filteredFlats, sortField, sortDir]);

  const projects = useMemo(() => Array.from(new Set(flats.map(f => f.project).filter(Boolean))), [flats]);
  const floors = useMemo(() => Array.from(new Set(flats.map(f => f.floor).filter(Boolean))).sort((a: any, b: any) => a - b), [flats]);

  const kpis = useMemo(() => {
    const total = flats.length;
    const avail = flats.filter(f => f.status === 'Available').length;
    const hold = flats.filter(f => f.status === 'On Hold').length;
    const sold = flats.filter(f => f.status === 'Sold').length;
    const rev = flats.filter(f => f.status === 'Sold').reduce((sum, f) => sum + (f.price || 0), 0);
    const pipe = flats.filter(f => f.status === 'On Hold').reduce((sum, f) => sum + (f.price || 0), 0);
    const val = flats.filter(f => f.status === 'Available').reduce((sum, f) => sum + (f.price || 0), 0);
    const soldP = total > 0 ? Math.round((sold / total) * 100) : 0;
    const avgSqft = flats.filter(f => f.area_sqft > 0).length > 0 
      ? Math.round(flats.filter(f => f.area_sqft > 0).reduce((sum, f) => sum + f.price / f.area_sqft, 0) / flats.filter(f => f.area_sqft > 0).length)
      : 0;
      
    return { total, avail, hold, sold, rev, pipe, val, soldP, avgSqft };
  }, [flats]);

  // --- OPERATIONS ---

  const resetFlatForm = () => setFlatForm({
    flatNumber: '', project: '', type: '', floor: '', areaSqft: '', price: '',
    facing: '', status: 'Available', carParking: '1', possessionDate: '',
    bookingAmount: '', discountPercent: '0', description: ''
  });

  const handleAddFlat = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!flatForm.flatNumber || !flatForm.project || !flatForm.type) {
      toast({ title: 'Fields missing', description: 'Number, project and type required', variant: 'destructive' });
      return;
    }

    setFormLoading(true);
    const { data, error } = await supabase
      .from('flats_inventory')
      .insert({
        flat_number: flatForm.flatNumber,
        project: flatForm.project,
        type: flatForm.type,
        floor: parseInt(flatForm.floor) || 1,
        area_sqft: parseFloat(flatForm.areaSqft) || 0,
        price: parseFloat(flatForm.price) || 0,
        facing: flatForm.facing || null,
        status: flatForm.status,
        car_parking: parseInt(flatForm.carParking) || 1,
        possession_date: flatForm.possessionDate || null,
        booking_amount: parseFloat(flatForm.bookingAmount) || 0,
        discount_percent: parseFloat(flatForm.discountPercent) || 0,
        description: flatForm.description || null,
        updated_at: new Date().toISOString()
      })
      .select('*, assigned_lead:leads_customers(*)')
      .single();

    setFormLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setFlats(prev => [...prev, data]);
    toast({ title: 'Success!', description: `${flatForm.flatNumber} added` });
    setShowAddDialog(false);
    resetFlatForm();
  };

  const handleEditFlat = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedFlat) return;

    setFormLoading(true);
    const { error } = await supabase
      .from('flats_inventory')
      .update({
        flat_number: flatForm.flatNumber,
        project: flatForm.project,
        type: flatForm.type,
        floor: parseInt(flatForm.floor) || 1,
        area_sqft: parseFloat(flatForm.areaSqft) || 0,
        price: parseFloat(flatForm.price) || 0,
        facing: flatForm.facing || null,
        status: flatForm.status,
        car_parking: parseInt(flatForm.carParking) || 1,
        possession_date: flatForm.possessionDate || null,
        booking_amount: parseFloat(flatForm.bookingAmount) || 0,
        discount_percent: parseFloat(flatForm.discountPercent) || 0,
        description: flatForm.description || null,
        updated_at: new Date().toISOString()
      })
      .eq('flat_id', selectedFlat.flat_id);

    setFormLoading(false);
    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
      return;
    }

    setFlats(prev => prev.map(f => f.flat_id === selectedFlat.flat_id ? {
      ...f,
      flat_number: flatForm.flatNumber,
      project: flatForm.project,
      type: flatForm.type,
      floor: parseInt(flatForm.floor),
      area_sqft: parseFloat(flatForm.areaSqft),
      price: parseFloat(flatForm.price),
      facing: flatForm.facing,
      status: flatForm.status,
      booking_amount: parseFloat(flatForm.bookingAmount),
      discount_percent: parseFloat(flatForm.discountPercent),
      description: flatForm.description
    } : f));

    toast({ title: 'Updated!' });
    setShowEditDialog(false);
    setSelectedFlat(null);
  };

  const handleDeleteFlat = async (flat: any) => {
    if (!window.confirm(`Delete ${flat.flat_number}?`)) return;

    setFlats(prev => prev.filter(f => f.flat_id !== flat.flat_id));
    const { error } = await supabase.from('flats_inventory').delete().eq('flat_id', flat.flat_id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      fetchFlats();
    } else {
      toast({ title: 'Deleted' });
    }
  };

  const handleBookFlat = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!bookingForm.leadId || !bookingForm.amount || !bookingForm.paymentDate) {
      toast({ title: 'Required fields missing', variant: 'destructive' });
      return;
    }

    setFormLoading(true);
    const { error: pErr } = await supabase.from('payments').insert({
      flat_id: selectedFlat.flat_id,
      lead_id: bookingForm.leadId,
      payment_type: bookingForm.paymentType,
      amount: parseFloat(bookingForm.amount),
      payment_date: bookingForm.paymentDate,
      payment_mode: bookingForm.paymentMode,
      reference_number: bookingForm.referenceNumber || null,
      notes: bookingForm.notes || null,
      status: 'Received',
      created_at: new Date().toISOString()
    });

    if (pErr) {
      toast({ title: 'Payment failed', description: pErr.message, variant: 'destructive' });
      setFormLoading(false);
      return;
    }

    const newStatus = bookingForm.paymentType === 'Full Payment' ? 'Sold' : 'On Hold';
    await supabase.from('flats_inventory').update({
      status: newStatus,
      assigned_lead_id: bookingForm.leadId,
      updated_at: new Date().toISOString()
    }).eq('flat_id', selectedFlat.flat_id);

    // Update lead status
    await supabase.from('leads_customers').update({
      status: newStatus === 'Sold' ? 'Converted' : 'Negotiation',
      updated_at: new Date().toISOString()
    }).eq('id', bookingForm.leadId);

    const bookedLead = leads.find(l => l.id === bookingForm.leadId);
    setFlats(prev => prev.map(f => f.flat_id === selectedFlat.flat_id ? {
      ...f, status: newStatus, assigned_lead_id: bookingForm.leadId, assigned_lead: bookedLead
    } : f));

    setFormLoading(false);
    toast({ title: newStatus === 'Sold' ? 'Sold!' : 'Booked!' });
    setShowBookingDialog(false);
    setSelectedFlat(null);
    fetchPayments();
  };

  const handleReleaseFlat = async (flat: any) => {
    if (!window.confirm(`Release ${flat.flat_number}?`)) return;
    setFlats(prev => prev.map(f => f.flat_id === flat.flat_id ? { ...f, status: 'Available', assigned_lead_id: null, assigned_lead: null } : f));
    await supabase.from('flats_inventory').update({
      status: 'Available', assigned_lead_id: null, updated_at: new Date().toISOString()
    }).eq('flat_id', flat.flat_id);
    toast({ title: 'Released' });
  };

  const handleEditClick = (flat: any) => {
    setSelectedFlat(flat);
    setFlatForm({
      flatNumber: flat.flat_number || '',
      project: flat.project || '',
      type: flat.type || '',
      floor: String(flat.floor || ''),
      areaSqft: String(flat.area_sqft || ''),
      price: String(flat.price || ''),
      facing: flat.facing || '',
      status: flat.status || 'Available',
      carParking: String(flat.car_parking || '1'),
      possessionDate: flat.possession_date || '',
      bookingAmount: String(flat.booking_amount || ''),
      discountPercent: String(flat.discount_percent || '0'),
      description: flat.description || ''
    });
    setShowEditDialog(true);
  };

  // --- SUB-COMPONENTS ---

  const FlatCard = ({ flat }: { flat: any }) => {
    const isHot = (flat.price / flat.area_sqft) < (kpis.avgSqft * 0.95) && flat.status === 'Available';
    const recentUpdate = flat.updated_at && (new Date().getTime() - new Date(flat.updated_at).getTime()) < 30 * 24 * 60 * 60 * 1000;
    const discountedPrice = flat.price * (1 - (parseFloat(flat.discount_percent || 0) / 100));

    return (
      <Card className={`relative overflow-hidden group shadow-sm bg-white border-t-4 ${
        flat.status === 'Available' ? 'border-t-emerald-500' :
        flat.status === 'On Hold' ? 'border-t-amber-500' : 'border-t-blue-500'
      } rounded-2xl hover:shadow-xl transition-all duration-300`}>
        <CardContent className="p-5 pt-6 flex flex-col h-full">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-2xl font-bold text-[#0F172A] leading-tight flex items-center gap-2">
                {flat.flat_number}
                {isHot && <Badge className="bg-red-500 text-white rounded-md text-[10px] font-bold px-1.5 h-4">HOT</Badge>}
              </h3>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">{flat.project}</p>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <Badge variant="outline" className={`${getStatusColor(flat.status)} rounded-full px-2 py-0 border-transparent text-[10px] font-bold uppercase`}>
                {flat.status}
              </Badge>
              <Badge variant="outline" className="text-[10px] rounded-lg bg-gray-50 text-gray-500 border-gray-100 font-bold">{flat.type}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-3 mt-4 mb-5">
            <div className="flex items-center gap-2">
              <Hexagon className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Area</p>
                <p className="text-[13px] font-semibold text-[#0F172A]">{flat.area_sqft} sqft</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-400" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Floor</p>
                <p className="text-[13px] font-semibold text-[#0F172A]">{flat.floor}</p>
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <div className="border-t border-gray-50 pt-3">
              <p className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">Final Price</p>
              <div className="flex items-baseline gap-2">
                 <span className="text-[22px] font-bold text-[#0066FF]">{formatPrice(discountedPrice)}</span>
                 {flat.discount_percent > 0 && (
                   <span className="text-xs text-gray-400 line-through">₹{(flat.price/100000).toFixed(1)}L</span>
                 )}
              </div>
              <div className="flex items-center justify-between mt-1">
                 <span className="text-[11px] text-gray-400 font-medium">₹{Math.round(flat.price/flat.area_sqft).toLocaleString()}/sqft</span>
                 {recentUpdate && <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5"><TrendingUp className="w-3 h-3"/>Price Updated</span>}
              </div>
            </div>

            {flat.assigned_lead && (
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1">
                 <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tight">Assigned Buyer</p>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-[#0F172A]">{flat.assigned_lead.name}</span>
                    <Badge className="bg-blue-100 text-blue-700 text-[9px] rounded-md">{Math.round((getFlatTotalPaid(flat.flat_id)/flat.price)*100)}% Paid</Badge>
                 </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => { setSelectedFlat(flat); setShowDetailDialog(true); }}
                className="rounded-xl border-gray-100 h-9 font-semibold hover:bg-gray-50 text-gray-700"
              >
                Details
              </Button>
              {flat.status === 'Available' ? (
                <Button 
                  size="sm"
                  onClick={() => { setSelectedFlat(flat); setShowBookingDialog(true); }}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white h-9 font-semibold"
                >
                  Book
                </Button>
              ) : (
                <Button 
                  size="sm"
                  onClick={() => handleReleaseFlat(flat)}
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white h-9 font-semibold"
                >
                  Release
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const PropertyActions = ({ flat }: { flat: any }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-400">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl border-gray-100 shadow-xl p-1">
        <DropdownMenuItem onClick={() => { setSelectedFlat(flat); setShowDetailDialog(true); }} className="rounded-lg py-2 cursor-pointer">
          <Eye className="w-4 h-4 mr-2 text-gray-500" /> View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleEditClick(flat)} className="rounded-lg py-2 cursor-pointer">
          <Edit className="w-4 h-4 mr-2 text-gray-500" /> Edit Property
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-50" />
        <DropdownMenuItem 
          onClick={() => { setSelectedFlat(flat); setShowBookingDialog(true); }} 
          className="rounded-lg py-2 cursor-pointer text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50"
        >
          <Plus className="w-4 h-4 mr-2" /> Book / Pay
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleQuickStatusChange(flat, 'Available')}
          className="rounded-lg py-2 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Mark Available
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-50" />
        <DropdownMenuItem 
          onClick={() => handleDeleteFlat(flat)}
          className="rounded-lg py-2 cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
        >
          <Trash className="w-4 h-4 mr-2" /> Delete Property
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const handleQuickStatusChange = async (flat: any, status: string) => {
    setFlats(prev => prev.map(f => f.flat_id === flat.flat_id ? { ...f, status } : f));
    await supabase.from('flats_inventory').update({ status }).eq('flat_id', flat.flat_id);
    toast({ title: `${flat.flat_number} updated to ${status}` });
  };

  // --- RENDER HELPERS ---

  if (loading) {
    return (
      <div className="p-8 max-w-[1700px] mx-auto min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#0066FF]" />
        <p className="text-gray-500 font-medium">Loading property inventory...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1700px] mx-auto pb-24 space-y-8 font-sans bg-[#F8FAFC]">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight">Property Inventory</h1>
          <p className="text-[#64748B] text-sm mt-1">Managing {flats.length} units across {projects.length} projects</p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-xl border border-gray-100">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              viewMode === 'grid' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Grid
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              viewMode === 'table' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <List className="w-4 h-4" />
            Table
          </button>
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-xl h-11 px-6 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Property
          </Button>
        </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Total Units', value: kpis.total, sub: `${kpis.avail} available`, icon: Building2, color: 'blue' },
          { label: 'Available', value: kpis.avail, sub: `${kpis.soldP}% sold`, icon: CheckCircle2, color: 'emerald' },
          { label: 'On Hold', value: kpis.hold, sub: `Pipe: ${formatPrice(kpis.pipe)}`, icon: Clock, color: 'amber' },
          { label: 'Sold', value: kpis.sold, sub: `Rev: ${formatPrice(kpis.rev)}`, icon: Tag, color: 'indigo' },
          { label: 'Inventory Value', value: formatPrice(kpis.val), sub: 'Unsold stock', icon: IndianRupee, color: 'purple' },
          { label: 'Avg Price/sqft', value: `₹${kpis.avgSqft.toLocaleString()}`, sub: 'All projects', icon: TrendingUp, color: 'orange' },
        ].map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden bg-white">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 
                ${kpi.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  kpi.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                  kpi.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                  kpi.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                  kpi.color === 'purple' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'}`}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0F172A] leading-none mb-1.5">{kpi.value}</h3>
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-0.5">{kpi.label}</p>
                <p className="text-xs text-gray-400 font-medium">{kpi.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. Filter Bar */}
      <Card className="border-none shadow-sm bg-white overflow-visible">
        <div className="p-4 flex flex-col xl:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by flat number, project, or type..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 h-10 border-gray-100 bg-[#F1F5F9]/50 rounded-xl focus:bg-white"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-[150px] rounded-xl h-10 border-gray-100">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px] rounded-xl h-10 border-gray-100">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="1BHK">1BHK</SelectItem>
                <SelectItem value="2BHK">2BHK</SelectItem>
                <SelectItem value="3BHK">3BHK</SelectItem>
                <SelectItem value="Villa">Villa</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] rounded-xl h-10 border-gray-100">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Sold">Sold</SelectItem>
              </SelectContent>
            </Select>

            <Select value={floorFilter} onValueChange={setFloorFilter}>
              <SelectTrigger className="w-[110px] rounded-xl h-10 border-gray-100">
                <SelectValue placeholder="Floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Floors</SelectItem>
                {floors.map(f => <SelectItem key={f} value={String(f)}>Floor {f}</SelectItem>)}
              </SelectContent>
            </Select>

            {(searchQuery || projectFilter !== 'all' || typeFilter !== 'all' || statusFilter !== 'all' || floorFilter !== 'all') && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery('');
                  setProjectFilter('all');
                  setTypeFilter('all');
                  setStatusFilter('all');
                  setFloorFilter('all');
                }}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-10 px-3 rounded-xl"
              >
                Clear
              </Button>
            )}

            <div className="h-6 w-px bg-gray-200 mx-1 hidden md:block" />

            <div className="flex items-center gap-2 px-3 h-10 rounded-xl bg-[#F8FAFC] border border-gray-200">
              <span className="text-[12px] font-bold text-gray-500 uppercase tracking-tight">Group</span>
              <button
                onClick={() => setGroupByProject(!groupByProject)}
                className={`w-10 h-5 rounded-full relative transition-colors ${groupByProject ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${groupByProject ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* 4. Main Inventory View */}
      <div className="space-y-8">
        {viewMode === 'grid' ? (
          groupByProject ? (
            projects.map(project => {
              const projectFlats = sortedFlats.filter(f => f.project === project);
              const projectAvail = projectFlats.filter(f => f.status === 'Available').length;
              if (projectFlats.length === 0) return null;
              
              return (
                <div key={project} className="space-y-4">
                  <div className="flex items-center justify-between py-3 px-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-[#0066FF]" />
                      <span className="font-bold text-[#0F172A] text-lg">{project}</span>
                      <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-100 rounded-lg font-medium">
                        {projectAvail} avail / {projectFlats.length} total
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                       <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 rounded-lg">{projectAvail} Available</Badge>
                       <Badge className="bg-amber-50 text-amber-600 border-amber-100 rounded-lg">{projectFlats.filter(f=>f.status==='On Hold').length} On Hold</Badge>
                       <Badge className="bg-blue-50 text-blue-600 border-blue-100 rounded-lg">{projectFlats.filter(f=>f.status==='Sold').length} Sold</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {projectFlats.map(flat => <FlatCard key={flat.flat_id} flat={flat} />)}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedFlats.map(flat => <FlatCard key={flat.flat_id} flat={flat} />)}
              {sortedFlats.length === 0 && (
                <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                  <Home className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-medium">No properties found matching your filters</p>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700" onClick={() => handleSort('flat_number')}>
                      Flat # / Project <SortIcon field="flat_number" sortField={sortField} sortDir={sortDir} />
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700" onClick={() => handleSort('type')}>
                      Type / Floor <SortIcon field="type" sortField={sortField} sortDir={sortDir} />
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700" onClick={() => handleSort('area_sqft')}>
                      Area / Facing <SortIcon field="area_sqft" sortField={sortField} sortDir={sortDir} />
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700" onClick={() => handleSort('price')}>
                      Price <SortIcon field="price" sortField={sortField} sortDir={sortDir} />
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700" onClick={() => handleSort('status')}>
                      Status <SortIcon field="status" sortField={sortField} sortDir={sortDir} />
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Assigned To</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Paid</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedFlats.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-12 text-gray-400">No properties found</td></tr>
                  ) : (
                    sortedFlats.map((flat, index) => {
                      const flatPaymentsTotal = getFlatTotalPaid(flat.flat_id);
                      const discountedPrice = flat.discount_percent > 0 ? flat.price * (1 - flat.discount_percent / 100) : flat.price;
                      return (
                        <tr key={flat.flat_id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-gray-900 text-sm">{flat.flat_number}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{flat.project}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">{flat.type}</span>
                            <div className="text-xs text-gray-500 mt-1">Floor {flat.floor || 1}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{flat.area_sqft ? `${flat.area_sqft} sqft` : '—'}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{flat.facing ? `${flat.facing}-facing` : '—'}</div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="text-sm font-semibold text-gray-900">{formatPrice(discountedPrice)}</div>
                            {flat.discount_percent > 0 && <div className="text-xs text-gray-400 line-through mt-0.5">{formatPrice(flat.price)}</div>}
                            {flat.area_sqft > 0 && <div className="text-xs text-gray-400 mt-0.5">₹{Math.round(flat.price / flat.area_sqft).toLocaleString('en-IN')}/sqft</div>}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(flat.status)}`}>{flat.status}</span>
                          </td>
                          <td className="px-4 py-3">
                            {flat.assigned_lead ? (
                              <div>
                                <div className="text-sm font-medium text-gray-900">{flat.assigned_lead.name}</div>
                                <div className="text-xs text-gray-500">{flat.assigned_lead.phone}</div>
                              </div>
                            ) : <span className="text-gray-400 text-sm">—</span>}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {flatPaymentsTotal > 0 ? (
                              <div>
                                <div className="text-sm font-medium text-green-700">{formatPrice(flatPaymentsTotal)}</div>
                                <div className="text-xs text-gray-400">{Math.round((flatPaymentsTotal / flat.price) * 100)}% paid</div>
                              </div>
                            ) : <span className="text-gray-400 text-sm">—</span>}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              {flat.status === 'Available' && (
                                <button onClick={() => { setSelectedFlat(flat); setBookingForm({ leadId: '', paymentType: 'Booking', amount: String(flat.booking_amount || ''), paymentDate: new Date().toISOString().split('T')[0], paymentMode: 'Bank Transfer', referenceNumber: '', notes: '' }); setShowBookingDialog(true); }} className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">Book</button>
                              )}
                              {flat.status !== 'Available' && (
                                <button onClick={() => { setSelectedFlat(flat); setBookingForm({ leadId: flat.assigned_lead_id || '', paymentType: 'Installment', amount: '', paymentDate: new Date().toISOString().split('T')[0], paymentMode: 'Bank Transfer', referenceNumber: '', notes: '' }); setShowBookingDialog(true); }} className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">+ Pay</button>
                              )}
                              <button onClick={() => handleEditClick(flat)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><Edit className="w-3.5 h-3.5 text-gray-500" /></button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><MoreHorizontal className="w-3.5 h-3.5 text-gray-500" /></button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                  <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => { setSelectedFlat(flat); setShowDetailDialog(true); }}><Eye className="w-4 h-4 text-blue-500" /> View Details</DropdownMenuItem>
                                  <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleEditClick(flat)}><Edit className="w-4 h-4 text-gray-500" /> Edit Property</DropdownMenuItem>
                                  {flat.status !== 'Available' && (
                                    <DropdownMenuItem className="gap-2 cursor-pointer text-amber-600" onClick={() => handleReleaseFlat(flat)}><CheckCircle2 className="w-4 h-4" /> Release to Available</DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => handleDeleteFlat(flat)}><Trash2 className="w-4 h-4" /> Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
                {sortedFlats.length > 0 && (
                  <tfoot>
                    <tr className="bg-gray-50 border-t-2 border-gray-200">
                      <td colSpan={3} className="px-4 py-3 text-xs font-semibold text-gray-600">{sortedFlats.length} properties</td>
                      <td className="px-4 py-3 text-right text-xs font-semibold text-gray-900">{formatPrice(sortedFlats.reduce((sum, f) => sum + (f.price || 0), 0))}</td>
                      <td colSpan={2} className="px-4 py-3 text-xs text-gray-500">{sortedFlats.filter(f => f.status === 'Available').length} available · {sortedFlats.filter(f => f.status === 'Sold').length} sold</td>
                      <td className="px-4 py-3 text-right text-xs font-semibold text-green-700">{formatPrice(sortedFlats.reduce((sum, f) => sum + getFlatTotalPaid(f.flat_id), 0))}</td>
                      <td />
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 5. Project Summary Bottom Section */}
      <div className="mt-12 space-y-4">
        <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
           <Building2 className="w-5 h-5 text-[#0066FF]" />
           Project-wise Summary
        </h2>
        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-3xl">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-gray-100 hover:bg-transparent">
                <TableHead className="font-bold text-[#64748B] text-[11px] uppercase tracking-wider py-4">Project Name</TableHead>
                <TableHead className="font-bold text-[#64748B] text-[11px] uppercase tracking-wider">Total Units</TableHead>
                <TableHead className="font-bold text-[#64748B] text-[11px] uppercase tracking-wider">Available</TableHead>
                <TableHead className="font-bold text-[#64748B] text-[11px] uppercase tracking-wider">On Hold</TableHead>
                <TableHead className="font-bold text-[#64748B] text-[11px] uppercase tracking-wider">Sold</TableHead>
                <TableHead className="font-bold text-[#64748B] text-[11px] uppercase tracking-wider">% Sold</TableHead>
                <TableHead className="font-bold text-[#64748B] text-[11px] uppercase tracking-wider">Sold Value</TableHead>
                <TableHead className="font-bold text-[#64748B] text-[11px] uppercase tracking-wider text-right pr-6">Inventory Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map(p => {
                const pf = flats.filter(f => f.project === p);
                const ps = pf.filter(f => f.status === 'Sold').length;
                const pa = pf.filter(f => f.status === 'Available').length;
                const ph = pf.filter(f => f.status === 'On Hold').length;
                const sv = pf.filter(f => f.status === 'Sold').reduce((s, f) => s + f.price, 0);
                const iv = pf.filter(f => f.status === 'Available').reduce((s, f) => s + f.price, 0);
                return (
                  <TableRow key={p} className="border-gray-50 hover:bg-[#F8FAFC]">
                    <TableCell className="font-bold text-[#0F172A] py-4">{p}</TableCell>
                    <TableCell className="font-semibold text-gray-600">{pf.length}</TableCell>
                    <TableCell className="text-emerald-600 font-semibold">{pa}</TableCell>
                    <TableCell className="text-amber-600 font-semibold">{ph}</TableCell>
                    <TableCell className="text-blue-600 font-semibold">{ps}</TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-500" style={{ width: `${Math.round((ps/pf.length)*100)}%` }} />
                          </div>
                          <span className="text-xs font-bold text-gray-500">{Math.round((ps/pf.length)*100)}%</span>
                       </div>
                    </TableCell>
                    <TableCell className="font-bold text-[#0F172A]">{formatPrice(sv)}</TableCell>
                    <TableCell className="text-right font-bold text-[#0F172A] pr-6">{formatPrice(iv)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* 6. MODALS / DIALOGS */}

      {/* ADD PROPERTY DIALOG */}
      <Dialog open={showAddDialog} onOpenChange={(open) => { setShowAddDialog(open); if (!open) resetFlatForm(); }}>
        <DialogContent className="max-w-[640px] rounded-2xl p-0 overflow-hidden max-h-[90vh]">
          <div className="bg-[#0A1628] px-6 py-5 flex items-center justify-between">
            <div>
              <DialogTitle className="text-white text-lg font-semibold">Add New Property</DialogTitle>
              <p className="text-blue-300 text-sm mt-1">Add a flat or unit to inventory</p>
            </div>
            <button onClick={() => setShowAddDialog(false)} className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-5">
            <form id="add-flat-form" onSubmit={handleAddFlat} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Flat / Unit Number *</Label>
                  <Input placeholder="e.g. A-101" value={flatForm.flatNumber} onChange={e => setFlatForm(p => ({ ...p, flatNumber: e.target.value }))} className="rounded-[10px] h-10" required />
                </div>
                <div className="space-y-1.5">
                  <Label>Project / Tower *</Label>
                  <Select value={flatForm.project} onValueChange={val => setFlatForm(p => ({ ...p, project: val }))}>
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

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Flat Type *</Label>
                  <Select value={flatForm.type} onValueChange={val => setFlatForm(p => ({ ...p, type: val }))}>
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1BHK">1BHK</SelectItem>
                      <SelectItem value="2BHK">2BHK</SelectItem>
                      <SelectItem value="3BHK">3BHK</SelectItem>
                      <SelectItem value="4BHK">4BHK</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="Penthouse">Penthouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Floor Number</Label>
                  <Input type="number" placeholder="e.g. 3" value={flatForm.floor} onChange={e => setFlatForm(p => ({ ...p, floor: e.target.value }))} className="rounded-[10px] h-10" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Area (sq ft)</Label>
                  <Input type="number" placeholder="e.g. 1200" value={flatForm.areaSqft} onChange={e => setFlatForm(p => ({ ...p, areaSqft: e.target.value }))} className="rounded-[10px] h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label>Facing Direction</Label>
                  <Select value={flatForm.facing} onValueChange={val => setFlatForm(p => ({ ...p, facing: val }))}>
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue placeholder="Select facing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="North">North</SelectItem>
                      <SelectItem value="South">South</SelectItem>
                      <SelectItem value="East">East</SelectItem>
                      <SelectItem value="West">West</SelectItem>
                      <SelectItem value="North-East">North-East</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Base Price (₹)</Label>
                  <Input type="number" placeholder="e.g. 4500000" value={flatForm.price} onChange={e => setFlatForm(p => ({ ...p, price: e.target.value }))} className="rounded-[10px] h-10" />
                  {flatForm.price && <p className="text-xs text-gray-400">= {formatPrice(parseFloat(flatForm.price))}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Booking Amount (₹)</Label>
                  <Input type="number" placeholder="e.g. 100000" value={flatForm.bookingAmount} onChange={e => setFlatForm(p => ({ ...p, bookingAmount: e.target.value }))} className="rounded-[10px] h-10" />
                </div>
              </div>
            </form>
          </div>

          <div className="border-t px-6 py-4 flex gap-3 bg-white">
            <Button onClick={handleAddFlat} disabled={formLoading} className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-xl h-10">
              {formLoading ? 'Adding...' : 'Add Property'}
            </Button>
            <Button variant="outline" className="rounded-xl h-10 px-6" onClick={() => setShowAddDialog(false)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT PROPERTY DIALOG */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-[640px] rounded-2xl p-0 overflow-hidden max-h-[90vh]">
          <div className="bg-[#0A1628] px-6 py-5 flex items-center justify-between">
            <div>
              <DialogTitle className="text-white text-lg font-semibold">Edit Property</DialogTitle>
              <p className="text-blue-300 text-sm mt-1">{selectedFlat?.flat_number} · {selectedFlat?.project}</p>
            </div>
            <button onClick={() => setShowEditDialog(false)} className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-5">
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Flat Number</Label>
                  <Input value={flatForm.flatNumber} onChange={e => setFlatForm(p => ({ ...p, flatNumber: e.target.value }))} className="rounded-[10px] h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={flatForm.status} onValueChange={val => setFlatForm(p => ({ ...p, status: val }))}>
                    <SelectTrigger className="rounded-[10px] h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                      <SelectItem value="Sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                   <Label>Base Price (₹)</Label>
                   <Input type="number" value={flatForm.price} onChange={e => setFlatForm(p => ({ ...p, price: e.target.value }))} className="rounded-[10px] h-10" />
                </div>
                <div className="space-y-1.5">
                   <Label>Discount (%)</Label>
                   <Input type="number" value={flatForm.discountPercent} onChange={e => setFlatForm(p => ({ ...p, discountPercent: e.target.value }))} className="rounded-[10px] h-10" />
                </div>
              </div>
            </form>
          </div>

          <div className="border-t px-6 py-4 flex gap-3 bg-white">
            <Button onClick={handleEditFlat} disabled={formLoading} className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-xl h-10">
              {formLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" className="rounded-xl h-10 px-6" onClick={() => setShowEditDialog(false)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* BOOKING DIALOG */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-[500px] rounded-2xl p-0 overflow-hidden">
          <div className="bg-[#0A1628] px-6 py-5">
            <DialogTitle className="text-white text-lg font-semibold">Book / Record Payment</DialogTitle>
            {selectedFlat && (
              <div className="flex gap-3 mt-2 text-blue-300 text-sm">
                <span>{selectedFlat.flat_number}</span>
                <span>·</span>
                <span>{selectedFlat.project}</span>
                <span>·</span>
                <span className="text-emerald-400 font-bold">{formatPrice(selectedFlat.price)}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleBookFlat} className="px-0 py-0 space-y-0">
            {(() => {
              const existingPayments = selectedFlat ? getFlatPayments(selectedFlat.flat_id) : [];
              const totalPaid = selectedFlat ? getFlatTotalPaid(selectedFlat.flat_id) : 0;
              if (existingPayments.length === 0) return null;

              return (
                <div className="px-6 py-4 bg-blue-50 border-b border-blue-100 shadow-inner">
                  <p className="text-[11px] font-bold text-blue-700 uppercase tracking-wider mb-2">Previous Payments</p>
                  <div className="space-y-1">
                    {existingPayments.map((p: any) => (
                      <div key={p.id} className="flex justify-between text-xs text-blue-800">
                        <span>{p.payment_type} · {new Date(p.payment_date).toLocaleDateString('en-IN')}</span>
                        <span className="font-bold">{formatPrice(p.amount)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs font-bold text-blue-900 border-t border-blue-200 mt-2 pt-2">
                    <span>Total Paid</span>
                    <span>{formatPrice(totalPaid)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-blue-700 mt-1">
                    <span>Outstanding</span>
                    <span className="font-bold">{formatPrice((selectedFlat?.price || 0) - totalPaid)}</span>
                  </div>
                </div>
              );
            })()}

            <div className="px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                <Label>Assign to Lead / Buyer *</Label>
                <Select value={bookingForm.leadId} onValueChange={val => setBookingForm(p => ({ ...p, leadId: val }))}>
                  <SelectTrigger className="rounded-[10px] h-10">
                    <SelectValue placeholder="Select buyer" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map(l => <SelectItem key={l.id} value={l.id}>{l.name} — {l.phone}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Amount (₹) *</Label>
                  <Input type="number" value={bookingForm.amount} onChange={e => setBookingForm(p => ({ ...p, amount: e.target.value }))} className="rounded-[10px] h-10" required />
                </div>
                <div className="space-y-1.5">
                  <Label>Payment Date *</Label>
                  <Input type="date" value={bookingForm.paymentDate} onChange={e => setBookingForm(p => ({ ...p, paymentDate: e.target.value }))} className="rounded-[10px] h-10" required />
                </div>
              </div>
              <Button type="submit" disabled={formLoading} className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-xl h-11 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                {formLoading ? 'Processing...' : 'Confirm Payment & Update'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* DETAIL DIALOG */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-[700px] rounded-2xl p-0 overflow-hidden max-h-[90vh]">
          <div className="bg-[#F8FAFC] border-b border-gray-100 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center font-bold text-lg text-[#0F172A]">{selectedFlat?.flat_number}</div>
              <div>
                 <DialogTitle className="text-xl font-bold text-[#0F172A]">{selectedFlat?.project}</DialogTitle>
                 <Badge className={`${getStatusColor(selectedFlat?.status || '')} rounded-full text-[10px] font-bold uppercase mt-1`}>{selectedFlat?.status}</Badge>
              </div>
            </div>
            <button onClick={() => setShowDetailDialog(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-8">
             <div className="grid grid-cols-4 gap-4 p-4 bg-[#F8FAFC] rounded-2xl border border-gray-100">
                {[
                  { label: 'Type', val: selectedFlat?.type },
                  { label: 'Floor', val: selectedFlat?.floor },
                  { label: 'Area', val: `${selectedFlat?.area_sqft} sq.ft` },
                  { label: 'Price', val: formatPrice(selectedFlat?.price || 0) },
                ].map((d, i) => (
                  <div key={i}>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{d.label}</p>
                    <p className="text-sm font-bold text-[#0F172A]">{d.val}</p>
                  </div>
                ))}
             </div>

             {selectedFlat?.assigned_lead && (
               <div className="space-y-3">
                  <h4 className="font-bold text-[#0F172A] flex items-center gap-2"><UserPlus className="w-4 h-4 text-blue-500" /> Buyer Information</h4>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50/30 rounded-2xl border border-blue-50">
                    <div>
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-tight">Name</p>
                      <p className="font-bold text-[#0F172A]">{selectedFlat.assigned_lead.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-tight">Phone</p>
                      <p className="font-bold text-[#0F172A]">{selectedFlat.assigned_lead.phone}</p>
                    </div>
                  </div>
               </div>
             )}

             {(() => {
                const flatPayments = selectedFlat ? getFlatPayments(selectedFlat.flat_id) : [];
                const totalPaid = selectedFlat ? getFlatTotalPaid(selectedFlat.flat_id) : 0;
                const remaining = selectedFlat ? (selectedFlat.price || 0) - totalPaid : 0;
                const paidPercent = selectedFlat?.price > 0 ? Math.round((totalPaid / selectedFlat.price) * 100) : 0;

                return (
                  <div className="space-y-5">
                    <h4 className="font-bold text-[#0F172A] flex items-center gap-2">
                       <CreditCard className="w-4 h-4 text-emerald-500" /> Payment History
                    </h4>

                    {selectedFlat?.price > 0 && selectedFlat?.status !== 'Available' && (
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                          <span>Paid: {formatPrice(totalPaid)}</span>
                          <span>Remaining: {formatPrice(remaining)}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${paidPercent}%` }} />
                        </div>
                        <p className="text-[11px] text-gray-400 mt-2 text-right font-medium">
                          {paidPercent}% of {formatPrice(selectedFlat.price)} recovered
                        </p>
                      </div>
                    )}

                    {flatPayments.length === 0 ? (
                      <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        <CreditCard className="w-8 h-8 text-gray-300 mx-auto mb-2 opacity-50" />
                        <p className="text-sm text-gray-400 font-medium">No payments recorded yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {flatPayments.map((payment: any) => (
                          <div key={payment.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-blue-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#0F172A]">{payment.payment_type}</p>
                                <p className="text-[11px] text-[#64748B] flex items-center gap-1.5 mt-0.5">
                                  {new Date(payment.payment_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  {payment.payment_mode && <span>• {payment.payment_mode}</span>}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-[#0F172A]">{formatPrice(payment.amount)}</p>
                              <Badge className={`mt-1 text-[9px] font-bold uppercase px-1.5 h-4 border-transparent ${payment.status === 'Received' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                {payment.status || 'Received'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-between items-center p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20 text-white mt-4">
                          <span className="text-sm font-bold uppercase tracking-wider">Total Collection</span>
                          <span className="text-lg font-bold">{formatPrice(totalPaid)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
             })()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
