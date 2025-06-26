# Optimizely Icon Integration

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/erik-markenstens-projects/v0-optimizely-icon-integration)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/2eyhUxn53UY)

## Overview

A React-based icon search integration for Optimizely that connects to the Streamline Icons API. This tool allows users to search for line-style icons with real-time autocomplete and preview them in multiple sizes (16px, 32px, 48px).

## Features

- 🔍 **Real-time Icon Search** - Search through thousands of line-style icons from Streamline
- 📱 **Responsive Design** - Works seamlessly across desktop and mobile devices
- 🎨 **Multiple Preview Sizes** - View icons in 16px, 32px, and 48px sizes
- 💎 **Premium Indicators** - Clear distinction between free and premium icons
- 📋 **Copy to Clipboard** - Easily copy icon URLs for use in your projects
- 🛠️ **Developer Tools** - Hidden debug panel for API testing and troubleshooting
- ⚡ **Optimized Performance** - Debounced search with loading states

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: Streamline Icons API
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Streamline Icons API key

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/your-username/optimizely-icon-integration.git
cd optimizely-icon-integration
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Add your Streamline API key to `.env.local`:
\`\`\`
STREAMLINE_API_KEY=your_api_key_here
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Search Icons**: Type in the search box to find icons (e.g., "home", "search", "user")
2. **Preview Sizes**: View icons in different sizes to see how they'll look in your design
3. **Copy URLs**: Click the copy button to get the icon URL for your projects
4. **Debug Tools**: Click the floating debug button (bottom-right) to access developer tools

## API Integration

The app uses Streamline's public API with the following features:
- Filtered to show only line-style icons (`style=line`)
- Real-time search with debouncing
- Proper error handling and retry logic
- CORS-compliant proxy API routes

## Project Structure

\`\`\`
├── app/
│   ├── api/icons/          # API routes for Streamline integration
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx           # Main page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── debug-sheet.tsx    # Developer debug panel
│   └── ...
├── icon-search-integration.tsx  # Main search component
└── ...
\`\`\`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `STREAMLINE_API_KEY` | Your Streamline Icons API key | Yes |

## Deployment

This project is automatically deployed to Vercel. Any changes pushed to the main branch will trigger a new deployment.

**Live Demo**: [https://vercel.com/erik-markenstens-projects/v0-optimizely-icon-integration](https://vercel.com/erik-markenstens-projects/v0-optimizely-icon-integration)

## Development

Continue building and modifying this app on:
**[https://v0.dev/chat/projects/2eyhUxn53UY](https://v0.dev/chat/projects/2eyhUxn53UY)**

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [v0.dev](https://v0.dev) - AI-powered React development
- Icons provided by [Streamline Icons](https://streamlinehq.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
