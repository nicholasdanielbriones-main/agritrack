import { Link } from "react-router-dom"
import { useFarmers } from "@/hooks/useFarmers"
import { useCrops } from "@/hooks/useCrops"
import { useInventory } from "@/hooks/useInventory"
import { useHarvests } from "@/hooks/useHarvests"
import { useAuth } from "@/contexts/AuthContext"
import { Users, Sprout, Wheat, AlertTriangle, Plus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Dashboard() {
  const { user } = useAuth()
  const { data: farmers, isLoading: loadFarmers } = useFarmers()
  const { data: crops, isLoading: loadCrops } = useCrops()
  const { data: inventory, isLoading: loadInventory } = useInventory()
  const { data: harvests, isLoading: loadHarvests } = useHarvests()

  const isLoading = loadFarmers || loadCrops || loadInventory || loadHarvests

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-neutral-200 animate-pulse rounded-md" />
          <div className="h-4 w-64 bg-neutral-200 animate-pulse rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-neutral-200 h-32 animate-pulse">
              <div className="h-4 w-24 bg-neutral-200 rounded mb-4" />
              <div className="h-8 w-16 bg-neutral-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const totalFarmers = farmers?.length || 0
  const activeCrops = crops?.filter(c => c.status === "Growing").length || 0
  
  const currentMonth = new Date().toISOString().slice(0, 7)
  const harvestsThisMonth = harvests?.filter(h => h.harvestDate.startsWith(currentMonth)) || []
  const totalHarvestQty = harvestsThisMonth.reduce((sum, h) => sum + h.quantity, 0)

  const lowStockItems = inventory?.filter(i => i.quantity <= i.reorderLevel).length || 0

  const recentHarvests = [...(harvests || [])]
    .sort((a, b) => new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Welcome back, <span className="font-semibold text-primary-600">{user?.name || "Farmer"}</span>. Here's your farm overview.
        </p>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-500">Total Farmers</h3>
            <div className="h-8 w-8 rounded-lg bg-neutral-50 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
              <Users className="h-4 w-4 text-neutral-400 group-hover:text-primary-600 transition-colors" />
            </div>
          </div>
          <p className="text-3xl font-bold text-neutral-900 mt-4">{totalFarmers}</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-500">Active Crops</h3>
            <div className="h-8 w-8 rounded-lg bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
              <Sprout className="h-4 w-4 text-primary-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-neutral-900 mt-4">{activeCrops}</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-500">Harvests this Month</h3>
            <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center group-hover:bg-warning/20 transition-colors">
              <Wheat className="h-4 w-4 text-warning" />
            </div>
          </div>
          <p className="text-3xl font-bold text-neutral-900 mt-4">{totalHarvestQty} <span className="text-sm font-normal text-neutral-500">kg</span></p>
        </div>

        {/* Card 4 */}
        <div className={`bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow group ${lowStockItems > 0 ? 'border-danger/30' : 'border-neutral-200'}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-medium ${lowStockItems > 0 ? 'text-danger' : 'text-neutral-500'}`}>Low Stock Items</h3>
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${lowStockItems > 0 ? 'bg-danger/10' : 'bg-neutral-50'}`}>
              <AlertTriangle className={`h-4 w-4 ${lowStockItems > 0 ? 'text-danger' : 'text-neutral-400'}`} />
            </div>
          </div>
          <p className={`text-3xl font-bold mt-4 ${lowStockItems > 0 ? 'text-danger' : 'text-neutral-900'}`}>
            {lowStockItems}
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Harvests */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="font-semibold text-neutral-900">Recent Harvests</h2>
            <Link to="/harvests" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 group">
              View all <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="p-0 flex-1">
            {recentHarvests.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="bg-neutral-50/50 text-neutral-500 text-xs uppercase tracking-wider border-b border-neutral-100">
                  <tr>
                    <th className="px-5 py-3 font-medium">Crop</th>
                    <th className="px-5 py-3 font-medium">Qty</th>
                    <th className="px-5 py-3 font-medium">Grade</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {recentHarvests.map((harvest) => {
                    const crop = crops?.find(c => c.id === harvest.cropId)
                    return (
                      <tr key={harvest.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="px-5 py-3 font-medium text-neutral-900">
                          {crop ? crop.cropName : "Unknown"}
                        </td>
                        <td className="px-5 py-3 text-neutral-600">{harvest.quantity} {harvest.unit}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            harvest.qualityGrade === 'A' ? 'bg-primary-100 text-primary-700' : 
                            harvest.qualityGrade === 'B' ? 'bg-neutral-100 text-neutral-700' : 
                            'bg-warning/10 text-warning'
                          }`}>
                            Grade {harvest.qualityGrade}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-neutral-500">{harvest.harvestDate}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-neutral-500 text-sm">
                No harvests recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm flex flex-col">
          <div className="p-5 border-b border-neutral-100">
            <h2 className="font-semibold text-neutral-900">Quick Actions</h2>
          </div>
          <div className="p-5 flex flex-col gap-3 flex-1">
            <Button asChild variant="outline" className="justify-start h-10 border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 shadow-sm active:scale-[0.99] transition-all">
              <Link to="/farmers">
                <Plus className="h-4 w-4 mr-2 text-neutral-400" /> Add New Farmer
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start h-10 border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 shadow-sm active:scale-[0.99] transition-all">
              <Link to="/crops">
                <Plus className="h-4 w-4 mr-2 text-neutral-400" /> Plant New Crop
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start h-10 border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 shadow-sm active:scale-[0.99] transition-all">
              <Link to="/harvests">
                <Plus className="h-4 w-4 mr-2 text-neutral-400" /> Record Harvest
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start h-10 border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 shadow-sm active:scale-[0.99] transition-all">
              <Link to="/inventory">
                <Plus className="h-4 w-4 mr-2 text-neutral-400" /> Add Supply
              </Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}