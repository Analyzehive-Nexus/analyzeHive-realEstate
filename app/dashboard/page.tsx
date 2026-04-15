export const dynamic = 'force-dynamic';

import {
  getFinancialStats,
  getLeadsStats,
  getFlatsStats,
  getProjectsStats,
  getProjects,
  getBrokers
} from '@/lib/data';

import DashboardClient from './client';

export default async function DashboardPage() {
  const [
    finStats,
    leadsStats,
    flatsStats,
    projStats,
    projectsDb,
    brokers
  ] = await Promise.all([
    getFinancialStats(),
    getLeadsStats(),
    getFlatsStats(),
    getProjectsStats(),
    getProjects(),
    getBrokers()
  ]);

  return <DashboardClient 
    finStats={finStats} 
    leadsStats={leadsStats} 
    flatsStats={flatsStats} 
    projStats={projStats} 
    projectsDb={projectsDb} 
    brokers={brokers} 
  />
}
