import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AppLayout } from "./layouts/AppLayout"
import { Dashboard } from "./pages/Dashboard"

const Farmers = () => <div className="p-4 bg-white rounded-card border border-neutral-200 shadow-sm">Farmers Page (Coming next)</div>
const Crops = () => <div className="p-4 bg-white rounded-card border border-neutral-200 shadow-sm">Crops Page (Coming next)</div>
const Inventory = () => <div className="p-4 bg-white rounded-card border border-neutral-200 shadow-sm">Inventory Page (Coming next)</div>
const Harvests = () => <div className="p-4 bg-white rounded-card border border-neutral-200 shadow-sm">Harvests Page (Coming next)</div>

export default function App() {
  return (
    <BrowserRouter>
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