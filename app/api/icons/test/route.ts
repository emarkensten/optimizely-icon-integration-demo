import { NextResponse } from "next/server"

const STREAMLINE_API_KEY = process.env.STREAMLINE_API_KEY
const STREAMLINE_BASE_URL = "https://public-api.streamlinehq.com/v1"

export async function GET() {
  if (!STREAMLINE_API_KEY) {
    return NextResponse.json(
      {
        connected: false,
        error: "API key not found",
        details: "Environment variable 'STREAMLINE_API_KEY' is not set",
      },
      { status: 500 },
    )
  }

  console.log("=== API Test Starting ===")
  console.log("API Key (first 10 chars):", STREAMLINE_API_KEY.substring(0, 10))
  console.log("Base URL:", STREAMLINE_BASE_URL)

  try {
    const url = `${STREAMLINE_BASE_URL}/search/global?productType=icons&query=home&limit=5`
    console.log("Testing URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": STREAMLINE_API_KEY,
      },
    })

    console.log(`Response status: ${response.status}`)
    console.log(`Response headers:`, Object.fromEntries(response.headers.entries()))

    if (response.ok) {
      const data = await response.json()
      console.log("SUCCESS! Data received:", JSON.stringify(data, null, 2))
      return NextResponse.json({
        connected: true,
        message: "API connection successful with x-api-key header",
        authFormat: "x-api-key",
        sampleData: data,
      })
    } else {
      const errorText = await response.text()
      console.log("Error response:", errorText)
      return NextResponse.json(
        {
          connected: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          details: errorText,
        },
        { status: response.status },
      )
    }
  } catch (error) {
    console.log("Exception:", error)
    return NextResponse.json(
      {
        connected: false,
        error: "Connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
