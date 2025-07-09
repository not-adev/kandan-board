# 📝 Full Stack Todo Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![Express](https://img.shields.io/badge/Backend-Express.js-green?logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?logo=mongodb)
![Socket.IO](https://img.shields.io/badge/RealTime-Socket.IO-black?logo=socket.io)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-blue?logo=tailwindcss)

---

## 📋 Introduction
This application manages a list of todos, categorizing them into **Pending**, **In Progress**, and **Completed**. It uses separate React `useState` hooks to maintain arrays for each status type.

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm i
``` 

# Run your front end 
```bash
npm run dev
```
# Run your backend 
```bash 
cd back-end
npm run start
```

## 🔐 Signup and Login
- Secure user authentication system
- Frontend form for data entry
- Backend validation with database integration
- Cookie management and password protection

---

## 📦 Fetching Todos
- Todos are fetched via `GET` API call on component mount or user actions
- Retrieved todos are filtered and stored in separate state arrays:
  - `Pending`
  - `In Progress`
  - `Completed`

---

## 💾 Saving Todos
- Users can create new todos using an interactive frontend form
- Data is emitted to the backend using Socket.IO
- Backend stores the todo in the database
- Server broadcasts updates to all connected clients

---

## 🛠️ Deleting and Editing Todos
### ➤ Emit Events
- `deleteTodo` / `editTodo` event emitted with `todoId`

### ➤ Frontend
- Optimistic update: Removes or updates todo in local state immediately
- If editing, form is populated with existing todo values

### ➤ Backend
- Handles deletion or update in the database
- Sends `todoDeleted` broadcast to all clients

### ➤ All Clients
- Automatically update their UI by removing or updating the modified todo

---

## 🧠 Smart Assign
- Each user has a `tasks` field in their database entry (array of assigned task IDs)
- Server fetches users sorted by ascending task count
- Frontend dropdown for "Assign To" displays users with fewer tasks at the top

---

