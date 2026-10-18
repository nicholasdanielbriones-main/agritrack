import { createContext, useContext, useState, ReactNode } from "react"

type User = {
  name: string
  email: string // We will still store it as 'email' under the hood, but it will hold the username
  role: "Admin" | "Field Officer" | "Farmer"
}

type AuthContextType = {
  user: User | null
  login: (username: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("agritrack_user")
    return saved ? JSON.parse(saved) : null
  })

  const login = (username: string) => {
    // Format the username (e.g., "ana" -> "Ana")
    const formattedName = username.charAt(0).toUpperCase() + username.slice(1)

    const newUser: User = { 
      name: formattedName, 
      email: `${username}@agritrack.com`, // Generate a fake email for the profile dropdown
      role: "Admin" 
    }
    setUser(newUser)
    localStorage.setItem("agritrack_user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("agritrack_user")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}