"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { CURRENCIES } from "@/lib/currencies"

interface BudgetTrackerProps {
  currency: string
}

export function BudgetTracker({ currency }: BudgetTrackerProps) {
  const [expenses, setExpenses] = useState<any[]>([])
  const [budgets, setBudgets] = useState<Record<string, number>>({
    Food: 500,
    Transport: 200,
    Entertainment: 300,
    Shopping: 400,
    Bills: 1000,
    Other: 200,
  })

  useEffect(() => {
    const saved = localStorage.getItem("expenses")
    if (saved) setExpenses(JSON.parse(saved))
  }, [])

  const expensesByCategory = expenses.reduce(
    (acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const currencySymbol = CURRENCIES.find((c) => c.code === currency)?.symbol || currency

  const categories = Object.keys(budgets)

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-foreground">Budget Tracker</h2>

      <div className="space-y-4">
        {categories.map((category) => {
          const spent = expensesByCategory[category] || 0
          const limit = budgets[category]
          const percentage = (spent / limit) * 100
          const status = percentage > 100 ? "danger" : percentage > 75 ? "warning" : "safe"

          return (
            <Card key={category} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{category}</h3>
                <span className="text-sm text-muted-foreground">
                  {currencySymbol}
                  {spent.toFixed(2)} / {currencySymbol}
                  {limit.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all rounded-full ${
                    status === "danger" ? "bg-red-500" : status === "warning" ? "bg-yellow-500" : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {percentage.toFixed(0)}% spent
                {percentage > 100 && ` (${currencySymbol}${(spent - limit).toFixed(2)} over budget)`}
              </p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
