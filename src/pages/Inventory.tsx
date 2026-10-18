import { useState } from "react"
import { useInventory, useCreateInventory, useUpdateInventory, useDeleteInventory } from "@/hooks/useInventory"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, AlertCircle, Pencil, Trash2, AlertTriangle } from "lucide-react"
import { InventoryFormModal } from "@/components/inventory/InventoryFormModal"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { Inventory as InventoryType } from "@/types"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

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
    if (selectedItem) {
      deleteMutation.mutate(selectedItem.id, { onSuccess: () => setIsDeleteOpen(false) })
    }
  }

  if (isLoading) return <div className="p-8 text-center text-neutral-500">Loading inventory...</div>
  if (isError) return <div className="p-4 bg-red-50 text-danger rounded-card">Error: {error.message}</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Inventory</h1>
          <p className="text-sm text-neutral-500 mt-1">{items?.length || 0} total items</p>
        </div>
        <Button onClick={handleOpenCreate} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" /> New supply
        </Button>
      </div>

      <div className="bg-white rounded-card border border-neutral-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50 hover:bg-neutral-50">
              <TableHead className="font-semibold text-neutral-600">Item</TableHead>
              <TableHead className="font-semibold text-neutral-600">Category</TableHead>
              <TableHead className="font-semibold text-neutral-600">Qty</TableHead>
              <TableHead className="font-semibold text-neutral-600">Reorder</TableHead>
              <TableHead className="font-semibold text-neutral-600">Status</TableHead>
              <TableHead className="text-right font-semibold text-neutral-600">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => {
              const isLowStock = item.quantity <= item.reorderLevel;
              return (
                <TableRow key={item.id} className={isLowStock ? "bg-red-50/30" : ""}>
                  <TableCell className="font-medium text-neutral-900">{item.itemName}</TableCell>
                  <TableCell className="text-neutral-600">{item.category}</TableCell>
                  <TableCell className="font-mono text-sm text-neutral-900">{item.quantity} {item.unit}</TableCell>
                  <TableCell className="font-mono text-sm text-neutral-500">{item.reorderLevel}</TableCell>
                  <TableCell>
                    {isLowStock ? (
                      <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                        <AlertTriangle className="h-3 w-3" /> Low
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-success border-success/30 bg-success/10">OK</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(item)}>
                        <Pencil className="h-4 w-4 text-neutral-500 hover:text-primary-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(item)}>
                        <Trash2 className="h-4 w-4 text-neutral-500 hover:text-danger" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            {items?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-neutral-500">No inventory items found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <InventoryFormModal 
        key={selectedItem?.id || 'new'}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        initialData={selectedItem}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete item?"
        description={`This will permanently remove ${selectedItem?.itemName}.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}