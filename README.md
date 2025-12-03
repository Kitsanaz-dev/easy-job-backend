# Easy Job — Backend

This repository contains the backend for the Easy Job project: a REST API built with Node.js, Express, MongoDB (Mongoose) and JWT authentication.

This README is focused on the backend service in this repository. If you have a separate frontend, run it alongside this backend and point it to the API base URL (default `http://localhost:3000`).

---

## Features

- User registration & login (JWT)
- CRUD for job posts
- Favorite posts per user
- Basic real-time support (Socket.IO) for presence/chat

---

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- Socket.IO for realtime events

---

## Project layout (important files)

```
easy-job-backend/
├── app.js                 # Express app and Socket.IO initialization
├── index.js               # Server entry (starts HTTP server)
├── socketio.js            # Socket.IO event handling
├── controllers/           # Request handlers (user, post, favorite)
├── models/                # Mongoose models (User, Post, Favorite)
├── routes/                # Express routes
├── config/                # DB connection and other config
├── middleware/            # Auth middleware
└── package.json
```

---

## Requirements

- Node.js 14+ (recommended)
- MongoDB (local or remote)

---

## Setup (backend)

1. Install dependencies

```bash
npm install
```

2. Create a `.env` in the project root with:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/easyjob
JWT_SECRET=your_jwt_secret_here
```

3. Run the server in development

```bash
npm run dev
```

The server listens on the port defined in `.env` (defaults to `3000`).

---

## Socket.IO (realtime)

- The backend initializes Socket.IO and exposes events. When connecting, clients should send the JWT token as part of the handshake so the server can authenticate and attach the user to the socket.

Client example (socket.io-client):

```js
const socket = io('http://localhost:3000', {
	auth: { token: YOUR_JWT }
});

socket.on('connect', () => console.log('connected', socket.id));
socket.on('user_connected', (data) => console.log('user connected', data));
socket.on('user_disconnected', (data) => console.log('user disconnected', data));
```

The server emits `user_connected` and `user_disconnected` events with basic user info.

---

## API Endpoints (summary)

### Auth
- `POST /api/users` — Register (body: `{ name, email, password }`)
- `POST /api/users/login` — Login (body: `{ email, password }`) → returns `{ token, user }`

### Posts
- `GET /api/posts` — Get all posts
- `POST /api/posts` — Create a post (protected)
- `GET /api/posts/:id` — Get single post
- `PUT /api/posts/:id` — Update post (protected, owner-only)
- `DELETE /api/posts/:id` — Delete post (protected, owner-only)

### Favorites
- `GET /api/favorites` — Get user's favorites (protected)
- `POST /api/favorites/add/:id` — Add post to favorites (protected)
- `POST /api/favorites/remove/:id` — Remove post from favorites (protected)

For precise request/response shapes, check the controllers in `controllers/`.

---

## Contributing

1. Fork
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "feat: description"`
4. Push and open a PR

---

If you want, I can also add a short Postman collection or example curl commands for each endpoint.

