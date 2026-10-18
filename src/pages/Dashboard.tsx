import { Link } from "react-router-dom"
import { useFarmers } from "@/hooks/useFarmers"
import { useCrops } from "@/hooks/useCrops"
import { useInventory } from "@/hooks/useInventory"
import { useHarvests } from "@/hooks/useHarvests"
import { Users, Sprout, Wheat, AlertTriangle, Plus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Dashboard() {
  const { data: farmers, isLoading: loadFarmers } = useFarmers()
  const { data: crops, isLoading: loadCrops } = useCrops()
  const { data: inventory, isLoading: loadInventory } = useInventory()
  const { data: harvests, isLoading: loadHarvests } = useHarvests()

  const isLoading = loadFarmers || loadCrops || loadInventory || loadHarvests

  if (isLoading) {
    return (
      <div className="p-8 text-center text-neutral-500 animate-pulse">
        Loading dashboard data...
      </div>
    )
  }

  // Calculate stats
  const totalFarmers = farmers?.length || 0
  
  const activeCrops = crops?.filter(c => c.status === "Growing").length || 0
  
  // Calculate total harvest for the current month
  const currentMonth = new Date().toISOString().slice(0, 7) // "YYYY-MM"
  const harvestsThisMonth = harvests?.filter(h => h.harvestDate.startsWith(currentMonth)) || []
  const totalHarvestQty = harvestsThisMonth.reduce((sum, h) => sum + h.quantity, 0)

  const lowStockItems = inventory?.filter(i => i.quantity <= i.reorderLevel).length || 0

  // Get 5 most recent harvests
  const recentHarvests = [...(harvests || [])]
    .sort((a, b) => new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Welcome back, Ana. Here's your farm at a glance.
        </p>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-card border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-500">Total Farmers</h3>
            <Users className="h-5 w-5 text-neutral-400" />
          </div>
          <p className="text-3xl font-bold text-neutral-900 mt-2">{totalFarmers}</p>
        </div>

        <div className="bg-white p-6 rounded-card border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-500">Active Crops</h3>
            <Sprout className="h-5 w-5 text-primary-600" />
          </div>
          <p className="text-3xl font-bold text-neutral-900 mt-2">{activeCrops}</p>
        </div>

        <div className="bg-white p-6 rounded-card border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-500">Harvests this Month</h3>
            <Wheat className="h-5 w-5 text-warning" />
          </div>
          <p className="text-3xl font-bold text-neutral-900 mt-2">{totalHarvestQty} <span className="text-sm font-normal text-neutral-500">kg</span></p>
        </div>

        <div className={`bg-white p-6 rounded-card border shadow-sm ${lowStockItems > 0 ? 'border-danger/30 bg-red-50/10' : 'border-neutral-200'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-500">Low Stock Items</h3>
            <AlertTriangle className={`h-5 w-5 ${lowStockItems > 0 ? 'text-danger' : 'text-neutral-400'}`} />
          </div>
          <p className={`text-3xl font-bold mt-2 ${lowStockItems > 0 ? 'text-danger' : 'text-neutral-900'}`}>
            {lowStockItems}
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Harvests (Takes up 2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-card border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
            <h2 className="font-semibold text-neutral-900">Recent Harvests</h2>
            <Link to="/harvests" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="p-0 flex-1">
            {recentHarvests.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3 font-medium">Crop ID</th>
                    <th className="px-5 py-3 font-medium">Qty</th>
                    <th className="px-5 py-3 font-medium">Grade</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {recentHarvests.map((harvest) => {
                    const crop = crops?.find(c => c.id === harvest.cropId)
                    return (
                      <tr key={harvest.id} className="hover:bg-neutral-50/50">
                        <td className="px-5 py-3 font-medium text-neutral-900">
                          {crop ? crop.cropName : "Unknown"}
                        </td>
                        <td className="px-5 py-3 font-mono text-neutral-600">{harvest.quantity} {harvest.unit}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            harvest.qualityGrade === 'A' ? 'bg-primary-50 text-primary-700' : 
                            harvest.qualityGrade === 'B' ? 'bg-neutral-100 text-neutral-700' : 
                            'bg-warning/10 text-warning'
                          }`}>
                            Grade {harvest.qualityGrade}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-neutral-500 font-mono text-xs">{harvest.harvestDate}</td>
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
        <div className="bg-white rounded-card border border-neutral-200 shadow-sm flex flex-col">
          <div className="p-5 border-b border-neutral-200">
            <h2 className="font-semibold text-neutral-900">Quick Actions</h2>
          </div>
          <div className="p-5 flex flex-col gap-3 flex-1">
            <Button asChild variant="outline" className="justify-start h-11 border-neutral-200 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200">
              <Link to="/farmers">
                <Plus className="h-4 w-4 mr-2" /> New Farmer
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start h-11 border-neutral-200 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200">
              <Link to="/crops">
                <Plus className="h-4 w-4 mr-2" /> New Crop
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start h-11 border-neutral-200 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200">
              <Link to="/harvests">
                <Plus className="h-4 w-4 mr-2" /> New Harvest
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start h-11 border-neutral-200 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200">
              <Link to="/inventory">
                <Plus className="h-4 w-4 mr-2" /> New Supply
              </Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}