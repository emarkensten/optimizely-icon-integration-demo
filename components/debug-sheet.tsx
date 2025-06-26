"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

interface DebugSheetProps {
  apiConnected: boolean
  apiError?: string
  debugData?: any
  onRetryConnection: () => void
}

export function DebugSheet({ apiConnected, apiError, debugData, onRetryConnection }: DebugSheetProps) {
  const [testData, setTestData] = useState<any>(null)
  const [testLoading, setTestLoading] = useState(false)

  const runApiTest = async () => {
    setTestLoading(true)
    try {
      const response = await fetch("/api/icons/test")
      const data = await response.json()
      setTestData({ ...data, status: response.status })
    } catch (error) {
      setTestData({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setTestLoading(false)
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="fixed bottom-4 right-4 z-50">
          <Settings className="h-4 w-4 mr-2" />
          Debug
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Debug Information</SheetTitle>
          <SheetDescription>API-status, testresultat och debug-data för utvecklare</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* API Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                {apiConnected ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                API-anslutning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {apiError ? (
                <div>
                  <Badge variant="destructive" className="mb-2">
                    Fel
                  </Badge>
                  <p className="text-sm text-red-600">{apiError}</p>
                  <Button onClick={onRetryConnection} size="sm" variant="outline" className="mt-2">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Försök igen
                  </Button>
                </div>
              ) : apiConnected ? (
                <div>
                  <Badge variant="default" className="mb-2">
                    Ansluten
                  </Badge>
                  <p className="text-sm text-green-700">Streamline API fungerar korrekt</p>
                </div>
              ) : (
                <div>
                  <Badge variant="secondary">Testar...</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* API Test */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">API-test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={runApiTest} disabled={testLoading} size="sm" className="w-full">
                {testLoading ? "Testar..." : "Kör API-test"}
              </Button>

              {testData && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge variant={testData.connected ? "default" : "destructive"}>
                      {testData.status || "Unknown"}
                    </Badge>
                  </div>

                  {testData.authFormat && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Auth Format:</span>
                      <Badge variant="secondary">{testData.authFormat}</Badge>
                    </div>
                  )}

                  {testData.error && (
                    <div>
                      <span className="text-sm font-medium text-red-600">Error:</span>
                      <p className="text-sm text-red-600 mt-1">{testData.error}</p>
                    </div>
                  )}

                  {testData.sampleData && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm font-medium">Visa testdata</summary>
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40 mt-2">
                        {JSON.stringify(testData.sampleData, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Search Debug Data */}
          {debugData && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Senaste sökning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Query:</strong> {debugData.query}
                  </p>
                  <p>
                    <strong>Results:</strong> {debugData.results?.length || 0} ikoner
                  </p>
                  <p>
                    <strong>Total:</strong> {debugData.pagination?.total || 0}
                  </p>
                  <p>
                    <strong>Has More:</strong> {debugData.pagination?.hasMore ? "Ja" : "Nej"}
                  </p>
                </div>
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm font-medium">Visa raw data</summary>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-60 mt-2">
                    {JSON.stringify(debugData, null, 2)}
                  </pre>
                </details>
              </CardContent>
            </Card>
          )}

          {/* Environment Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Miljöinformation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>API Endpoint:</strong> /api/icons/search
              </p>
              <p>
                <strong>Style Filter:</strong> line
              </p>
              <p>
                <strong>Environment:</strong> {process.env.NODE_ENV || "development"}
              </p>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}
