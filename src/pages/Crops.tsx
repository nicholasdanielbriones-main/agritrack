import { useState } from "react"
import { useCrops, useCreateCrop, useUpdateCrop, useDeleteCrop } from "@/hooks/useCrops"
import { useFarmers } from "@/hooks/useFarmers"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, AlertCircle, Pencil, Trash2 } from "lucide-react"
import { CropFormModal } from "@/components/crops/CropFormModal"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { Crop } from "@/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function Crops() {
  const { data: crops, isLoading, isError, error } = useCrops()
  const { data: farmers } = useFarmers()
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
    if (selectedCrop) deleteMutation.mutate(selectedCrop.id, { onSuccess: () => setIsDeleteOpen(false) })
  }

  const getFarmerName = (farmerId: string) => farmers?.find(f => f.id === farmerId)?.name || "Unknown"

  if (isLoading) return <div className="p-8 text-center text-neutral-500 animate-pulse">Loading crops...</div>
  if (isError) return <div className="p-4 bg-red-50 text-danger rounded-xl border border-red-200 flex items-center gap-3"><AlertCircle className="h-5 w-5" /> Error: {error.message}</div>

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Crops</h1>
          <p className="text-sm text-neutral-500 mt-1">{crops?.length || 0} total crops</p>
        </div>
        <Button onClick={handleOpenCreate} className="w-full sm:w-auto h-10 shadow-sm active:scale-95 transition-all">
          <Plus className="h-4 w-4 mr-2" /> New crop
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-50/50 text-neutral-500 text-xs uppercase tracking-wider border-b border-neutral-100">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-medium px-5 py-3">Crop</TableHead>
              <TableHead className="font-medium px-5 py-3">Variety</TableHead>
              <TableHead className="font-medium px-5 py-3">Farmer</TableHead>
              <TableHead className="font-medium px-5 py-3">Planted</TableHead>
              <TableHead className="font-medium px-5 py-3">Status</TableHead>
              <TableHead className="text-right font-medium px-5 py-3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-neutral-100">
            {crops?.map((crop) => (
              <TableRow key={crop.id} className="hover:bg-neutral-50/50 transition-colors">
                <TableCell className="font-medium text-neutral-900 px-5 py-4">{crop.cropName}</TableCell>
                <TableCell className="text-neutral-600 px-5 py-4">{crop.variety}</TableCell>
                <TableCell className="text-neutral-600 px-5 py-4">{getFarmerName(crop.farmerId)}</TableCell>
                <TableCell className="text-neutral-500 px-5 py-4">{crop.plantingDate}</TableCell>
                <TableCell className="px-5 py-4">
                  <Badge variant="outline" className={`px-2 py-0.5 rounded text-xs font-medium border-0 ${
                    crop.status === 'Growing' ? 'bg-primary-100 text-primary-700' : 
                    crop.status === 'Harvested' ? 'bg-neutral-100 text-neutral-700' : 
                    'bg-info/10 text-info'
                  }`}>
                    {crop.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(crop)} className="h-8 w-8 text-neutral-400 hover:text-primary-600">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(crop)} className="h-8 w-8 text-neutral-400 hover:text-danger hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {crops?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-neutral-500">No crops found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CropFormModal key={selectedCrop?.id || 'new'} isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} isSubmitting={createMutation.isPending || updateMutation.isPending} initialData={selectedCrop} farmers={farmers || []} />
      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDeleteConfirm} title="Delete crop?" description={`This will permanently remove ${selectedCrop?.cropName}.`} isLoading={deleteMutation.isPending} />
    </div>
  )
}