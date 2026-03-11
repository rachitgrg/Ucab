# 🚕 Ucab - Full-Stack MERN Cab Booking Application

Ucab is a modern, responsive, full-stack cab booking platform built with the MERN stack (MongoDB, Express.js, React, Node.js). It provides a complete experience for Riders, Drivers, and Administrators with real-time tracking, beautiful UI components, and secure JWT-based authentication.

![Ucab Platform](https://ucab.com/placeholder-image-if-you-want-to-add-one.png)

## ✨ Features

*   **Role-Based Access Control:** Separate dashboards and functionalities for Users (Riders), Drivers, and Admins.
*   **Real-Time Tracking Map:** Interactive mapping using Leaflet.js with live simulated driver movement.
*   **Dynamic Fare Estimation:** Calculates distance and fare based on pickup/dropoff coordinates via Haversine formula.
*   **Secure Authentication:** JWT tokens and bcrypt password hashing.
*   **Comprehensive Booking Flow:** Location selection, cab type choosing (Economy, Luxury, EV), and ride confirmation.
*   **Driver Operations:** Availability toggling, ride acceptance, OTP verification, and ride completion.
*   **Admin Dashboard:** Platform statistics, user/driver management, and ride oversight.
*   **Stunning UI/UX:** Premium dark theme with vibrant accents custom-built with vanilla CSS and animations.

## 🚀 Live Demo Credentials

If you have hosted the backend and frontend, you can use these demo accounts to explore the different roles:

**1. Administrator**
*   **Email:** `admin@ucab.com`
*   **Password:** `admin123`
*   *Access the master dashboard to manage users, verify drivers, and view platform statistics.*

**2. User (Rider)**
*   **Email:** `user@ucab.com`
*   **Password:** `user1234`
*   *Book new rides, view ride history, track active cabs, and process payments.*

**3. Driver**
*   **Email:** `driver@ucab.com`
*   **Password:** `driver123`
*   *Toggle online status, accept incoming ride requests, enter OTPs, and complete trips.*

## 🛠️ Technology Stack

*   **Frontend:** React.js, Vite, React Router, Axios, React Toastify, Leaflet/React-Leaflet
*   **Backend:** Node.js, Express.js, Mongoose
*   **Database:** MongoDB Atlas
*   **Styling:** Custom CSS (Dark Theme System)

## 💻 Local Testing & Installation

To run this application locally on your machine:

### 1. Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the backend folder and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```
4. Run the seed script to generate the demo accounts: `npm run seed`
5. Start the server: `npm run dev`

### 2. Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Ensure the `baseURL` in `src/api/axios.js` points to your backend (e.g., `http://localhost:5000/api`).
4. Start the development server: `npm run dev`

Open `http://localhost:5173` in your browser to start using Ucab!
