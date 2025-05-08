# Property Listings Web Application

A full-stack web application for property listings built with React, Express, and MySQL.

## Features

- View property listings with images, titles, locations, and prices
- View detailed information about each property
- Add new property listings
- Responsive design for mobile and desktop

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Material UI
- Backend: Express.js, MySQL
- Development: Node.js, nodemon

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd property-listings
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
- Create a copy of `.env.example` as `.env`
- Update the database credentials in `.env`
- Run the schema.sql file in your MySQL server:
```bash
mysql -u your_username -p < server/config/schema.sql
```

4. Start the development servers:

In one terminal:
```bash
npm run server:dev
```

In another terminal:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure the build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Backend (Railway)
1. Create a new project on Railway
2. Connect your repository
3. Add MySQL service
4. Configure environment variables
5. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
