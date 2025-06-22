
# MERN Stack Chat App 💬

A real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io.
Features user authentication, group and private messaging, notifications, and a modern UI with Chakra UI.

---

## Features

- 🔒 User authentication (JWT)
- 💬 Real-time messaging (private & group)
- 📨 Notifications for new messages
- 👥 User search and chat creation
- 🖼️ Profile and group chat management
- ⚡ Modern responsive UI (Chakra UI)
- 🌐 RESTful API with Express & MongoDB

---

## Tech Stack

- **Frontend:** React, Chakra UI, Axios, Socket.io-client
- **Backend:** Node.js, Express, MongoDB, Mongoose, Socket.io
- **Authentication:** JWT, bcryptjs
- **Other:** dotenv, cors, multer (for profile pics), etc.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/mern-chat-app.git
   cd mern-chat-app
   ```
2. **Install backend dependencies:**

   ```sh
   cd backend
   npm install
   ```
3. **Install frontend dependencies:**

   ```sh
   cd ../frontend
   npm install
   ```
4. **Set up environment variables:**

   - Create a `.env` file in `/backend`:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```
5. **Run the backend server:**

   ```sh
   npm run server
   ```

   (or `npm start` if that's your script)
6. **Run the frontend dev server:**

   ```sh
   cd ../frontend
   npm run dev
   ```
7. **Visit the app:**

   - Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Folder Structure

```
mern-chat-app/
  backend/
    models/
    routes/
    controllers/
    ...
  frontend/
    src/
      components/
      pages/
      context/
      ...
```

---

## Troubleshooting

- **Blank page after login:**Make sure your context/provider updates user state immediately after login/signup (see `/src/context/ChatProvider.jsx`).
- **Socket.io issues:**Ensure both backend and frontend are running and using the correct endpoints.
- **MongoDB connection errors:**
  Double-check your `MONGO_URI` in `.env`.

---

## License

MIT

---

## Author

[Your Name](https://github.com/yourusername)
