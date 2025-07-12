# SkillSwap

A full-stack web application that enables users to swap skills and services with each other. Built with React, Node.js, Express, and MongoDB.

## 🌐 Live Demo

**Frontend:** [https://skill-swap-front.vercel.app/](https://skill-swap-front.vercel.app/)

## 🚀 Features

- **User Authentication**: Secure registration and login system
- **Skill Swapping**: Create and manage skill swap requests
- **User Profiles**: Detailed user profiles with skills and ratings
- **Dashboard**: Personalized dashboard for managing swaps and requests
- **Feedback System**: Rate and review other users
- **Real-time Updates**: Dynamic updates for swap requests and notifications

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud image storage
- **Zod** - Schema validation
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
SkillSwap/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── api/            # API configuration
│   │   └── routes/         # Route protection
│   ├── public/             # Static assets
│   └── package.json
├── Backend/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Custom middlewares
│   │   ├── validations/    # Input validation schemas
│   │   └── utils/          # Utility functions
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SkillSwap
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the Backend directory:
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CORS_ORIGIN=http://localhost:5173
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

5. **Run the Application**

   **Backend (Terminal 1):**
   ```bash
   cd Backend
   npm run dev
   ```

   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```

   The application will be available at:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout

### Users
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user profile
- `DELETE /api/v1/users/:id` - Delete user

### Swap Requests
- `GET /api/v1/swaps` - Get all swap requests
- `POST /api/v1/swaps` - Create new swap request
- `PUT /api/v1/swaps/:id` - Update swap request
- `DELETE /api/v1/swaps/:id` - Delete swap request

### Feedback
- `GET /api/v1/feedbacks` - Get all feedback
- `POST /api/v1/feedbacks` - Create feedback
- `PUT /api/v1/feedbacks/:id` - Update feedback

### Dashboard
- `GET /api/v1/dashboard` - Get dashboard data

## 🔧 Development

### Available Scripts

**Backend:**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Frontend Deployment (Vercel)
The frontend is deployed on Vercel and is accessible at:
**https://skill-swap-front.vercel.app/**

### Backend Deployment
The backend can be deployed on platforms like:
- **Railway**
- **Render**
- **Heroku**
- **DigitalOcean App Platform**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Karan**

---

⭐ Star this repository if you found it helpful! 