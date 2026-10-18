import { Menu, Search, Bell } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
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

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "U"

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden text-neutral-500 hover:text-neutral-900 focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="relative max-w-md w-full hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search farmers, crops..."
            className="block w-full pl-10 pr-3 py-2 border border-neutral-200 rounded-md leading-5 bg-neutral-50 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600 sm:text-sm transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none rounded-full hover:bg-neutral-100">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-danger ring-2 ring-white" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-3 hover:bg-neutral-50 p-1.5 rounded-md transition-colors">
              <Avatar className="h-8 w-8 bg-primary-50">
                <AvatarFallback className="text-primary-600 font-medium text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-neutral-700 hidden sm:block">
                {user?.name.split(" ")[0]}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-neutral-500">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer text-danger focus:bg-red-50 focus:text-danger">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}