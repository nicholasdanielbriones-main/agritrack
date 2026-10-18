import { Menu, Search, Bell, LogOut, User as UserIcon, Settings } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type TopbarProps = {
  setIsMobileOpen: (open: boolean) => void
}

export function Topbar({ setIsMobileOpen }: TopbarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "U"

  const handleLogout = () => {
    logout()
    navigate("/login")
    toast.success("Signed out successfully")
  }

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      {/* Left side: Hamburger + Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden text-neutral-500 hover:text-neutral-900"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative max-w-sm w-full hidden sm:block group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-neutral-400 group-focus-within:text-primary-600 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-9 pr-3 py-1.5 border border-neutral-200 rounded-md text-sm bg-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all"
          />
        </div>
      </div>

      {/* Right side: Notifications + Profile */}
      <div className="flex items-center gap-2">
        
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-danger ring-2 ring-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer flex flex-col items-start gap-1">
              <span className="text-sm font-medium text-danger">Low Stock Alert</span>
              <span className="text-xs text-neutral-500">3 items are below reorder level.</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer flex flex-col items-start gap-1">
              <span className="text-sm font-medium">Welcome to AgriTrack</span>
              <span className="text-xs text-neutral-500">Your account is ready to use.</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-6 w-px bg-neutral-200 mx-1"></div>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-2 hover:bg-neutral-100 p-1 rounded-full pr-3 transition-colors">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary-100 text-primary-700 font-semibold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-neutral-700 hidden sm:block">
                {user?.name.split(" ")[0] || "Profile"}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || "Guest"}</p>
                <p className="text-xs leading-none text-neutral-500">{user?.email || "Not signed in"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => toast.info("Profile page coming soon")}>
              <UserIcon className="h-4 w-4 mr-2 text-neutral-500" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => toast.info("Settings page coming soon")}>
              <Settings className="h-4 w-4 mr-2 text-neutral-500" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-danger focus:bg-red-50 focus:text-danger">
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  )
}