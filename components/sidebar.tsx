"use client"

import { LayoutGrid, DollarSign, PieChart, Target, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  currentView: string
  setCurrentView: (view: any) => void
}

export function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const items = [
    { id: "tasks", label: "Tasks", icon: LayoutGrid },
    { id: "expenses", label: "Expenses", icon: DollarSign },
    { id: "budget", label: "Budget", icon: PieChart },
    { id: "savings", label: "Savings", icon: Target },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border p-6">
      <h1 className="text-2xl font-bold text-sidebar-foreground mb-8">Productivity</h1>
      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={currentView === item.id ? "default" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => setCurrentView(item.id)}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Button>
          )
        })}
      </nav>
    </aside>
  )
}
