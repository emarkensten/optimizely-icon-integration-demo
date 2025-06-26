"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Download, Copy, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { DebugSheet } from "./components/debug-sheet"

interface Icon {
  id: string
  name: string
  tags: string[]
  category: string
  imageUrl: string
  isFree: boolean
  familyName: string
  subcategoryName: string
}

interface SearchResult {
  icons: Icon[]
  total: number
  hasMore: boolean
}

// Updated interface based on actual Streamline API response
interface StreamlineIcon {
  hash: string
  name: string
  imagePreviewUrl: string
  isFree: boolean
  familySlug: string
  familyName: string
  categorySlug: string
  categoryName: string
  subcategorySlug: string
  subcategoryName: string
}

interface StreamlineResponse {
  query: string
  results: StreamlineIcon[]
  pagination: {
    total: number
    hasMore: boolean
    offset: number
    nextOffset: number
  }
}

export default function OptimizelyIconIntegration() {
  const [searchQuery, setSearchQuery] = useState("")
  const [icons, setIcons] = useState<Icon[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null)
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})
  const [debugData, setDebugData] = useState<any>(null)
  const { toast } = useToast()
  const [apiConnected, setApiConnected] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const searchIcons = useCallback(async (query: string): Promise<SearchResult> => {
    try {
      const url = `/api/icons/search?query=${encodeURIComponent(query)}&limit=20`

      const response = await fetch(url)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data: StreamlineResponse = await response.json()

      // Store raw data for debugging
      setDebugData(data)
      console.log("Frontend received data:", data)

      const icons: Icon[] = data.results.map((item) => ({
        id: item.hash,
        name: item.name,
        tags: [item.categoryName, item.subcategoryName, item.familyName].filter(Boolean),
        category: item.categoryName,
        imageUrl: item.imagePreviewUrl,
        isFree: item.isFree,
        familyName: item.familyName,
        subcategoryName: item.subcategoryName,
      }))

      console.log("Processed icons:", icons)

      return {
        icons,
        total: data.pagination.total,
        hasMore: data.pagination.hasMore,
      }
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }, [])

  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (searchQuery.trim()) {
        setLoading(true)
        setError(null)
        try {
          const result = await searchIcons(searchQuery)
          setIcons(result.icons)
          console.log("Set icons in state:", result.icons.length)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Okänt fel uppstod"
          setError(errorMessage)
          setIcons([])
          toast({
            title: "API-fel",
            description: errorMessage,
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      } else {
        setIcons([])
        setError(null)
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [searchQuery, searchIcons, toast])

  // Test API connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch("/api/icons/test")
        const data = await response.json()

        if (data.connected) {
          setApiConnected(true)
          setApiError(null)
        } else {
          throw new Error(data.error || "API connection failed")
        }
      } catch (error) {
        setApiConnected(false)
        setApiError(error instanceof Error ? error.message : "Kunde inte ansluta till API")
      }
    }

    testConnection()
  }, [])

  const retryConnection = async () => {
    setApiError(null)
    try {
      const response = await fetch("/api/icons/test")
      const data = await response.json()

      if (data.connected) {
        setApiConnected(true)
        setApiError(null)
      } else {
        throw new Error(data.error || "API connection failed")
      }
    } catch (error) {
      setApiConnected(false)
      setApiError(error instanceof Error ? error.message : "Kunde inte ansluta till API")
    }
  }

  const copyToClipboard = async (text: string, iconId: string) => {
    try {
      // For now, copy the image URL since we don't have SVG data
      await navigator.clipboard.writeText(text)
      setCopiedStates((prev) => ({ ...prev, [iconId]: true }))
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [iconId]: false }))
      }, 2000)
      toast({
        title: "Kopierat!",
        description: "Bild-URL har kopierats till urklipp.",
      })
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte kopiera till urklipp.",
        variant: "destructive",
      })
    }
  }

  const IconPreview = ({ icon, size }: { icon: Icon; size: number }) => (
    <div
      className="flex items-center justify-center border rounded p-2 bg-gray-50"
      style={{ width: size + 16, height: size + 16 }}
    >
      <img
        src={icon.imageUrl || "/placeholder.svg"}
        alt={icon.name}
        style={{ width: size, height: size }}
        className="object-contain"
        onError={(e) => {
          // Fallback if image fails to load
          const target = e.target as HTMLImageElement
          target.style.display = "none"
          target.parentElement!.innerHTML = `<div style="width: ${size}px; height: ${size}px; background: #e5e7eb; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 12px;">Icon</div>`
        }}
      />
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Optimizely Icon Integration</h1>
        <p className="text-gray-600 mt-1">Sök och välj line-ikoner för dina Optimizely-projekt</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Sök efter ikoner..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Results */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Sökresultat</h2>
            {icons.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{icons.length} ikoner</Badge>
                <Badge variant="outline">Line style</Badge>
                {debugData?.pagination?.hasMore && <Badge variant="outline">Fler tillgängliga</Badge>}
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-12 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <svg className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Fel vid sökning</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button
                onClick={() => {
                  setError(null)
                  if (searchQuery.trim()) {
                    // Trigger search again
                    setSearchQuery(searchQuery + " ")
                    setSearchQuery(searchQuery)
                  }
                }}
                variant="outline"
              >
                Försök igen
              </Button>
            </div>
          ) : icons.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {icons.map((icon) => (
                <Card
                  key={icon.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedIcon?.id === icon.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedIcon(icon)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <img
                        src={icon.imageUrl || "/placeholder.svg"}
                        alt={icon.name}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          target.parentElement!.innerHTML = `<div class="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">Icon</div>`
                        }}
                      />
                    </div>
                    <p className="text-sm font-medium truncate">{icon.name}</p>
                    <p className="text-xs text-gray-500">{icon.category}</p>
                    {!icon.isFree && (
                      <Badge variant="outline" className="text-xs mt-1">
                        Premium
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-12 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Inga line-ikoner hittades för "{searchQuery}"</p>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Börja söka efter line-ikoner...</p>
            </div>
          )}
        </div>

        {/* Icon Details */}
        <div className="lg:col-span-1">
          {selectedIcon ? (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Vald ikon</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">{selectedIcon.name}</h4>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">{selectedIcon.category}</Badge>
                      <Badge variant="secondary">Line</Badge>
                      {!selectedIcon.isFree && <Badge variant="secondary">Premium</Badge>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Förhandsvisning</h4>
                    <Tabs defaultValue="16" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="16">16px</TabsTrigger>
                        <TabsTrigger value="32">32px</TabsTrigger>
                        <TabsTrigger value="48">48px</TabsTrigger>
                      </TabsList>
                      <TabsContent value="16" className="mt-4">
                        <IconPreview icon={selectedIcon} size={16} />
                      </TabsContent>
                      <TabsContent value="32" className="mt-4">
                        <IconPreview icon={selectedIcon} size={32} />
                      </TabsContent>
                      <TabsContent value="48" className="mt-4">
                        <IconPreview icon={selectedIcon} size={48} />
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Information</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Familj:</strong> {selectedIcon.familyName}
                      </p>
                      <p>
                        <strong>Kategori:</strong> {selectedIcon.subcategoryName}
                      </p>
                      <p>
                        <strong>Status:</strong> {selectedIcon.isFree ? "Gratis" : "Premium"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Taggar</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedIcon.tags.map((tag, index) => (
                        <Badge key={`${tag}-${index}`} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => copyToClipboard(selectedIcon.imageUrl, selectedIcon.id)}
                      className="w-full"
                      variant="outline"
                    >
                      {copiedStates[selectedIcon.id] ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Kopierat!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Kopiera bild-URL
                        </>
                      )}
                    </Button>

                    <Button className="w-full" disabled={!selectedIcon.isFree}>
                      <Download className="h-4 w-4 mr-2" />
                      {selectedIcon.isFree ? "Ladda ner" : "Premium krävs"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8" />
                </div>
                <p>Välj en ikon för att se detaljer</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Debug Sheet - Fixed positioned button */}
      <DebugSheet
        apiConnected={apiConnected}
        apiError={apiError}
        debugData={debugData}
        onRetryConnection={retryConnection}
      />
    </div>
  )
}
