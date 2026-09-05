# Taskflow

A full-stack task manager built with the MERN stack.

Taskflow lets users create an account, manage their tasks, track progress, and keep everything organized through a simple dashboard.

## Features

- User authentication with JWT
- Create, edit, complete, and delete tasks
- Task filtering and dashboard statistics
- User-specific task data
- Persistent MongoDB storage
- Responsive, minimal UI

## Tech Stack

**Frontend:** React, Vite, CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB + Mongoose  
**Auth:** JWT, bcrypt  
**Deployment:** Vercel + Render + MongoDB Atlas

## Structure

```text
TaskManager-Major-Project/
├── frontend/    # React + Vite
├── backend/     # Express REST API
└── package.json

Run Locally
git clone https://github.com/mrrishi0234/TaskManager-Major-Project.git
cd TaskManager-Major-Project
npm run install:all

Create backend/.env:

MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000

Then run:

npm run server
npm run client
Deployment

The frontend is deployed on Vercel and the Express API runs on Render, with MongoDB Atlas handling persistent storage.
