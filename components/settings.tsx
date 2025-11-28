"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Upload, Trash2 } from "lucide-react"
import { CURRENCIES } from "@/lib/currencies"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SettingsProps {
  currency: string
  setCurrency: (currency: string) => void
}

export function Settings({ currency, setCurrency }: SettingsProps) {
  const exportData = () => {
    const data = {
      tasks: JSON.parse(localStorage.getItem("tasks") || "[]"),
      expenses: JSON.parse(localStorage.getItem("expenses") || "[]"),
      savingsGoals: JSON.parse(localStorage.getItem("savingsGoals") || "[]"),
      currency,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "productivity-backup.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        localStorage.setItem("tasks", JSON.stringify(data.tasks || []))
        localStorage.setItem("expenses", JSON.stringify(data.expenses || []))
        localStorage.setItem("savingsGoals", JSON.stringify(data.savingsGoals || []))
        window.location.reload()
      } catch (err) {
        alert("Invalid backup file")
      }
    }
    reader.readAsText(file)
  }

  const clearAllData = () => {
    if (confirm("Are you sure? This will delete all data.")) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-foreground">Settings</h2>

      <Card className="p-6 mb-6">
        <h3 className="font-semibold mb-4">Currency Settings</h3>
        <div className="w-80">
          <label className="block text-sm font-medium mb-2">Select Currency</label>
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
          <p className="text-xs text-muted-foreground mt-2">
            Over 150+ world currencies supported with real ISO 4217 codes
          </p>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h3 className="font-semibold mb-4">Data Management</h3>
        <div className="space-y-3">
          <Button onClick={exportData} className="w-full gap-2 bg-transparent" variant="outline">
            <Download className="w-4 h-4" />
            Export Data as JSON
          </Button>
          <Button
            onClick={() => document.getElementById("import-input")?.click()}
            className="w-full gap-2"
            variant="outline"
          >
            <Upload className="w-4 h-4" />
            Import Data from JSON
          </Button>
          <input id="import-input" type="file" accept=".json" onChange={importData} className="hidden" />
          <Button onClick={clearAllData} className="w-full gap-2" variant="destructive">
            <Trash2 className="w-4 h-4" />
            Clear All Data
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-3">About</h3>
        <p className="text-sm text-muted-foreground mb-2">
          <strong>Productivity Manager v1.0</strong>
        </p>
        <p className="text-sm text-muted-foreground">
          A comprehensive productivity application with task management, expense tracking, budget monitoring, and
          savings goals.
        </p>
        <p className="text-sm text-muted-foreground mt-3">
          All data is stored locally in your browser and never sent to any server.
        </p>
      </Card>
    </div>
  )
}
