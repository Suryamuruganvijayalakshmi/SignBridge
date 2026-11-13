# SignBridge Studio & Smart Table Platform

**SignBridge** is a modern software engineering and AI studio that transforms ambitious ideas into intelligent, scalable digital products through software engineering, AI, cloud, IoT, and emerging technologies.

This repository contains the front-end application for the SignBridge Studio portfolio and the SignBridge Smart Table product showcase. Built with cutting-edge web technologies, it features a premium aesthetic, advanced animations, and WebGL integration to deliver a high-end digital experience.

## Features

- **Interactive UI/UX**: Ultra-clean luxury custom cursor, dynamic spectrum shifting (press Spacebar to shift themes), and magnetic UI elements.
- **WebGL & Canvas Animations**: Integrated `NetworkCanvas` and 3D visual effects using Three.js and Ogl.
- **Comprehensive Studio Showcase**: Detailed sections for Capabilities, R&D Lab (including IoT, Edge AI, and Automation), Process Timeline, Team, and Vision.
- **Smart Table Product Integration**: Dedicated product page for the SignBridge NFC Menu Starter Kit, complete with a video demo and product request form.
- **Performance Optimized**: Built with React 19, Vite, and Tailwind CSS v4 for rapid development and optimized production builds.

## Tech Stack

- **Framework**: [React 19](https://react.dev/) via [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **3D / WebGL**: [Three.js](https://threejs.org/) & [Ogl](https://github.com/oframe/ogl)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend / Database Integration**: [Supabase](https://supabase.com/)

## Project Structure

```text
├── index.html           # Main HTML entry point
├── package.json         # Dependencies and project scripts
├── vite.config.js       # Vite build and plugin configuration
├── public/              # Static assets (images, videos)
└── src/                 # Source code
    ├── components/      # Reusable UI components (Hero, Navbar, NetworkCanvas, etc.)
    ├── data/            # Static data configurations (e.g., galleryData.js)
    ├── lib/             # Utility functions and library wrappers (e.g., supabase.js)
    ├── pages/           # Route views (HomePage.jsx, ProductPage.jsx)
    ├── App.jsx          # Application root, routing, and global state (Spectrum shifting)
    ├── main.jsx         # React DOM rendering
    └── style.css        # Global CSS, Tailwind entry, and custom animations
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd "Files (1)/Ongoing"
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Copy the `.env.example` file to `.env` and fill in the necessary keys (e.g., for Supabase integration).

   ```bash
   cp .env.example .env
   ```

### Development Server

To start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Build for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Cloudflare Deployment

This repository is pre-configured for seamless deployment to **Cloudflare Pages** and **Cloudflare Workers**.

### Option A: Cloudflare Pages (Recommended via Git)

1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Select repository: `Suryamuruganvijayalakshmi/SignBridge`.
3. Configure build settings:
   - **Framework preset**: `Vite` (or `None`)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave empty or `/`)
4. Click **Save and Deploy**.
   - Cloudflare Pages will automatically read `.nvmrc` (Node 20), build the project, process `_redirects` (SPA 200 rewrites), and serve the site with optimal cache headers from `_headers`.

### Option B: Cloudflare CLI (Wrangler)

Deploy directly from terminal:

```bash
# Deploy to Cloudflare Pages
npm run deploy:pages

# Or deploy to Cloudflare Workers (Static Assets)
npm run deploy
```

## Special Features

- **Spectrum Shifting**: The application features a dynamic color palette system. Pressing the `Spacebar` cycles through different neon spectrum themes (e.g., Electric Iris, Cyber Violet, Deep Indigo, Vibrant Amber).
- **Smooth Animations**: Uses the Intersection Observer API for scroll reveals and GSAP/Framer Motion for complex sequenced animations.
- **R&D Visuals**: Custom CSS-based representations for hardware projects like the ESP32 TinyML chip.

## License

*Private and Confidential.* All rights reserved by SignBridge.
