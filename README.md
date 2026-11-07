# New Life Care Diagnostic Centre — Full Stack Website

A professional, SEO-friendly website for New Life Care Diagnostic Centre, Midnapore.

## Architecture

```
Frontend (React/Vite) → Our Backend (Node/Express) → LIS Main Server
```

The backend acts as a secure **middleware/proxy** between the frontend and the main hospital LIS server. The frontend never directly communicates with the LIS server.

## Project Structure

```
mahamaya/
├── frontend/          # React + Vite + Tailwind CSS v4
│   ├── src/
│   │   ├── pages/     # All pages (8 pages)
│   │   ├── components/ # Shared components
│   │   └── services/  # API service layer
└── backend/           # Node.js + Express + MongoDB
    ├── models/        # MongoDB schemas
    ├── middleware/    # Rate limiter, etc.
    ├── controllers/   # Business logic
    ├── routes/        # Express routes
    └── utils/         # LIS client (Axios instance)
```

## Setup

### Backend
```bash
cd backend
npm install
# Copy .env.example to .env and fill in your values
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## LIS Integration

Edit `backend/utils/lisClient.js` to point to the main LIS server.

For each endpoint, search for `// TODO: Replace with actual LIS call` comments in the controllers.

Set in `.env`:
```
LIS_BASE_URL=https://your-lis-server.com
LIS_API_KEY=your_api_key
```

## Pages

| Route | Description |
|---|---|
| `/` | Home page |
| `/departments` | Medical departments |
| `/doctors` | Doctors & timetable |
| `/diagnostics` | Test catalog & packages |
| `/book-consultation` | Book doctor appointment |
| `/book-collection` | Book home sample collection |
| `/reports` | Patient report portal |
| `/contact` | Contact us |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/bookings` | Create booking (consultation or collection) |
| GET | `/api/bookings/:id` | Get booking by ID |
| GET | `/api/reports` | Fetch patient reports (proxied from LIS) |
| GET | `/api/reports/download/:id` | Download report PDF (proxied from LIS) |
| GET | `/api/tests` | Get test catalog (from LIS or mock) |
| GET | `/api/tests/packages` | Get health packages |
| GET | `/api/doctors` | Get doctor list |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/health` | Health check |

