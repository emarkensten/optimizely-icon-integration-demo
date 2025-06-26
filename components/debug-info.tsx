"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronUp } from "lucide-react"

export function DebugInfo() {
  const [isOpen, setIsOpen] = useState(false)
  const [debugData, setDebugData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runDebugTest = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/icons/test")
      const data = await response.json()
      setDebugData({ ...data, status: response.status })
    } catch (error) {
      setDebugData({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="mb-4">
        Visa debug-information
      </Button>
    )
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Debug Information</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={runDebugTest} disabled={loading} size="sm">
          {loading ? "Testar..." : "Kör API-test"}
        </Button>

        {debugData && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant={debugData.connected ? "default" : "destructive"}>{debugData.status || "Unknown"}</Badge>
            </div>

            {debugData.authFormat && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Auth Format:</span>
                <Badge variant="secondary">{debugData.authFormat}</Badge>
              </div>
            )}

            {debugData.error && (
              <div>
                <span className="text-sm font-medium text-red-600">Error:</span>
                <p className="text-sm text-red-600 mt-1">{debugData.error}</p>
              </div>
            )}

            {debugData.details && (
              <div>
                <span className="text-sm font-medium">Details:</span>
                <p className="text-sm text-gray-600 mt-1">{debugData.details}</p>
              </div>
            )}

            {debugData.apiKeyPreview && (
              <div>
                <span className="text-sm font-medium">API Key Preview:</span>
                <p className="text-sm font-mono text-gray-600 mt-1">{debugData.apiKeyPreview}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
