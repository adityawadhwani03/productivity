"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { TaskManager } from "@/components/task-manager"
import { ExpenseTracker } from "@/components/expense-tracker"
import { BudgetTracker } from "@/components/budget-tracker"
import { SavingsGoals } from "@/components/savings-goals"
import { Settings } from "@/components/settings"

type PageView = "tasks" | "expenses" | "budget" | "savings" | "settings"

export default function Home() {
  const [currentView, setCurrentView] = useState<PageView>("tasks")
  const [currency, setCurrency] = useState("USD")

  useEffect(() => {
    const saved = localStorage.getItem("selectedCurrency")
    if (saved) setCurrency(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem("selectedCurrency", currency)
  }, [currency])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 overflow-auto">
        {currentView === "tasks" && <TaskManager />}
        {currentView === "expenses" && <ExpenseTracker currency={currency} setCurrency={setCurrency} />}
        {currentView === "budget" && <BudgetTracker currency={currency} />}
        {currentView === "savings" && <SavingsGoals currency={currency} />}
        {currentView === "settings" && <Settings currency={currency} setCurrency={setCurrency} />}
      </main>
    </div>
  )
}
