<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2563eb,100:7c3aed&height=200&section=header&text=SaaS%20Dashboard&fontSize=60&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Full-Stack%20Analytics%20Platform&descAlignY=60&descColor=e0e7ff" width="100%"/>

<br/>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=2563EB&center=true&vCenter=true&width=600&lines=Full-Stack+SaaS+Dashboard;React+%2B+Node.js+%2B+MongoDB;JWT+Auth+%26+Role-Based+Access;Real-Time+Metrics+%26+Charts;Dark+Mode+Supported)](https://git.io/typing-svg)

<br/>

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)

</div>

---

## Overview

A production-style SaaS analytics dashboard that simulates the kind of internal tool used by companies like Stripe, Vercel, and Mixpanel. Built end-to-end with a React frontend, Express REST API, and MongoDB database — covering everything from auth to charts to role-based access control.

---

## Features

| Feature | Description |
|---|---|
| **JWT Authentication** | Register & login with tokens stored in localStorage |
| **Role-Based Access** | Admin sees all users; viewer sees only their data |
| **Protected Routes** | Unauthenticated users are redirected to `/login` |
| **Analytics Dashboard** | Stat cards for users, revenue, sessions & growth |
| **Revenue Chart** | 12-month area chart powered by Recharts |
| **Activity Chart** | Weekly user & session bar chart |
| **Users Table** | Admin-only page listing all registered users |
| **Dark Mode** | Toggle persisted to localStorage |
| **Responsive Layout** | Works on mobile, tablet, and desktop |

---

## Tech Stack

<div align="center">

### Frontend
[![My Skills](https://skillicons.dev/icons?i=react,vite,tailwind,js)](https://skillicons.dev)

### Backend
[![My Skills](https://skillicons.dev/icons?i=nodejs,express,mongodb)](https://skillicons.dev)

### Tools
[![My Skills](https://skillicons.dev/icons?i=git,github,vscode)](https://skillicons.dev)

</div>

---

## Project Structure

```
saas-dashboard/
├── client/                     # React frontend (Vite)
│   └── src/
│       ├── components/
│       │   ├── Charts/         # RevenueChart, ActivityChart
│       │   ├── Layout/         # Sidebar, Navbar, Layout
│       │   └── UI/             # StatCard, LoadingSpinner
│       ├── context/            # AuthContext, ThemeContext
│       ├── pages/              # Dashboard, Login, Register, Users, Settings
│       ├── routes/             # ProtectedRoute
│       └── services/           # Axios API instance
│
└── server/                     # Node.js + Express API
    └── src/
        ├── config/             # MongoDB connection
        ├── middleware/         # JWT protect, adminOnly
        ├── models/             # User schema (bcrypt)
        └── routes/             # auth, users, metrics
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running on `localhost:27017`

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/2000090079/saas-dashboard.git
cd saas-dashboard
```

**2. Start the backend**
```bash
cd server
npm install
npm run dev
```
Server runs at `http://localhost:5000`

**3. Start the frontend**
```bash
cd client
npm install
npm run dev
```
App runs at `http://localhost:5173`

### First Run
- Open `http://localhost:5173/register`
- The **first user to register automatically becomes Admin**
- Subsequent users are assigned the Viewer role

---

## API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create new account |
| POST | `/api/auth/login` | Public | Login & receive JWT |
| GET | `/api/auth/me` | Protected | Get current user |
| GET | `/api/users` | Admin only | List all users |
| GET | `/api/metrics/summary` | Protected | Dashboard stats |
| GET | `/api/metrics/revenue` | Protected | Monthly revenue data |
| GET | `/api/metrics/activity` | Protected | Weekly activity data |

---

## Environment Variables

Create a `.env` file inside the `server/` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/saas-dashboard
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
```

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:7c3aed,100:2563eb&height=120&section=footer" width="100%"/>

</div>
