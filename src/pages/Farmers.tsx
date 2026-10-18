import { useState } from "react"
import { useFarmers, useCreateFarmer, useUpdateFarmer, useDeleteFarmer } from "@/hooks/useFarmers"
import { Button } from "@/components/ui/button"
import { Plus, AlertCircle, Pencil, Trash2 } from "lucide-react"
import { FarmerFormModal } from "@/components/farmers/FarmerFormModal"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { Farmer } from "@/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function Farmers() {
  const { data: farmers, isLoading, isError, error } = useFarmers()
  const createMutation = useCreateFarmer()
  const updateMutation = useUpdateFarmer()
  const deleteMutation = useDeleteFarmer()
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null)

  const handleOpenCreate = () => { setSelectedFarmer(null); setIsFormOpen(true) }
  const handleOpenEdit = (farmer: Farmer) => { setSelectedFarmer(farmer); setIsFormOpen(true) }
  const handleOpenDelete = (farmer: Farmer) => { setSelectedFarmer(farmer); setIsDeleteOpen(true) }

  const handleFormSubmit = (data: any) => {
    if (selectedFarmer) {
      updateMutation.mutate({ id: selectedFarmer.id, data }, { onSuccess: () => setIsFormOpen(false) })
    } else {
      const payload = { ...data, registrationDate: new Date().toISOString().split('T')[0] }
      createMutation.mutate(payload, { onSuccess: () => setIsFormOpen(false) })
    }
  }

  const handleDeleteConfirm = () => {
    if (selectedFarmer) {
      deleteMutation.mutate(selectedFarmer.id, { onSuccess: () => setIsDeleteOpen(false) })
    }
  }

  if (isLoading) return <div className="p-8 text-center text-neutral-500 animate-pulse">Loading farmers...</div>
  if (isError) return <div className="p-4 bg-red-50 text-danger rounded-xl border border-red-200 flex items-center gap-3"><AlertCircle className="h-5 w-5" /> Error: {error.message}</div>

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Farmers</h1>
          <p className="text-sm text-neutral-500 mt-1">{farmers?.length || 0} total registered</p>
        </div>
        <Button onClick={handleOpenCreate} className="w-full sm:w-auto h-10 shadow-sm active:scale-95 transition-all">
          <Plus className="h-4 w-4 mr-2" /> New farmer
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-50/50 text-neutral-500 text-xs uppercase tracking-wider border-b border-neutral-100">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-medium px-5 py-3">Name</TableHead>
              <TableHead className="font-medium px-5 py-3">Contact</TableHead>
              <TableHead className="font-medium px-5 py-3">Location</TableHead>
              <TableHead className="font-medium px-5 py-3">Farm Size</TableHead>
              <TableHead className="text-right font-medium px-5 py-3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-neutral-100">
            {farmers?.map((farmer) => (
              <TableRow key={farmer.id} className="hover:bg-neutral-50/50 transition-colors">
                <TableCell className="font-medium text-neutral-900 px-5 py-4">{farmer.name}</TableCell>
                <TableCell className="text-neutral-600 px-5 py-4">{farmer.contact}</TableCell>
                <TableCell className="text-neutral-600 px-5 py-4">{farmer.location}</TableCell>
                <TableCell className="text-neutral-600 px-5 py-4">{farmer.farmSize} ha</TableCell>
                <TableCell className="text-right px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(farmer)} className="h-8 w-8 text-neutral-400 hover:text-primary-600">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(farmer)} className="h-8 w-8 text-neutral-400 hover:text-danger hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {farmers?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-neutral-500">No farmers found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <FarmerFormModal key={selectedFarmer?.id || 'new'} isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} isSubmitting={createMutation.isPending || updateMutation.isPending} initialData={selectedFarmer} />
      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDeleteConfirm} title="Delete farmer?" description={`This will permanently remove ${selectedFarmer?.name}.`} isLoading={deleteMutation.isPending} />
    </div>
  )
}