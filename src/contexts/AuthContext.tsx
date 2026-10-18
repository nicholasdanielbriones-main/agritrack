import { createContext, useContext, useState, ReactNode } from "react"

type User = {
  name: string
  email: string
  role: "Admin" | "Field Officer" | "Farmer"
}

type AuthContextType = {
  user: User | null
  login: (email: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    name: "Ana Villanueva",
    email: "ana@agritrack.com",
    role: "Admin",
  })

  const login = (email: string) => {
    setUser({ name: "Ana Villanueva", email, role: "Admin" })
  }

  const logout = () => {
    setUser(null)
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