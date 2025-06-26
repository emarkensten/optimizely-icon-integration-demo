"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ApiStatusProps {
  isConnected: boolean
  error?: string
  onRetry?: () => void
}

export function ApiStatus({ isConnected, error, onRetry }: ApiStatusProps) {
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>API-anslutningsfel</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="ml-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Test igen
            </Button>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  if (isConnected) {
    return (
      <Alert className="mb-4 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Ansluten till Streamline API</AlertTitle>
        <AlertDescription className="text-green-700">API-nyckeln fungerar korrekt</AlertDescription>
      </Alert>
    )
  }

  return null
}
