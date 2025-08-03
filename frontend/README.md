# 📊 Survey Project

A full-stack survey management platform designed for creating, distributing, and analyzing surveys.  
Built with **React + TypeScript + Vite** on the frontend and a hybrid backend powered by **Node.js**, **MongoDB**, and **MySQL**.

---

## ✨ Features

- 🔐 **User Authentication** — secure login and signup  
- 📋 **Dynamic Surveys** — create, assign, and complete surveys  
- 💾 **Persistent State** — responses stored in MongoDB & MySQL  
- 📊 **Dashboard Analytics** — view progress and completion stats  
- 🗂️ **Survey Status Tracking** — *New*, *In Progress*, *Completed*  
- 🎨 **Modern UI** — clean, responsive design using Tailwind CSS  
- ⚡ **Fast Development** — powered by Vite with Hot Module Reload  

---

## 🛠️ Tech Stack

### **Frontend**
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)  
- [Vite](https://vitejs.dev/) — fast dev server & bundler  
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling  
- [React Router](https://reactrouter.com/) — routing system  
- [Jotai](https://jotai.org/) — state management  
- [React Icons](https://react-icons.github.io/react-icons/) — icons  

### **Backend**
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)  
- [MongoDB](https://www.mongodb.com/) — stores survey data & responses  
- [MySQL](https://www.mysql.com/) — handles user authentication & relational data  
- [Sequelize](https://sequelize.org/) — SQL ORM for MySQL  
- [Mongoose](https://mongoosejs.com/) — ODM for MongoDB  

---

## 📂 Project Structure

survey-project/
│
├── frontend/ # React + Vite + TS app
│ ├── src/
│ │ ├── atoms/ # Jotai state management
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # App pages (Dashboard, Login, etc.)
│ │ ├── main.tsx # React entry point
│ │ └── index.css # Global styles
│ └── vite.config.ts
│
├── backend/ # Express backend
│ ├── controllers/ # Business logic
│ ├── models/ # Sequelize & Mongoose models
│ ├── routes/ # API routes
│ ├── config/ # DB configurations
│ └── server.js # Express entry point
│
└── README.md



