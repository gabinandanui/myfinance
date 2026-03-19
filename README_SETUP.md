# MyFinance - Personal Expense Tracker

A full-stack web application for tracking personal expenses with MongoDB backend and React frontend.

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS + Material-UI
- **Backend**: Express.js + MongoDB
- **Deployment**: Vercel (Serverless)

## Quick Start

### Prerequisites
- Node.js >= 18.x
- MongoDB connection string

### Installation

```bash
# Install all dependencies (root, backend, and frontend)
npm run install-all

# Or install individually:
npm install
npm install --workspace=backend
npm install --workspace=fin
```

### Development

```bash
# Start both frontend and backend in development mode
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### Build

```bash
npm run build
```

## Deployment to Vercel

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

### Quick Setup:

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`
4. Deploy! (automatic on push)

## Project Structure

```
.
├── api/                      # Vercel serverless functions
│   └── index.js
├── backend/                  # Express.js backend
│   ├── server.js
│   ├── package.json
│   └── api/
│       └── index.js
├── fin/                      # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
├── vercel.json              # Vercel configuration
└── package.json             # Root package (monorepo)
```

## API Endpoints

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api` - Health check

## Environment Variables

Create a `.env` file in the root directory (see `.env.example`):

```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/MyExpenseDB
NODE_ENV=development
VITE_API_URL=http://localhost:4000/api
```

## Features

- ✅ Add, edit, delete expenses
- ✅ View expense history
- ✅ Filter by date
- ✅ Responsive UI with Material-UI
- ✅ MongoDB persistent storage
- ✅ CORS enabled for local development
- ✅ Production-ready serverless deployment

## License

ISC
