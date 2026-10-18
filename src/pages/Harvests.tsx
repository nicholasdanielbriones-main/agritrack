import { useState } from "react"
import { useHarvests, useCreateHarvest, useUpdateHarvest, useDeleteHarvest } from "@/hooks/useHarvests"
import { useCrops } from "@/hooks/useCrops"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { HarvestFormModal } from "@/components/harvests/HarvestFormModal"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { Harvest } from "@/types"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

export function Harvests() {
  const { data: harvests, isLoading, isError, error } = useHarvests()
  const { data: crops } = useCrops()
  const createMutation = useCreateHarvest()
  const updateMutation = useUpdateHarvest()
  const deleteMutation = useDeleteHarvest()
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedHarvest, setSelectedHarvest] = useState<Harvest | null>(null)

  const handleOpenCreate = () => { setSelectedHarvest(null); setIsFormOpen(true) }
  const handleOpenEdit = (harvest: Harvest) => { setSelectedHarvest(harvest); setIsFormOpen(true) }
  const handleOpenDelete = (harvest: Harvest) => { setSelectedHarvest(harvest); setIsDeleteOpen(true) }

  const handleFormSubmit = (data: any) => {
    if (selectedHarvest) {
      updateMutation.mutate({ id: selectedHarvest.id, data }, { onSuccess: () => setIsFormOpen(false) })
    } else {
      createMutation.mutate(data, { onSuccess: () => setIsFormOpen(false) })
    }
  }

  const handleDeleteConfirm = () => {
    if (selectedHarvest) {
      deleteMutation.mutate(selectedHarvest.id, { onSuccess: () => setIsDeleteOpen(false) })
    }
  }

  // Helper to get crop name
  const getCropName = (cropId: string) => {
    const crop = crops?.find(c => c.id === cropId)
    return crop ? `${crop.cropName} (${crop.variety})` : "Unknown Crop"
  }

  if (isLoading) return <div className="p-8 text-center text-neutral-500">Loading harvests...</div>
  if (isError) return <div className="p-4 bg-red-50 text-danger rounded-card">Error: {error.message}</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Harvests</h1>
          <p className="text-sm text-neutral-500 mt-1">{harvests?.length || 0} total records</p>
        </div>
        <Button onClick={handleOpenCreate} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" /> New record
        </Button>
      </div>

      <div className="bg-white rounded-card border border-neutral-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50 hover:bg-neutral-50">
              <TableHead className="font-semibold text-neutral-600">Crop</TableHead>
              <TableHead className="font-semibold text-neutral-600">Qty</TableHead>
              <TableHead className="font-semibold text-neutral-600">Grade</TableHead>
              <TableHead className="font-semibold text-neutral-600">Date</TableHead>
              <TableHead className="text-right font-semibold text-neutral-600">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {harvests?.map((harvest) => (
              <TableRow key={harvest.id}>
                <TableCell className="font-medium text-neutral-900">{getCropName(harvest.cropId)}</TableCell>
                <TableCell className="font-mono text-sm text-neutral-900">{harvest.quantity} {harvest.unit}</TableCell>
                <TableCell>
                  <Badge variant={harvest.qualityGrade === 'A' ? 'default' : 'secondary'} 
                         className={harvest.qualityGrade === 'A' ? 'bg-primary-600 hover:bg-primary-700' : ''}>
                    Grade {harvest.qualityGrade}
                  </Badge>
                </TableCell>
                <TableCell className="text-neutral-600 font-mono text-sm">{harvest.harvestDate}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(harvest)}>
                      <Pencil className="h-4 w-4 text-neutral-500 hover:text-primary-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(harvest)}>
                      <Trash2 className="h-4 w-4 text-neutral-500 hover:text-danger" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {harvests?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-neutral-500">No harvests found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <HarvestFormModal 
        key={selectedHarvest?.id || 'new'}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        initialData={selectedHarvest}
        crops={crops || []}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete harvest record?"
        description={`This will permanently remove this harvest record.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}