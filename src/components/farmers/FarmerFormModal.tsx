import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// 1. Define the Zod Schema (Validation rules)
const farmerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  contact: z.string().min(7, "Contact must be at least 7 digits"),
  location: z.string().min(2, "Location is required"),
  farmSize: z.coerce.number().positive("Farm size must be greater than 0"),
})

// Infer the TypeScript type from the schema
type FarmerFormValues = z.infer<typeof farmerSchema>

type FarmerFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: FarmerFormValues) => void
  isSubmitting: boolean
}

export function FarmerFormModal({ isOpen, onClose, onSubmit, isSubmitting }: FarmerFormModalProps) {
  // 2. Setup React Hook Form
  const form = useForm<FarmerFormValues>({
    resolver: zodResolver(farmerSchema),
    defaultValues: {
      name: "",
      contact: "",
      location: "",
      farmSize: 0,
    },
  })

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) form.reset()
  }, [isOpen, form])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Farmer</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" {...form.register("name")} placeholder="e.g. Juan Cruz" />
            {form.formState.errors.name && (
              <p className="text-sm text-danger">{form.formState.errors.name.message}</p>
            )}
          </div>

          {/* Contact Field */}
          <div className="space-y-2">
            <Label htmlFor="contact">Contact Number *</Label>
            <Input id="contact" {...form.register("contact")} placeholder="09171234567" />
            {form.formState.errors.contact && (
              <p className="text-sm text-danger">{form.formState.errors.contact.message}</p>
            )}
          </div>

          {/* Location Field */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input id="location" {...form.register("location")} placeholder="e.g. Ampayon" />
            {form.formState.errors.location && (
              <p className="text-sm text-danger">{form.formState.errors.location.message}</p>
            )}
          </div>

          {/* Farm Size Field */}
          <div className="space-y-2">
            <Label htmlFor="farmSize">Farm Size (hectares) *</Label>
            <Input id="farmSize" type="number" step="0.1" {...form.register("farmSize")} placeholder="e.g. 2.5" />
            {form.formState.errors.farmSize && (
              <p className="text-sm text-danger">{form.formState.errors.farmSize.message}</p>
            )}
          </div>

          {/* Actions */}
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