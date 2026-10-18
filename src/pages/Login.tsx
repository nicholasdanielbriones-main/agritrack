import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Sprout } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Login() {
  const [email, setEmail] = useState("ana@agritrack.com")
  const [password, setPassword] = useState("password123")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    setTimeout(() => {
      login(email)
      navigate("/dashboard")
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-neutral-50 to-white p-4 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-200/40 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-primary-100/50 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl p-8 relative z-10">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 bg-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary-600/30">
            <Sprout className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">AgriTrack</h1>
          <p className="text-sm text-neutral-500 mt-2">Sign in to manage your farm</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 bg-white/50 focus:bg-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 bg-white/50 focus:bg-white"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline">Forgot password?</a>
          </div>

          <Button type="submit" className="w-full h-11 mt-2 shadow-md shadow-primary-600/20 active:scale-[0.98]" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-8 text-center text-xs text-neutral-400">
          © 2026 AgriTrack. All rights reserved.
        </div>
      </div>
    </div>
  )
}