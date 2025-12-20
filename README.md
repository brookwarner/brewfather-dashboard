# 🍺 Brewfather Dashboard

A beautiful, real-time dashboard for monitoring your Brewfather fermenting batches.

## 📸 Screenshots

### Dashboard Views

**Light Theme**
![Light Theme Dashboard](Screenshot%202025-11-04%20at%2014.02.27.png)

**Dark Theme (Brewfather)**
![Dark Theme Dashboard](Screenshot%202025-11-04%20at%2014.02.37.png)

**Multi-Status View with Archived Batches**
![Multi-Status View](Screenshot%202025-11-04%20at%2014.02.56.png)

### Setup Wizard

**Production Mode Setup**
![Setup - Production Mode](Screenshot%202025-11-04%20at%2014.03.27.png)

**Standalone Mode Setup**
![Setup - Standalone Mode](Screenshot%202025-11-04%20at%2014.03.32.png)

## ⚡ First Time Setup

**New users:** Open `setup.html` in your browser for a guided setup wizard! 

The setup page will help you:
- Get your Brewfather API credentials
- Configure them for your chosen mode (Production or Standalone)
- Test your credentials before saving

## Files

- **`brewfather-dashboard.html`** - Production version that uses the serverless API (recommended)
- **`brewfather-dashboard-standalone.html`** - Standalone version for local testing only
- **`setup.html`** - Setup wizard for first-time configuration
- **`api/brewfather.js`** - Serverless function for batches endpoint
- **`api/readings.js`** - Serverless function for readings endpoint
- **`.env.example`** - Template for environment variables
- **`Dockerfile`** - Docker container configuration
- **`docker-compose.yml`** - Docker Compose setup for easy deployment

## 🚀 Quick Start

### Step 1: Get Your Brewfather API Credentials

1. Go to [Brewfather Settings](https://web.brewfather.app/tabs/settings)
2. Navigate to the **API** section
3. Copy your **User ID** and **API Key**

### Step 2: Configure Environment Variables

#### For Local Development:

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your credentials
BREWFATHER_USER_ID=your_actual_user_id
BREWFATHER_API_KEY=your_actual_api_key
```

#### For Vercel Deployment:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   - `BREWFATHER_USER_ID` = your user ID
   - `BREWFATHER_API_KEY` = your API key

#### For Netlify Deployment:

1. Go to your site settings
2. Navigate to **Environment Variables**
3. Add the same variables as above

### Step 3: Run Locally or Deploy

#### Option A: Run Locally with Node.js

Simple local development server that runs the production version:

```bash
# Install dependencies
npm install

# Make sure you have a .env file with your credentials
# (Copy .env.example to .env and add your keys)

# Start the server
npm run dev

# Open in browser: http://localhost:3000
```

This will:
- Run your serverless functions locally
- Load environment variables from `.env`
- Serve the production HTML file
- Keep credentials secure (not exposed in browser)

#### Option B: Deploy to Vercel (Recommended for Production)

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel

# Follow the prompts and set environment variables when asked
```

#### Option C: Deploy to Netlify

```bash
# Install Netlify CLI (if not already installed)
npm i -g netlify-cli

# Deploy
netlify deploy

# Follow the prompts
```

#### Option D: Run with Docker

Run the dashboard in a Docker container for easy deployment and isolation:

**Using Docker Compose (Recommended):**

```bash
# Make sure you have a .env file with your credentials
# (Copy .env.example to .env and add your keys)

# Build and start the container
docker-compose up -d

# Open in browser: http://localhost:3000

# To stop the container
docker-compose down
```

**Using Docker directly:**

```bash
# Build the image
docker build -t brewfather-dashboard .

# Run the container (mounting your .env file)
docker run -d \
  --name brewfather-dashboard \
  -p 3000:3000 \
  -v "$(pwd)/.env:/app/.env:ro" \
  brewfather-dashboard

# Open in browser: http://localhost:3000

# To stop the container
docker stop brewfather-dashboard
docker rm brewfather-dashboard
```

This will:
- Run the dashboard in a secure, isolated container
- Load environment variables from your `.env` file
- Expose the service on port 3000
- Keep credentials secure (not exposed in browser)
- Include health checks for container monitoring

#### Option E: Local Testing (Standalone Version - No Server Required)

⚠️ **For testing only - exposes credentials in browser!**

**Note:** The standalone version requires hardcoded credentials because browser JavaScript cannot access environment variables. Environment variables only work with server-side code (Node.js). For secure credential management, use Option A, B, or D above.

1. Edit `brewfather-dashboard-standalone.html`
2. Replace `YOUR_USER_ID_HERE` and `YOUR_API_KEY_HERE` with your actual credentials
3. Open the file in your browser:

```bash
open brewfather-dashboard-standalone.html
```

## Features

✨ **Beautiful UI**
- Modern gradient design
- Responsive cards
- Smooth animations
- Mobile-friendly

🎨 **Theme Switcher**
- **Default Theme**: Purple gradient with modern aesthetics
- **Brewfather Theme**: Dark theme matching the native Brewfather app (signature orange/amber colors)
- **Dark Theme**: Sleek blue-toned dark mode
- **Light Theme**: Clean, bright interface
- Collapsible dropdown menu (minimal space when closed)
- Dynamic chart color updates when switching themes
- Theme preference persists across sessions using localStorage

📊 **Real-time Data**
- Current batch status
- Temperature monitoring
- OG/FG readings (estimated & measured)
- Recipe details and beer styles
- Brew dates

📈 **Interactive Charts**
- Combined chart showing temperature and SG on dual Y-axes
- Real-time temperature and gravity tracking
- Target OG/FG reference lines overlaid on the chart
- Historical readings visualization using Chart.js
- Prominent display of current temperature and SG at the top of each batch card
- Chart colors automatically adapt to selected theme

⚡ **Performance**
- Smart caching (1 hour for batches, 5 minutes for readings)
- Fast load times
- Auto-refresh capability
- LocalStorage caching for standalone version

## API Configuration

### Environment Variables (Production)

Set these in your deployment platform:

```bash
BREWFATHER_USER_ID=your_user_id
BREWFATHER_API_KEY=your_api_key
```

### Query Parameters

The API endpoint supports:
- `status` - Filter by batch status (default: "Fermenting")
- `include` - Fields to include (default: "estimatedFg,estimatedOg,measuredOg,temp")

Example:
```
/api/brewfather?status=Fermenting&include=estimatedFg,estimatedOg,measuredOg,temp
```

## Security

🔒 **For Production:**
- Use `brewfather-dashboard.html` (requires serverless functions or Node.js server)
- Store credentials in environment variables on your deployment platform or `.env` file
- API credentials never exposed to the browser
- Never commit your `.env` file to git
- Docker containers provide additional isolation and security

⚠️ **For Local Testing Only:**
- `brewfather-dashboard-standalone.html` requires manual credential entry
- Credentials are exposed in browser JavaScript
- Only use this for local testing on your own machine

## Tech Stack

- Vanilla JavaScript
- HTML5 + CSS3
- Brewfather API v1
- Node.js (for serverless functions and local server)
- Docker (for containerized deployment)

## License

MIT

