export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Welcome back, Ana. Here's your farm at a glance.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['Total Farmers', 'Active Crops', 'Harvests this Month', 'Low Stock Items'].map((stat) => (
          <div key={stat} className="bg-white p-6 rounded-card border border-neutral-200 shadow-sm">
            <h3 className="text-sm font-medium text-neutral-500">{stat}</h3>
            <p className="text-3xl font-bold text-neutral-900 mt-2">--</p>
          </div>
        ))}
      </div>
    </div>
  )
}