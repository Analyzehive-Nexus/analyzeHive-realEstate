'use client';

import { useEffect, useState } from 'react';
import { getLeadsForPipeline, updateLeadStatus } from './actions';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Loader2, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { EmptyState } from "@/components/ui/empty-state";

// Define lead type
type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  source: string;
  status: string;
  assigned_user_id: string | null;
  created_at: string;
};

// Define column configuration
const columns = {
  New: { status: 'New', color: 'border-blue-500' },
  Contacted: { status: 'Contacted', color: 'border-yellow-500' },
  'Site Visit': { status: 'Site Visit Scheduled', color: 'border-purple-500' },
  Negotiation: { status: 'Negotiation', color: 'border-orange-500' },
  Converted: { status: 'Converted', color: 'border-green-500' },
};

// Sortable lead card component
function SortableLead({ lead }: { lead: Lead }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow mb-3"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm">{lead.name}</h4>
          <p className="text-xs text-gray-500 mt-1">{lead.phone}</p>
          {lead.email && <p className="text-xs text-gray-400 truncate">{lead.email}</p>}
        </div>
        <GripVertical className="w-4 h-4 text-gray-400 shrink-0" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Badge variant="outline" className="text-[10px] font-bold uppercase">
          {lead.source || 'Direct'}
        </Badge>
        <span className="text-[10px] text-gray-400">
          {new Date(lead.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

export default function PipelinePage() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Group leads by column
  const groupedLeads = {
    New: leads.filter(l => l.status === 'New'),
    Contacted: leads.filter(l => l.status === 'Contacted'),
    'Site Visit': leads.filter(l => l.status === 'Site Visit Scheduled'),
    Negotiation: leads.filter(l => l.status === 'Negotiation'),
    Converted: leads.filter(l => l.status === 'Converted'),
  };

  // Drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }, // prevents accidental drag when clicking
    })
  );

  const fetchLeads = async () => {
    setLoading(true);
    const data = await getLeadsForPipeline();
    setLeads(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();

    // Poll for changes since we removed client-side Supabase anon RLS logic
    const interval = setInterval(() => {
      getLeadsForPipeline().then(data => setLeads(data || []));
    }, 15000); // Poll every 15s

    return () => clearInterval(interval);
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    const leadId = active.id as string;
    const targetColumnId = over.id as keyof typeof columns;

    // Get the lead being moved
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const newStatus = columns[targetColumnId]?.status;
    if (!newStatus || lead.status === newStatus) return; // no change

    // Optimistic UI update – move lead instantly
    const updatedLeads = leads.map(l =>
      l.id === leadId ? { ...l, status: newStatus } : l
    );
    setLeads(updatedLeads);

    // Update via Server Action
    const result = await updateLeadStatus(leadId, newStatus);

    if (result.error) {
      // Rollback on error
      setLeads(leads);
      toast({
        title: 'Update failed',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Lead moved',
        description: `${lead.name} moved to ${targetColumnId}`,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F172A]">Sales Pipeline</h1>
        <p className="text-gray-500 text-sm mt-1">Drag and drop leads to update their status</p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {Object.entries(columns).map(([columnName, config]) => (
            <div
              key={columnName}
              className="min-w-[300px] max-w-[300px] bg-[#F8FAFC] rounded-xl flex flex-col h-full border-t-4 shadow-sm"
              style={{ borderTopColor: config.color.split('-')[1] }}
            >
              <CardHeader className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    {columnName}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {groupedLeads[columnName as keyof typeof groupedLeads].length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-3 flex-1 overflow-y-auto min-h-[500px]">
                <SortableContext
                  items={groupedLeads[columnName as keyof typeof groupedLeads].map(l => l.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {groupedLeads[columnName as keyof typeof groupedLeads].length === 0 ? (
                    <div className="text-center text-gray-400 text-sm py-8">No leads</div>
                  ) : (
                    groupedLeads[columnName as keyof typeof groupedLeads].map(lead => (
                      <SortableLead key={lead.id} lead={lead} />
                    ))
                  )}
                </SortableContext>
              </CardContent>
            </div>
          ))}
        </div>
        <DragOverlay>
          {activeId ? (
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-300 w-[280px]">
              {(() => {
                const lead = leads.find(l => l.id === activeId);
                return lead ? (
                  <>
                    <h4 className="font-semibold text-gray-900 text-sm">{lead.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{lead.phone}</p>
                  </>
                ) : null;
              })()}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
