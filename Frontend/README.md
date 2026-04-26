# Vacations App

Full-stack web application for browsing, managing, and liking vacation destinations.

## Technologies

- **Frontend**: React 19, TypeScript, Vite, Redux
- **Backend**: Node.js, Express, TypeScript
- **Database**: MySQL 8.0
- **Deployment**: Docker + docker-compose + Nginx

## Getting Started

### Development

1. Install dependencies:
   ```bash
   cd Backend && npm install
   cd ../Frontend && npm install
   ```

2. Start the backend:
   ```bash
   cd Backend && npm start
   ```

3. Start the frontend:
   ```bash
   cd Frontend && npm start
   ```

Frontend runs on `http://localhost:5173`, Backend on `http://localhost:4000`.

### Production (Docker)

```bash
docker compose up --build
```

App available at `http://localhost:3000`.

## Features

- User registration and login with JWT authentication
- Browse vacations with filtering (all / liked / active / upcoming)
- Like and unlike vacations
- Admin dashboard: add, edit, delete vacations
- Admin reports: likes chart and CSV export
- AI vacation recommendations
- Pagination (9 vacations per page)

## Default Admin Account

- Email: `admin@vacation.com`
- Password: `Admin123`
