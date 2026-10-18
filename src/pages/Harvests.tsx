import { useState } from "react"
import { useHarvests, useCreateHarvest, useUpdateHarvest, useDeleteHarvest } from "@/hooks/useHarvests"
import { useCrops } from "@/hooks/useCrops"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, AlertCircle, Pencil, Trash2 } from "lucide-react"
import { HarvestFormModal } from "@/components/harvests/HarvestFormModal"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { Harvest } from "@/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
    if (selectedHarvest) deleteMutation.mutate(selectedHarvest.id, { onSuccess: () => setIsDeleteOpen(false) })
  }

  const getCropName = (cropId: string) => {
    const crop = crops?.find(c => c.id === cropId)
    return crop ? `${crop.cropName} (${crop.variety})` : "Unknown Crop"
  }

  if (isLoading) return <div className="p-8 text-center text-neutral-500 animate-pulse">Loading harvests...</div>
  if (isError) return <div className="p-4 bg-red-50 text-danger rounded-xl border border-red-200 flex items-center gap-3"><AlertCircle className="h-5 w-5" /> Error: {error.message}</div>

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Harvests</h1>
          <p className="text-sm text-neutral-500 mt-1">{harvests?.length || 0} total records</p>
        </div>
        <Button onClick={handleOpenCreate} className="w-full sm:w-auto h-10 shadow-sm active:scale-95 transition-all">
          <Plus className="h-4 w-4 mr-2" /> New record
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-50/50 text-neutral-500 text-xs uppercase tracking-wider border-b border-neutral-100">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-medium px-5 py-3">Crop</TableHead>
              <TableHead className="font-medium px-5 py-3">Qty</TableHead>
              <TableHead className="font-medium px-5 py-3">Grade</TableHead>
              <TableHead className="font-medium px-5 py-3">Date</TableHead>
              <TableHead className="text-right font-medium px-5 py-3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-neutral-100">
            {harvests?.map((harvest) => (
              <TableRow key={harvest.id} className="hover:bg-neutral-50/50 transition-colors">
                <TableCell className="font-medium text-neutral-900 px-5 py-4">{getCropName(harvest.cropId)}</TableCell>
                <TableCell className="text-neutral-900 px-5 py-4">{harvest.quantity} {harvest.unit}</TableCell>
                <TableCell className="px-5 py-4">
                  <Badge variant="outline" className={`border-0 px-2 py-0.5 rounded text-xs font-medium ${
                    harvest.qualityGrade === 'A' ? 'bg-primary-100 text-primary-700' : 
                    harvest.qualityGrade === 'B' ? 'bg-neutral-100 text-neutral-700' : 
                    'bg-warning/10 text-warning'
                  }`}>
                    Grade {harvest.qualityGrade}
                  </Badge>
                </TableCell>
                <TableCell className="text-neutral-500 px-5 py-4">{harvest.harvestDate}</TableCell>
                <TableCell className="text-right px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(harvest)} className="h-8 w-8 text-neutral-400 hover:text-primary-600">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(harvest)} className="h-8 w-8 text-neutral-400 hover:text-danger hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {harvests?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-neutral-500">No harvests found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <HarvestFormModal key={selectedHarvest?.id || 'new'} isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} isSubmitting={createMutation.isPending || updateMutation.isPending} initialData={selectedHarvest} crops={crops || []} />
      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDeleteConfirm} title="Delete harvest record?" description={`This will permanently remove this harvest record.`} isLoading={deleteMutation.isPending} />
    </div>
  )
}