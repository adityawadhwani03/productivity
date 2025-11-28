"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { CURRENCIES } from "@/lib/currencies"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Expense {
  id: string
  amount: number
  category: string
  date: string
  notes: string
  recurring: boolean
}

interface ExpenseTrackerProps {
  currency: string
  setCurrency: (currency: string) => void
}

export function ExpenseTracker({ currency, setCurrency }: ExpenseTrackerProps) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Food")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")
  const [recurring, setRecurring] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("expenses")
    if (saved) setExpenses(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses))
  }, [expenses])

  const addExpense = () => {
    if (!amount || isNaN(Number.parseFloat(amount))) return
    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: Number.parseFloat(amount),
      category,
      date,
      notes,
      recurring,
    }
    setExpenses([...expenses, newExpense])
    setAmount("")
    setNotes("")
    setDate(new Date().toISOString().split("T")[0])
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const currencySymbol = CURRENCIES.find((c) => c.code === currency)?.symbol || currency

  const expensesByCategory = expenses.reduce(
    (acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-foreground">Expenses</h2>
        <div className="w-32">
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="font-mono">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent className="max-h-96">
              {CURRENCIES.map((curr) => (
                <SelectItem key={curr.code} value={curr.code}>
                  {curr.code} ({curr.symbol}) - {curr.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-2xl font-bold mt-2">
            {currencySymbol}
            {totalExpenses.toFixed(2)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Transactions</p>
          <p className="text-2xl font-bold mt-2">{expenses.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Average</p>
          <p className="text-2xl font-bold mt-2">
            {currencySymbol}
            {(expenses.length > 0 ? totalExpenses / expenses.length : 0).toFixed(2)}
          </p>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <div className="flex gap-2">
                <span className="px-3 py-2 bg-muted rounded-md text-muted-foreground">{currencySymbol}</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addExpense()}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                {["Food", "Transport", "Entertainment", "Shopping", "Bills", "Other"].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <Input placeholder="Optional notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} />
            <span className="text-sm font-medium">Mark as recurring</span>
          </label>
          <Button onClick={addExpense} className="w-full gap-2">
            <Plus className="w-4 h-4" />
            Add Expense
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            By Category
          </h3>
          <div className="space-y-2">
            {Object.entries(expensesByCategory).map(([cat, amount]) => (
              <div key={cat} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{cat}</span>
                <span className="font-semibold">
                  {currencySymbol}
                  {amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-2">
        {expenses
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((expense) => (
            <Card key={expense.id} className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div>
                    <h3 className="font-semibold">{expense.category}</h3>
                    {expense.notes && <p className="text-sm text-muted-foreground">{expense.notes}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(expense.date).toLocaleDateString()}
                      {expense.recurring && " • Recurring"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg">
                  {currencySymbol}
                  {expense.amount.toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteExpense(expense.id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
      </div>
    </div>
  )
}
