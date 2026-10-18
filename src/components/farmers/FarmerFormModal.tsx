import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Farmer } from "@/types"

const farmerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  contact: z.string().min(7, "Contact must be at least 7 digits"),
  location: z.string().min(2, "Location is required"),
  farmSize: z.coerce.number().positive("Farm size must be greater than 0"),
})

type FarmerFormValues = z.infer<typeof farmerSchema>

type FarmerFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: FarmerFormValues) => void
  isSubmitting: boolean
  initialData?: Farmer | null
}

export function FarmerFormModal({ isOpen, onClose, onSubmit, isSubmitting, initialData }: FarmerFormModalProps) {
  const form = useForm<FarmerFormValues>({
    resolver: zodResolver(farmerSchema),
    mode: "onTouched", // Shows error when you click away, clears when you type
    defaultValues: initialData ? {
      name: initialData.name,
      contact: initialData.contact,
      location: initialData.location,
      farmSize: Number(initialData.farmSize) || 0,
    } : {
      name: "",
      contact: "",
      location: "",
      farmSize: undefined,
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Farmer" : "New Farmer"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          
          {/* NAME FIELD */}
          <Controller
            control={form.control}
            name="name"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" placeholder="e.g. Juan Cruz" {...field} />
                {form.formState.errors.name && (
                  <p className="text-sm text-danger">{form.formState.errors.name.message}</p>
                )}
              </div>
            )}
          />

          {/* CONTACT FIELD */}
          <Controller
            control={form.control}
            name="contact"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number *</Label>
                <Input id="contact" placeholder="09171234567" {...field} />
                {form.formState.errors.contact && (
                  <p className="text-sm text-danger">{form.formState.errors.contact.message}</p>
                )}
              </div>
            )}
          />

          {/* LOCATION FIELD */}
          <Controller
            control={form.control}
            name="location"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input id="location" placeholder="e.g. Ampayon" {...field} />
                {form.formState.errors.location && (
                  <p className="text-sm text-danger">{form.formState.errors.location.message}</p>
                )}
              </div>
            )}
          />

          {/* FARM SIZE FIELD */}
          <Controller
            control={form.control}
            name="farmSize"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="farmSize">Farm Size (hectares) *</Label>
                <Input 
                  id="farmSize" 
                  type="number" 
                  step="0.1" 
                  placeholder="e.g. 2.5" 
                  {...field}
                  value={field.value === undefined ? "" : field.value}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                />
                {form.formState.errors.farmSize && (
                  <p className="text-sm text-danger">{form.formState.errors.farmSize.message}</p>
                )}
              </div>
            )}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100 mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save farmer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}