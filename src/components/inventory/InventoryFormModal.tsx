import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Inventory } from "@/types"

const inventorySchema = z.object({
  itemName: z.string().min(2, "Item name is required"),
  category: z.string().min(2, "Category is required"),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  unit: z.string().min(1, "Unit is required"),
  supplier: z.string().min(2, "Supplier is required"),
  reorderLevel: z.coerce.number().min(0, "Reorder level cannot be negative"),
})

type InventoryFormValues = z.infer<typeof inventorySchema>

type InventoryFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: InventoryFormValues) => void
  isSubmitting: boolean
  initialData?: Inventory | null
}

export function InventoryFormModal({ isOpen, onClose, onSubmit, isSubmitting, initialData }: InventoryFormModalProps) {
  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    mode: "onTouched",
    defaultValues: initialData ? {
      itemName: initialData.itemName,
      category: initialData.category,
      quantity: initialData.quantity,
      unit: initialData.unit,
      supplier: initialData.supplier,
      reorderLevel: initialData.reorderLevel,
    } : {
      itemName: "",
      category: "",
      quantity: undefined,
      unit: "kg",
      supplier: "",
      reorderLevel: undefined,
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Inventory Item" : "New Inventory Item"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <Controller control={form.control} name="itemName" render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name *</Label>
              <Input id="itemName" placeholder="e.g. Urea Fertilizer" {...field} />
              {form.formState.errors.itemName && <p className="text-sm text-danger">{form.formState.errors.itemName.message}</p>}
            </div>
          )} />

          <div className="grid grid-cols-2 gap-4">
            <Controller control={form.control} name="category" render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input id="category" placeholder="e.g. Fertilizer" {...field} />
                {form.formState.errors.category && <p className="text-sm text-danger">{form.formState.errors.category.message}</p>}
              </div>
            )} />
            <Controller control={form.control} name="supplier" render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier *</Label>
                <Input id="supplier" placeholder="e.g. AgroSupply" {...field} />
                {form.formState.errors.supplier && <p className="text-sm text-danger">{form.formState.errors.supplier.message}</p>}
              </div>
            )} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller control={form.control} name="quantity" render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input id="quantity" type="number" {...field} value={field.value === undefined ? "" : field.value} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                {form.formState.errors.quantity && <p className="text-sm text-danger">{form.formState.errors.quantity.message}</p>}
              </div>
            )} />
            <Controller control={form.control} name="unit" render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Input id="unit" placeholder="e.g. kg, pcs, L" {...field} />
                {form.formState.errors.unit && <p className="text-sm text-danger">{form.formState.errors.unit.message}</p>}
              </div>
            )} />
          </div>

          <Controller control={form.control} name="reorderLevel" render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="reorderLevel">Reorder Level *</Label>
              <Input id="reorderLevel" type="number" {...field} value={field.value === undefined ? "" : field.value} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
              <p className="text-xs text-neutral-500">Alert me when quantity drops below this number.</p>
              {form.formState.errors.reorderLevel && <p className="text-sm text-danger">{form.formState.errors.reorderLevel.message}</p>}
            </div>
          )} />

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100 mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save item"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}