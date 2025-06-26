import { type NextRequest, NextResponse } from "next/server"

const STREAMLINE_API_KEY = process.env.STREAMLINE_API_KEY
const STREAMLINE_BASE_URL = "https://public-api.streamlinehq.com/v1"

export async function GET(request: NextRequest) {
  if (!STREAMLINE_API_KEY) {
    return NextResponse.json(
      {
        error: "API key not configured",
        details: "Environment variable 'STREAMLINE_API_KEY' is not set",
      },
      { status: 500 },
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""
    const limit = searchParams.get("limit") || "20"

    if (!query.trim()) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    // Add style=line filter to only get line icons
    const url = `${STREAMLINE_BASE_URL}/search/global?productType=icons&query=${encodeURIComponent(query)}&limit=${limit}&style=line`

    console.log("Fetching from:", url)
    console.log("API Key (first 10 chars):", STREAMLINE_API_KEY.substring(0, 10))

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": STREAMLINE_API_KEY,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Streamline API Error:", response.status, errorText)
      return NextResponse.json(
        {
          error: `Streamline API Error: ${response.status} - ${response.statusText}`,
          details: errorText,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("Success! Received data with", data.results?.length || 0, "line icons")
    return NextResponse.json(data)
  } catch (error) {
    console.error("API Route Error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
