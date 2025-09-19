# 🧑‍💻 EasyJob – Job Finder Platform  

A full-stack job finding platform built with **React**, **Express.js**, **MongoDB**, and **JWT authentication**.  
It allows users to register/login, browse and create job posts, mark posts as favorites, and manage their profile.

---

## 🚀 Features
- 🔐 **User Authentication**: Register, login, JWT-based auth.  
- 👤 **Profile Page**: Manage your personal details and see your posts.  
- 🏠 **Home Page**: Browse all job posts.  
- ❤️ **Favorites**: Save/unfavorite jobs with a single click.  
- 📝 **Create Post**: Share job opportunities with the community.  
- 🔎 **Post Detail Page**: View individual job posts.  
- 🎨 **UI/UX**: Modern responsive design with TailwindCSS.  
- 📦 **API Services**: Centralized Axios instance with token interceptors.  

---

## 🛠️ Tech Stack
### Frontend
- React (Vite or CRA depending on your setup)
- React Router v6
- Axios (with interceptors for token handling)
- TailwindCSS
- SweetAlert2 (for notifications)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- bcrypt for password hashing

---

## 📂 Project Structure
```bash
easyjob/
│
├── backend/
│   ├── controllers/       # auth, posts, favorites
│   ├── middleware/        # JWT auth
│   ├── models/            # User, Post, Favorite
│   ├── routes/            # API routes
│   └── server.js          # Express entrypoint
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Header, Footer, PostCard, AboutUs, etc.
│   │   ├── page/          # LoginPage, RegisterPage, HomePage, ProfilePage, FavoritePage
│   │   ├── services/      # api.js, auth.js, favoriteService.js, postService.js
│   │   ├── App.jsx        # Routes + Layout
│   │   └── main.jsx       # React root
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR-USERNAME/easy-job.git
cd easy-job
```

### 2. Backend setup
```bash
cd backend
npm install
```
Create a `.env` file:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/easyjob
JWT_SECRET=supersecretkey
```
Run the backend:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
npm install
```
Create a `.env` file:
```env
VITE_API_URL=http://localhost:3000/api
```
Run the frontend:
```bash
npm run dev
```

---

## 🔑 API Endpoints

### Auth
- `POST /api/users` → Register
- `POST /api/users/login` → Login
- `GET /api/users/:id` → Get user info  

### Posts
- `GET /api/posts` → Get all posts
- `POST /api/posts` → Create post
- `GET /api/posts/:id` → Get single post  

### Favorites
- `GET /api/favorites` → Get user favorites
- `POST /api/favorites/add/:id` → Add post to favorites
- `POST /api/favorites/remove/:id` → Remove post from favorites  

---

## 📸 Screenshots (optional)
- Landing Page  
- Login / Register Page  
- Home with Posts  
- Post Detail  
- Favorites Page  
- Profile Page  

---

## 🤝 Contributing
1. Fork the project  
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)  
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)  
4. Push to the branch (`git push origin feature/AmazingFeature`)  
5. Open a Pull Request  
