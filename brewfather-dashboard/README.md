# 🍺 Brewfather Dashboard

A beautiful, real-time dashboard for monitoring your Brewfather fermenting batches.

## Files

- **`brewfather-dashboard.html`** - Production version that uses the serverless API (recommended)
- **`brewfather-dashboard-standalone.html`** - Standalone version for local testing only
- **`api/brewfather.js`** - Serverless function for batches endpoint
- **`api/readings.js`** - Serverless function for readings endpoint
- **`.env.example`** - Template for environment variables

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

### Step 3: Deploy

#### Option A: Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel

# Follow the prompts and set environment variables when asked
```

#### Option B: Deploy to Netlify

```bash
# Install Netlify CLI (if not already installed)
npm i -g netlify-cli

# Deploy
netlify deploy

# Follow the prompts
```

#### Option C: Local Testing (Standalone Version)

⚠️ **For testing only - exposes credentials in browser!**

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
- Use `brewfather-dashboard.html` (requires serverless functions)
- Store credentials in environment variables on your deployment platform
- API credentials never exposed to the browser
- Never commit your `.env` file to git

⚠️ **For Local Testing Only:**
- `brewfather-dashboard-standalone.html` requires manual credential entry
- Credentials are exposed in browser JavaScript
- Only use this for local testing on your own machine

## Tech Stack

- Vanilla JavaScript
- HTML5 + CSS3
- Brewfather API v1
- Node.js (for serverless function)

## License

MIT

