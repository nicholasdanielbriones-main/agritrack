import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Harvest, Crop } from "@/types"

const harvestSchema = z.object({
  cropId: z.string().min(1, "Please select a crop"),
  quantity: z.coerce.number().positive("Quantity must be greater than 0"),
  unit: z.string().min(1, "Unit is required"),
  harvestDate: z.string().min(1, "Harvest date is required"),
  qualityGrade: z.enum(["A", "B", "C"]),
  notes: z.string().optional(),
})

type HarvestFormValues = z.infer<typeof harvestSchema>

type HarvestFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: HarvestFormValues) => void
  isSubmitting: boolean
  initialData?: Harvest | null
  crops: Crop[]
}

export function HarvestFormModal({ isOpen, onClose, onSubmit, isSubmitting, initialData, crops }: HarvestFormModalProps) {
  const form = useForm<HarvestFormValues>({
    resolver: zodResolver(harvestSchema),
    mode: "onTouched",
    defaultValues: initialData ? {
      cropId: initialData.cropId,
      quantity: initialData.quantity,
      unit: initialData.unit,
      harvestDate: initialData.harvestDate,
      qualityGrade: initialData.qualityGrade,
      notes: initialData.notes || "",
    } : {
      cropId: "",
      quantity: undefined,
      unit: "kg",
      harvestDate: new Date().toISOString().split('T')[0],
      qualityGrade: "A",
      notes: "",
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Harvest" : "New Harvest Record"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <Controller control={form.control} name="cropId" render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="cropId">Crop *</Label>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a crop" />
                </SelectTrigger>
                <SelectContent>
                  {crops.map((crop) => (
                    <SelectItem key={crop.id} value={crop.id}>
                      {crop.cropName} ({crop.variety})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.cropId && <p className="text-sm text-danger">{form.formState.errors.cropId.message}</p>}
            </div>
          )} />

          <div className="grid grid-cols-2 gap-4">
            <Controller control={form.control} name="quantity" render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input id="quantity" type="number" step="0.1" {...field} value={field.value === undefined ? "" : field.value} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                {form.formState.errors.quantity && <p className="text-sm text-danger">{form.formState.errors.quantity.message}</p>}
              </div>
            )} />
            <Controller control={form.control} name="unit" render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Input id="unit" placeholder="e.g. kg" {...field} />
                {form.formState.errors.unit && <p className="text-sm text-danger">{form.formState.errors.unit.message}</p>}
              </div>
            )} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller control={form.control} name="harvestDate" render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="harvestDate">Date *</Label>
                <Input id="harvestDate" type="date" {...field} />
                {form.formState.errors.harvestDate && <p className="text-sm text-danger">{form.formState.errors.harvestDate.message}</p>}
              </div>
            )} />
            <Controller control={form.control} name="qualityGrade" render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="qualityGrade">Grade *</Label>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Grade A</SelectItem>
                    <SelectItem value="B">Grade B</SelectItem>
                    <SelectItem value="C">Grade C</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.qualityGrade && <p className="text-sm text-danger">{form.formState.errors.qualityGrade.message}</p>}
              </div>
            )} />
          </div>

          <Controller control={form.control} name="notes" render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input id="notes" placeholder="e.g. Good yield" {...field} />
            </div>
          )} />

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100 mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save record"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}