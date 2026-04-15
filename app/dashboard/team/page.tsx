export const dynamic = 'force-dynamic';

import { getBrokers, getLeads, getDailyProgress } from "@/lib/data"
import TeamClient from './client';

const formatCr = (val: number) => `₹${(val / 10000000).toFixed(1)}Cr`;

export default async function TeamPerformancePage() {
  const [brokersData, leadsData, progressData] = await Promise.all([
    getBrokers(),
    getLeads(),
    getDailyProgress()
  ]);

  // Aggregate Sales Team Data
  const brokerStats: Record<string, any> = {};
  brokersData?.forEach((b: any) => {
    brokerStats[b.id] = {
      name: b.name,
      role: b.role,
      conv: 0,
      rev: 0,
      leads: 0,
      avatarColor: "bg-blue-100 text-blue-700"
    };
  });

  leadsData?.forEach((l: any) => {
    if (l.assigned_user_id && brokerStats[l.assigned_user_id]) {
       brokerStats[l.assigned_user_id].leads += 1;
       if (l.status === 'Converted') {
         brokerStats[l.assigned_user_id].conv += 1;
         // Assume each conversion brings ~1.2Cr revenue
         brokerStats[l.assigned_user_id].rev += 12000000;
       }
    }
  });

  const salesTeam = Object.values(brokerStats).map((b: any, i: number) => ({
    ...b,
    metrics: { rev: formatCr(b.rev), conv: b.conv },
    ach: b.conv >= 5 ? "120%" : b.conv >= 3 ? "100%" : "80%",
    trend: [{v: Math.random()*5},{v: Math.random()*5+2},{v: Math.random()*5+4},{v: b.conv}],
    rank: 0,
    avatarColor: ['bg-blue-100 text-blue-700', 'bg-emerald-100 text-emerald-700', 'bg-purple-100 text-purple-700', 'bg-amber-100 text-amber-700'][i % 4]
  })).sort((a,b) => b.conv - a.conv).map((b, i) => ({...b, rank: i + 1}));

  // Aggregate Construction Team Data
  const constStats: Record<string, any> = {};
  progressData?.forEach((p: any) => {
    if (p.submitted_by_user) {
      const uid = p.submitted_by_user.id;
      if (!constStats[uid]) {
        constStats[uid] = {
          name: p.submitted_by_user.name,
          role: "Site Manager",
          tasks: 0,
          sumPct: 0
        };
      }
      constStats[uid].tasks += 1;
      constStats[uid].sumPct += p.completion_pct || 0;
    }
  });

  const constTeam = Object.values(constStats).map((c: any, i: number) => {
    const avgPct = c.tasks > 0 ? c.sumPct / c.tasks : 0;
    return {
      ...c,
      metrics: { tasks: c.tasks, onTime: `${Math.round(avgPct)}%` },
      ach: avgPct > 90 ? "Excellent" : avgPct > 70 ? "Good" : "Needs Imp.",
      trend: [{v: Math.random()*10},{v: Math.random()*15},{v: Math.random()*20},{v: c.tasks}],
      rank: 0,
      avatarColor: ['bg-orange-100 text-orange-700', 'bg-teal-100 text-teal-700', 'bg-indigo-100 text-indigo-700'][i % 3]
    };
  }).sort((a,b) => b.tasks - a.tasks).map((c, i) => ({...c, rank: i + 1}));

  return <TeamClient salesTeam={salesTeam} constTeam={constTeam} />
}
