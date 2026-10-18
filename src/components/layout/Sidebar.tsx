import { NavLink } from "react-router-dom"
import { LayoutDashboard, Users, Sprout, Package, Wheat, Settings, LogOut, X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Farmers", href: "/farmers", icon: Users },
  { name: "Crops", href: "/crops", icon: Sprout },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Harvests", href: "/harvests", icon: Wheat },
]

type SidebarProps = {
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
}

export function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const { logout } = useAuth()

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-900/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-200">
          <div className="flex items-center gap-2 text-primary-600 font-bold text-xl">
            <Sprout className="h-6 w-6" />
            <span>AgriTrack</span>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-neutral-500 hover:text-neutral-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-600 border-l-4 border-primary-600 rounded-l-none"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border-l-4 border-transparent"
                )
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-neutral-200 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors">
            <Settings className="h-5 w-5 flex-shrink-0" />
            Settings
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-danger hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}