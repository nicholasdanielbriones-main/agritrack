import { useState } from "react"
import { useCrops, useCreateCrop, useUpdateCrop, useDeleteCrop } from "@/hooks/useCrops"
import { useFarmers } from "@/hooks/useFarmers"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, AlertCircle, Pencil, Trash2 } from "lucide-react"
import { CropFormModal } from "@/components/crops/CropFormModal"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { Crop } from "@/types"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

export function Crops() {
  const { data: crops, isLoading, isError, error } = useCrops()
  const { data: farmers } = useFarmers() // Needed for the dropdown and table mapping
  const createMutation = useCreateCrop()
  const updateMutation = useUpdateCrop()
  const deleteMutation = useDeleteCrop()
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null)

  const handleOpenCreate = () => { setSelectedCrop(null); setIsFormOpen(true) }
  const handleOpenEdit = (crop: Crop) => { setSelectedCrop(crop); setIsFormOpen(true) }
  const handleOpenDelete = (crop: Crop) => { setSelectedCrop(crop); setIsDeleteOpen(true) }

  const handleFormSubmit = (data: any) => {
    if (selectedCrop) {
      updateMutation.mutate({ id: selectedCrop.id, data }, { onSuccess: () => setIsFormOpen(false) })
    } else {
      createMutation.mutate(data, { onSuccess: () => setIsFormOpen(false) })
    }
  }

  const handleDeleteConfirm = () => {
    if (selectedCrop) {
      deleteMutation.mutate(selectedCrop.id, { onSuccess: () => setIsDeleteOpen(false) })
    }
  }

  // Helper to get farmer name
  const getFarmerName = (farmerId: string) => farmers?.find(f => f.id === farmerId)?.name || "Unknown"

  if (isLoading) return <div className="p-8 text-center text-neutral-500">Loading crops...</div>
  if (isError) return <div className="p-4 bg-red-50 text-danger rounded-card">Error: {error.message}</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Crops</h1>
          <p className="text-sm text-neutral-500 mt-1">{crops?.length || 0} total crops</p>
        </div>
        <Button onClick={handleOpenCreate} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" /> New crop
        </Button>
      </div>

      <div className="bg-white rounded-card border border-neutral-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50 hover:bg-neutral-50">
              <TableHead className="font-semibold text-neutral-600">Crop</TableHead>
              <TableHead className="font-semibold text-neutral-600">Variety</TableHead>
              <TableHead className="font-semibold text-neutral-600">Farmer</TableHead>
              <TableHead className="font-semibold text-neutral-600">Planted</TableHead>
              <TableHead className="font-semibold text-neutral-600">Status</TableHead>
              <TableHead className="text-right font-semibold text-neutral-600">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {crops?.map((crop) => (
              <TableRow key={crop.id}>
                <TableCell className="font-medium text-neutral-900">{crop.cropName}</TableCell>
                <TableCell className="text-neutral-600">{crop.variety}</TableCell>
                <TableCell className="text-neutral-600">{getFarmerName(crop.farmerId)}</TableCell>
                <TableCell className="text-neutral-600 font-mono text-sm">{crop.plantingDate}</TableCell>
                <TableCell>
                  <Badge variant={crop.status === 'Growing' ? 'default' : crop.status === 'Harvested' ? 'secondary' : 'outline'} 
                         className={crop.status === 'Growing' ? 'bg-success hover:bg-success/90' : ''}>
                    {crop.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(crop)}>
                      <Pencil className="h-4 w-4 text-neutral-500 hover:text-primary-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(crop)}>
                      <Trash2 className="h-4 w-4 text-neutral-500 hover:text-danger" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {crops?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-neutral-500">No crops found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CropFormModal 
        key={selectedCrop?.id || 'new'}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        initialData={selectedCrop}
        farmers={farmers || []}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete crop?"
        description={`This will permanently remove ${selectedCrop?.cropName}.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}