"use client";
import { ResponsiveTable } from "@/components/ui/responsive-table";


import { useState } from "react";
import { format } from "date-fns";
import { AlertCircle, Plus, RefreshCw, PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { addStockItem, restockItem } from "./actions";
import { EmptyState } from "@/components/ui/empty-state";

type StockItem = {
  item_id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  last_updated: string;
};

export default function StockClient({ items }: { items: StockItem[] }) {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [restockItemId, setRestockItemId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  async function handleAddStock(formData: FormData) {
    setIsLoading(true);
    const result = await addStockItem(formData);
    setIsLoading(false);

    if (result?.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Stock item added successfully" });
      setIsAddOpen(false);
    }
  }

  async function handleRestock(formData: FormData) {
    setIsLoading(true);
    const result = await restockItem(formData);
    setIsLoading(false);

    if (result?.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Stock updated successfully" });
      setRestockItemId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Stock Inventory</h1>
          <p className="text-slate-500 mt-1">Manage construction materials and view stock levels.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Stock Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Material</DialogTitle>
            </DialogHeader>
            <form action={handleAddStock} className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Item Name</Label>
                <Input id="name" name="name" placeholder="e.g. UltraTech Cement" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" required defaultValue="Cement">
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cement">Cement</SelectItem>
                    <SelectItem value="Steel">Steel</SelectItem>
                    <SelectItem value="Bricks">Bricks</SelectItem>
                    <SelectItem value="Sand">Sand</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Initial Quantity</Label>
                  <Input id="quantity" name="quantity" type="number" step="0.01" min="0" defaultValue="0" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input id="unit" name="unit" placeholder="Bags, Tons, etc." required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Item'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <ResponsiveTable>
<Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-950">
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                  No stock items found.
                </TableCell>
              </TableRow>
            ) : items.map((item) => {
              const needsRestock = item.quantity < 20;
              return (
                <TableRow key={item.item_id} className={needsRestock ? "bg-yellow-50/50 dark:bg-yellow-900/10" : ""}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {item.name}
                      {needsRestock && (
                        <span title="Low Stock Warning" className="inline-flex">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-white dark:bg-transparent">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span className={needsRestock ? "text-orange-600 dark:text-orange-400" : ""}>
                      {item.quantity} {item.unit}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {format(new Date(item.last_updated), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog open={restockItemId === item.item_id} onOpenChange={(open) => setRestockItemId(open ? item.item_id : null)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          <PackagePlus className="h-4 w-4 mr-1" /> Restock
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Restock Item</DialogTitle>
                        </DialogHeader>
                        <form action={handleRestock} className="space-y-4 pt-4">
                          <input type="hidden" name="item_id" value={item.item_id} />
                          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded grid grid-cols-1 md:grid-cols-2 text-sm gap-2">
                            <div className="text-slate-500">Item Name:</div>
                            <div className="font-medium text-right">{item.name}</div>
                            <div className="text-slate-500">Current Stock:</div>
                            <div className="font-medium text-right">{item.quantity} {item.unit}</div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="quantity">Quantity to Add</Label>
                            <Input id="add-quantity" name="quantity" type="number" step="0.01" min="0.01" placeholder="0" required />
                          </div>
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setRestockItemId(null)}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>{isLoading ? 'Updating...' : 'Confirm Restock'}</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
</ResponsiveTable>
      </div>
    </div>
  );
}
