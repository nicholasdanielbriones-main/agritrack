import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import { AppLayout } from "./layouts/AppLayout"
import { Dashboard } from "./pages/Dashboard"
import { Farmers } from "./pages/Farmers"
import { Crops } from "./pages/Crops"
import { Inventory } from "./pages/Inventory"
import { Harvests } from "./pages/Harvests"

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="farmers" element={<Farmers />} />
          <Route path="crops" element={<Crops />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="harvests" element={<Harvests />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}