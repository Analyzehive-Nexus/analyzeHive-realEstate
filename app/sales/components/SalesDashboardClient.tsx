'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';
import {
  Users, Calendar, TrendingUp, IndianRupee,
  MessageCircle, Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

type KPIs = {
  totalLeads: number;
  todayVisits: number;
  convertedLeads: number;
  revenuePipeline: number;
  totalVisits: number;
  avgDealSize: number;
};

type Message = {
  id: string;
  to_phone: string;
  message_text: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  created_at: string;
  lead: { name: string } | null;
};

export default function SalesDashboardClient() {
  const supabase = createBrowserClient();
  const router = useRouter();
  const [kpis, setKpis] = useState<KPIs>({
    totalLeads: 0,
    todayVisits: 0,
    convertedLeads: 0,
    revenuePipeline: 0,
    totalVisits: 0,
    avgDealSize: 0,
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'SENT' | 'DELIVERED' | 'READ'>('ALL');

  // Helper to compute all KPIs
  const computeKPIs = (
    leads: any[],
    visits: any[],
    flats: any[]
  ): KPIs => {
    const totalLeads = leads.length;
    const convertedLeads = leads.filter(l => l.status === 'Converted').length;

    const today = new Date().toISOString().split('T')[0];
    const todayVisits = visits.filter(v => {
      const visitDate = new Date(v.scheduled_at).toISOString().split('T')[0];
      return visitDate === today && v.status !== 'No Show';
    }).length;

    const soldFlats = flats.filter(f => f.status === 'Sold');
    const revenuePipeline = soldFlats.reduce((sum, f) => sum + (f.price || 0), 0);

    const totalVisits = visits.length;
    const avgDealSize = soldFlats.length ? revenuePipeline / soldFlats.length : 0;

    return { totalLeads, todayVisits, convertedLeads, revenuePipeline, totalVisits, avgDealSize };
  };

  const fetchInitialData = async () => {
    setLoading(true);
    const [leadsRes, visitsRes, flatsRes, messagesRes] = await Promise.all([
      supabase.from('leads_customers').select('status'),
      supabase.from('site_visits').select('scheduled_at, status'),
      supabase.from('flats_inventory').select('status, price'),
      supabase.from('whatsapp_messages').select(`
        id, to_phone, message_text, status, created_at,
        lead:leads_customers(id, name)
      `).order('created_at', { ascending: false })
    ]);

    setKpis(computeKPIs(leadsRes.data || [], visitsRes.data || [], flatsRes.data || []));
    setMessages(messagesRes.data as unknown as Message[] || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchInitialData();

    // Real‑time subscriptions
    const leadsChannel = supabase
      .channel('sales-dashboard-leads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads_customers' }, () => fetchInitialData())
      .subscribe();

    const visitsChannel = supabase
      .channel('sales-dashboard-visits')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_visits' }, () => fetchInitialData())
      .subscribe();

    const flatsChannel = supabase
      .channel('sales-dashboard-flats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'flats_inventory' }, () => fetchInitialData())
      .subscribe();

    const messagesChannel = supabase
      .channel('sales-dashboard-messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'whatsapp_messages' }, (payload) => {
        // Append new message to the list (optimistic update)
        const newMsg = payload.new as any;
        setMessages(prev => [{
          id: newMsg.id,
          to_phone: newMsg.to_phone,
          message_text: newMsg.message_text,
          status: newMsg.status,
          created_at: newMsg.created_at,
          lead: null // We'll not join lead for real‑time inserts for simplicity
        }, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(visitsChannel);
      supabase.removeChannel(flatsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, []);

  // Filter messages based on active tab
  const filteredMessages = messages.filter(msg => {
    if (activeTab === 'ALL') return true;
    return msg.status === activeTab;
  });

  const formatCurrency = (value: number) => {
    if (value >= 1e7) return `₹${(value / 1e7).toFixed(1)}Cr`;
    if (value >= 1e5) return `₹${(value / 1e5).toFixed(1)}L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const kpiCards = [
    { label: "Total Leads", value: kpis.totalLeads, icon: Users, color: "from-blue-600 to-blue-400", shadow: "shadow-blue-500/30" },
    { label: "Visits Today", value: kpis.todayVisits, icon: Calendar, color: "from-purple-600 to-purple-400", shadow: "shadow-purple-500/30" },
    { label: "Converted", value: kpis.convertedLeads, icon: TrendingUp, color: "from-green-500 to-emerald-400", shadow: "shadow-green-500/30" },
    { label: "Revenue Pipeline", value: formatCurrency(kpis.revenuePipeline), icon: IndianRupee, color: "from-orange-500 to-amber-400", shadow: "shadow-orange-500/30" },
    { label: "Total Visits", value: kpis.totalVisits, icon: Calendar, color: "from-indigo-500 to-indigo-400", shadow: "shadow-indigo-500/30" },
    { label: "Avg Deal Size", value: formatCurrency(kpis.avgDealSize), icon: TrendingUp, color: "from-cyan-500 to-cyan-400", shadow: "shadow-cyan-500/30" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* KPI Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpiCards.map((kpi, i) => (
          <Card key={i} className="overflow-hidden bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-[#CBD5E1]">
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

      <div className="flex justify-end">
        <Button
          onClick={() => router.push('/sales/pipeline')}
          className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-[10px]"
        >
          View Board
        </Button>
      </div>

      {/* WhatsApp Activity Feed */}
      <Card className="bg-white border-[#E8ECF0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[16px]">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
            <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">WhatsApp Activity</h2>
          </div>
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)}>
            <TabsList className="bg-[#F8FAFC] border border-gray-200 p-1 rounded-[10px] h-10">
              <TabsTrigger value="ALL" className="rounded-[8px] px-4 text-[12px] font-bold">ALL</TabsTrigger>
              <TabsTrigger value="SENT" className="rounded-[8px] px-4 text-[12px] font-bold">SENT</TabsTrigger>
              <TabsTrigger value="DELIVERED" className="rounded-[8px] px-4 text-[12px] font-bold">DELIVERED</TabsTrigger>
              <TabsTrigger value="READ" className="rounded-[8px] px-4 text-[12px] font-bold">READ</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              No WhatsApp messages found.
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const statusColor = 
                msg.status === 'READ' ? 'bg-blue-100 text-blue-700' :
                msg.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                'bg-gray-100 text-gray-700';
              
              return (
                <div key={msg.id} className="p-4 hover:bg-[#F0F4F8]/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0">
                      <MessageCircle className="h-4 w-4 text-[#10B981]" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-[13px] font-medium text-[#0F172A]">
                        To: {msg.to_phone}
                      </p>
                      <p className="text-[13px] text-gray-600 break-words">{msg.message_text}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-[11px] text-gray-400">
                          {new Date(msg.created_at).toLocaleString()}
                        </p>
                        <Badge className={`${statusColor} text-[10px] font-bold uppercase border-none`}>
                          {msg.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-3 border-t border-gray-100 bg-[#F8FAFC]">
          <button
            className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold rounded-[10px] py-2 text-sm transition-colors"
            onClick={() => window.open('https://web.whatsapp.com', '_blank')}
          >
            Open Web WhatsApp
          </button>
        </div>
      </Card>
    </div>
  );
}
