"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { CURRENCIES } from "@/lib/currencies"

interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
}

interface SavingsGoalsProps {
  currency: string
}

export function SavingsGoals({ currency }: SavingsGoalsProps) {
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [name, setName] = useState("")
  const [targetAmount, setTargetAmount] = useState("")
  const [deadline, setDeadline] = useState("")
  const [addAmount, setAddAmount] = useState<Record<string, string>>({})

  useEffect(() => {
    const saved = localStorage.getItem("savingsGoals")
    if (saved) setGoals(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("savingsGoals", JSON.stringify(goals))
  }, [goals])

  const addGoal = () => {
    if (!name || !targetAmount || !deadline) return
    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      name,
      targetAmount: Number.parseFloat(targetAmount),
      currentAmount: 0,
      deadline,
    }
    setGoals([...goals, newGoal])
    setName("")
    setTargetAmount("")
    setDeadline("")
  }

  const addSavings = (id: string) => {
    const amount = Number.parseFloat(addAmount[id] || "0")
    if (amount <= 0) return
    setGoals(
      goals.map((g) => (g.id === id ? { ...g, currentAmount: Math.min(g.currentAmount + amount, g.targetAmount) } : g)),
    )
    setAddAmount({ ...addAmount, [id]: "" })
  }

  const deleteGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id))
  }

  const currencySymbol = CURRENCIES.find((c) => c.code === currency)?.symbol || currency

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-foreground">Savings Goals</h2>

      <Card className="p-6 mb-6">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Goal Name</label>
              <Input placeholder="e.g., Vacation" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Target Amount</label>
              <div className="flex gap-2">
                <span className="px-3 py-2 bg-muted rounded-md text-muted-foreground">{currencySymbol}</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Deadline</label>
              <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
          </div>
          <Button onClick={addGoal} className="w-full gap-2">
            <Plus className="w-4 h-4" />
            Create Goal
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        {goals.map((goal) => {
          const percentage = (goal.currentAmount / goal.targetAmount) * 100
          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          const dailySavings = daysLeft > 0 ? ((goal.targetAmount - goal.currentAmount) / daysLeft).toFixed(2) : "0"

          return (
            <Card key={goal.id} className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{goal.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currencySymbol}
                    {goal.currentAmount.toFixed(2)} / {currencySymbol}
                    {goal.targetAmount.toFixed(2)}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteGoal(goal.id)} className="text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="w-full bg-muted rounded-full h-3 mb-4 overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all rounded-full"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Progress</p>
                  <p className="font-semibold">{percentage.toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Days Left</p>
                  <p className="font-semibold">{daysLeft}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Daily Target</p>
                  <p className="font-semibold">
                    {currencySymbol}
                    {dailySavings}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Amount to add"
                  value={addAmount[goal.id] || ""}
                  onChange={(e) => setAddAmount({ ...addAmount, [goal.id]: e.target.value })}
                />
                <Button onClick={() => addSavings(goal.id)} variant="outline">
                  Add Savings
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
