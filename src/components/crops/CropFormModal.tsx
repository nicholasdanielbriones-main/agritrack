import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Crop, Farmer } from "@/types"

const cropSchema = z.object({
  cropName: z.string().min(2, "Crop name is required"),
  variety: z.string().min(2, "Variety is required"),
  plantingDate: z.string().min(1, "Planting date is required"),
  harvestDate: z.string().min(1, "Harvest date is required"),
  status: z.enum(["Growing", "Harvested", "Planned"]),
  farmerId: z.string().min(1, "Please select a farmer"),
})

type CropFormValues = z.infer<typeof cropSchema>

type CropFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CropFormValues) => void
  isSubmitting: boolean
  initialData?: Crop | null
  farmers: Farmer[]
}

export function CropFormModal({ isOpen, onClose, onSubmit, isSubmitting, initialData, farmers }: CropFormModalProps) {
  const form = useForm<CropFormValues>({
    resolver: zodResolver(cropSchema),
    mode: "onTouched",
    defaultValues: initialData ? {
      cropName: initialData.cropName,
      variety: initialData.variety,
      plantingDate: initialData.plantingDate,
      harvestDate: initialData.harvestDate,
      status: initialData.status,
      farmerId: initialData.farmerId,
    } : {
      cropName: "",
      variety: "",
      plantingDate: "",
      harvestDate: "",
      status: "Planned",
      farmerId: "",
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Crop" : "New Crop"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <Controller control={form.control} name="cropName" render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="cropName">Crop Name *</Label>
              <Input id="cropName" placeholder="e.g. Rice" {...field} />
              {form.formState.errors.cropName && <p className="text-sm text-danger">{form.formState.errors.cropName.message}</p>}
            </div>
          )} />

          <Controller control={form.control} name="variety" render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="variety">Variety *</Label>
              <Input id="variety" placeholder="e.g. NSIC Rc222" {...field} />
              {form.formState.errors.variety && <p className="text-sm text-danger">{form.formState.errors.variety.message}</p>}
            </div>
          )} />

          <div className="grid grid-cols-2 gap-4">
            <Controller control={form.control} name="plantingDate" render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="plantingDate">Planting Date *</Label>
                <Input id="plantingDate" type="date" {...field} />
                {form.formState.errors.plantingDate && <p className="text-sm text-danger">{form.formState.errors.plantingDate.message}</p>}
              </div>
            )} />

            <Controller control={form.control} name="harvestDate" render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="harvestDate">Harvest Date *</Label>
                <Input id="harvestDate" type="date" {...field} />
                {form.formState.errors.harvestDate && <p className="text-sm text-danger">{form.formState.errors.harvestDate.message}</p>}
              </div>
            )} />
          </div>

          <Controller control={form.control} name="farmerId" render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="farmerId">Farmer *</Label>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a farmer" />
                </SelectTrigger>
                <SelectContent>
                  {farmers.map((farmer) => (
                    <SelectItem key={farmer.id} value={farmer.id}>{farmer.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.farmerId && <p className="text-sm text-danger">{form.formState.errors.farmerId.message}</p>}
            </div>
          )} />

          <Controller control={form.control} name="status" render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Growing">Growing</SelectItem>
                  <SelectItem value="Harvested">Harvested</SelectItem>
                  <SelectItem value="Planned">Planned</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.status && <p className="text-sm text-danger">{form.formState.errors.status.message}</p>}
            </div>
          )} />

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100 mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save crop"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}