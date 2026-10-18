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
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("agritrack_user")
    return saved ? JSON.parse(saved) : null
  })

  const login = (email: string) => {
    // Extract the name from the email (e.g., "arthur@agritrack.com" -> "Arthur")
    const rawName = email.split("@")[0]
    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1)

    const newUser: User = { 
      name: formattedName, 
      email, 
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