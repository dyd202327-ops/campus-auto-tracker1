# campus-auto-tracker

MERN stack project for campus auto/shuttle tracking with Leaflet and Socket.IO.

## Setup

- Backend:
  - cd backend
  - copy .env.example to .env and paste your MongoDB Atlas URI into MONGO_URI
  - npm install
  - npm run seed
  - npm run dev

- Frontend:
  - cd frontend
  - npm install
  - set environment variables if needed:
    - REACT_APP_API_BASE (e.g. http://localhost:5000/api)
    - REACT_APP_SOCKET_URL (e.g. http://localhost:5000)
  - npm start
