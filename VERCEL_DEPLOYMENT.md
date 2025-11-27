# Vercel Deployment Guide

## Project Structure
- **Frontend**: `/fin` - React + Vite app
- **Backend**: `/backend` - Express.js serverless functions
- **API Routes**: `/api` - Serverless function entry point

## Deployment Steps

### 1. Connect GitHub Repository to Vercel
- Go to [vercel.com](https://vercel.com)
- Click "Add New" → "Project"
- Select your GitHub repository
- Import the project

### 2. Configure Environment Variables
In Vercel project settings, add:
```
MONGODB_URI: your_mongodb_connection_string
NODE_ENV: production
```

### 3. Build & Deploy Configuration
Vercel will automatically detect the configuration from `vercel.json`:
- **Build Command**: `npm run build`
- **Output Directory**: `.`
- **API Routes**: `/api` (serverless functions)

### 4. Frontend API Configuration
The frontend will automatically use the serverless functions at `/api` path.

## Local Development

### Install Dependencies
```bash
npm run install-all
```

### Run Dev Server
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## Project Structure After Setup
```
.
├── api/
│   └── index.js              # Vercel serverless entry point
├── backend/
│   ├── package.json
│   ├── server.js             # Express app
│   └── api/
│       └── index.js
├── fin/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js        # Frontend API client
│   │   └── ...
│   └── package.json
├── vercel.json               # Vercel configuration
├── package.json              # Root package (monorepo)
└── .env.example             # Example environment variables
```

## Important Notes

1. **Monorepo Setup**: Using npm workspaces to manage both frontend and backend
2. **Serverless Functions**: Backend runs as `/api/*` routes in Vercel
3. **API URL**: Frontend uses `/api` path (relative URL) that works both locally and in production
4. **Environment Variables**: Must be set in Vercel dashboard before deployment
5. **MongoDB**: Ensure your MongoDB connection allows Vercel's IP addresses

## Troubleshooting

### CORS Issues
If you see CORS errors, check `backend/server.js` and update the `cors` origin to include your Vercel domain:
```javascript
origin: [
  'http://localhost:5173',
  'https://your-vercel-domain.vercel.app'
]
```

### API Not Found
Ensure the `/api/index.js` file exists and properly exports the Express app.

### Build Failures
- Check `npm run build` works locally
- Ensure all dependencies are in `package.json`
- Verify environment variables are set in Vercel dashboard
