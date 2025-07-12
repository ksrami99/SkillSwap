# SkillSwap Frontend

A modern, polished React frontend for the SkillSwap platform - a skill exchange application where users can connect and swap skills with each other.

## ✨ Features

### 🎨 Enhanced UI/UX
- **Modern Design**: Clean, professional interface with gradient backgrounds and glass effects
- **Responsive Layout**: Fully responsive design that works on all devices
- **Smooth Animations**: Framer Motion animations for delightful user interactions
- **Loading States**: Beautiful loading spinners and skeleton screens
- **Toast Notifications**: Real-time feedback with react-hot-toast

### 🔐 Authentication
- **Secure Login/Register**: Enhanced forms with password visibility toggle
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Session Management**: Persistent login state with token management
- **Error Handling**: Comprehensive error messages and validation

### 📊 Dashboard
- **User Statistics**: Overview of swap requests, ratings, and activity
- **Quick Actions**: Easy access to common tasks
- **Recent Activity**: Timeline of recent swap requests
- **Visual Analytics**: Beautiful stat cards with icons

### 👥 User Management
- **Profile System**: Detailed user profiles with skills and availability
- **Skill Tags**: Visual skill tags for offered and wanted skills
- **Search & Filter**: Advanced search by skills and availability
- **User Discovery**: Browse and connect with other users

### 💬 Swap Requests
- **Request System**: Send and manage skill swap requests
- **Status Tracking**: Track request status (pending, accepted, completed)
- **Messaging**: Built-in messaging system for communication
- **Feedback System**: Rate and review completed swaps

### 🎯 Additional Features
- **404 Page**: Custom error page with helpful navigation
- **Loading Components**: Reusable loading states throughout the app
- **Mobile Navigation**: Collapsible mobile menu
- **Accessibility**: ARIA labels and keyboard navigation
- **Performance**: Optimized with React 19 and Vite

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Tech Stack

- **React 19**: Latest React with concurrent features
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Lucide React**: Beautiful icons
- **React Hot Toast**: Toast notifications
- **Axios**: HTTP client for API calls

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout with navigation
│   ├── Loading.jsx     # Loading spinner component
│   └── Modal.jsx       # Modal dialog component
├── context/            # React context providers
│   └── AuthContext.jsx # Authentication state management
├── pages/              # Page components
│   ├── Dashboard.jsx   # User dashboard
│   ├── Home.jsx        # Landing page
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── Profile.jsx     # User profile
│   ├── Users.jsx       # User discovery
│   ├── SwapRequests.jsx # Request management
│   ├── FeedbackPage.jsx # Feedback system
│   └── NotFound.jsx    # 404 error page
├── routes/             # Route components
│   └── ProtectedRoute.jsx # Route protection
├── api/                # API configuration
│   └── axios.js        # Axios instance setup
├── utils/              # Utility functions
├── App.jsx             # Main app component
├── main.jsx            # App entry point
└── index.css           # Global styles
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Secondary**: Indigo (#6366F1)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Neutral**: Gray scale

### Components
- **Buttons**: Primary, secondary, and danger variants
- **Cards**: Consistent card styling with hover effects
- **Inputs**: Styled form inputs with icons
- **Modals**: Overlay dialogs for focused interactions
- **Loading**: Animated spinners and skeleton screens

### Animations
- **Page Transitions**: Smooth page-to-page navigation
- **Component Mounting**: Staggered animations for lists
- **Hover Effects**: Subtle interactions on interactive elements
- **Loading States**: Rotating spinners and progress indicators

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3000/api
```

### Tailwind Configuration
The project uses a custom Tailwind configuration with:
- Custom color palette
- Responsive breakpoints
- Custom component classes
- Animation utilities

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Framer Motion for smooth animations
- Lucide for beautiful icons
- The open-source community for inspiration
