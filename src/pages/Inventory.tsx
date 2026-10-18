import { useState } from "react"
import { useInventory, useCreateInventory, useUpdateInventory, useDeleteInventory } from "@/hooks/useInventory"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, AlertCircle, Pencil, Trash2, AlertTriangle } from "lucide-react"
import { InventoryFormModal } from "@/components/inventory/InventoryFormModal"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { Inventory as InventoryType } from "@/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function Inventory() {
  const { data: items, isLoading, isError, error } = useInventory()
  const createMutation = useCreateInventory()
  const updateMutation = useUpdateInventory()
  const deleteMutation = useDeleteInventory()
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryType | null>(null)

  const handleOpenCreate = () => { setSelectedItem(null); setIsFormOpen(true) }
  const handleOpenEdit = (item: InventoryType) => { setSelectedItem(item); setIsFormOpen(true) }
  const handleOpenDelete = (item: InventoryType) => { setSelectedItem(item); setIsDeleteOpen(true) }

  const handleFormSubmit = (data: any) => {
    if (selectedItem) {
      updateMutation.mutate({ id: selectedItem.id, data }, { onSuccess: () => setIsFormOpen(false) })
    } else {
      createMutation.mutate(data, { onSuccess: () => setIsFormOpen(false) })
    }
  }

  const handleDeleteConfirm = () => {
    if (selectedItem) deleteMutation.mutate(selectedItem.id, { onSuccess: () => setIsDeleteOpen(false) })
  }

  if (isLoading) return <div className="p-8 text-center text-neutral-500 animate-pulse">Loading inventory...</div>
  if (isError) return <div className="p-4 bg-red-50 text-danger rounded-xl border border-red-200 flex items-center gap-3"><AlertCircle className="h-5 w-5" /> Error: {error.message}</div>

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Inventory</h1>
          <p className="text-sm text-neutral-500 mt-1">{items?.length || 0} total items</p>
        </div>
        <Button onClick={handleOpenCreate} className="w-full sm:w-auto h-10 shadow-sm active:scale-95 transition-all">
          <Plus className="h-4 w-4 mr-2" /> New supply
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-50/50 text-neutral-500 text-xs uppercase tracking-wider border-b border-neutral-100">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-medium px-5 py-3">Item</TableHead>
              <TableHead className="font-medium px-5 py-3">Category</TableHead>
              <TableHead className="font-medium px-5 py-3">Qty</TableHead>
              <TableHead className="font-medium px-5 py-3">Reorder</TableHead>
              <TableHead className="font-medium px-5 py-3">Status</TableHead>
              <TableHead className="text-right font-medium px-5 py-3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-neutral-100">
            {items?.map((item) => {
              const isLowStock = item.quantity <= item.reorderLevel;
              return (
                <TableRow key={item.id} className={`hover:bg-neutral-50/50 transition-colors ${isLowStock ? "bg-red-50/10" : ""}`}>
                  <TableCell className="font-medium text-neutral-900 px-5 py-4">{item.itemName}</TableCell>
                  <TableCell className="text-neutral-600 px-5 py-4">{item.category}</TableCell>
                  <TableCell className="text-neutral-900 px-5 py-4">{item.quantity} {item.unit}</TableCell>
                  <TableCell className="text-neutral-500 px-5 py-4">{item.reorderLevel}</TableCell>
                  <TableCell className="px-5 py-4">
                    {isLowStock ? (
                      <Badge variant="outline" className="bg-danger/10 text-danger border-0 flex items-center gap-1 w-fit px-2 py-0.5 rounded text-xs font-medium">
                        <AlertTriangle className="h-3 w-3" /> Low
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-primary-50 text-primary-700 border-0 px-2 py-0.5 rounded text-xs font-medium">OK</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(item)} className="h-8 w-8 text-neutral-400 hover:text-primary-600">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(item)} className="h-8 w-8 text-neutral-400 hover:text-danger hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            {items?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-neutral-500">No inventory items found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <InventoryFormModal key={selectedItem?.id || 'new'} isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} isSubmitting={createMutation.isPending || updateMutation.isPending} initialData={selectedItem} />
      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDeleteConfirm} title="Delete item?" description={`This will permanently remove ${selectedItem?.itemName}.`} isLoading={deleteMutation.isPending} />
    </div>
  )
}