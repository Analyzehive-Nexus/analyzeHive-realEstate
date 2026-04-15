export const dynamic = 'force-dynamic';

import {
  getInventoryItems,
  getInventoryStats,
  getMaterialDemands,
  getAssets,
  getAssetsStats,
  getLabourAttendance,
  getAttendanceStats,
  getDailyProgress,
  getVendors
} from '@/lib/data';

import ConstructionClient from './client';

export default async function ConstructionPage() {
  const [
    inventoryItems,
    inventoryStats,
    demands,
    assets,
    assetsStats,
    attendance,
    attendanceStats,
    progress,
    vendors
  ] = await Promise.all([
    getInventoryItems(),
    getInventoryStats(),
    getMaterialDemands(),
    getAssets(),
    getAssetsStats(),
    getLabourAttendance(),
    getAttendanceStats(),
    getDailyProgress(),
    getVendors()
  ]);

  return <ConstructionClient 
    inventoryItems={inventoryItems} 
    inventoryStats={inventoryStats} 
    demands={demands} 
    assets={assets} 
    assetsStats={assetsStats} 
    attendance={attendance} 
    attendanceStats={attendanceStats} 
    progress={progress} 
    vendors={vendors} 
  />
}
