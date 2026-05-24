"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AssetUsageChartProps {
  data: any[];
}

export function AssetUsageChart({ data }: AssetUsageChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF0"/>
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748B'}} />
        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748B'}} />
        <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '8px', border: '1px solid #E8ECF0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}/>
        <Bar dataKey="hours" name="Hours" fill="#0066FF" radius={[4, 4, 0, 0]} barSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}
