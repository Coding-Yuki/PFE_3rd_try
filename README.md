# University Social Network (Réseau Social Universitaire)

A complete social media platform built for university students using Next.js 14, TypeScript, Prisma, and SQLite.

## 🚀 Features Implemented

### Authentication System
- ✅ User registration with student information
- ✅ Secure login with password hashing
- ✅ Session management with cookies
- ✅ Protected routes with middleware

### Social Features
- ✅ Create and view posts
- ✅ Like/unlike posts with real-time updates
- ✅ Add comments to posts
- ✅ User profiles with posts and statistics
- ✅ Responsive design for all devices

### UI/UX
- ✅ Modern University Blue theme
- ✅ Three-column layout (Sidebar - Main - Rightbar)
- ✅ Professional academic design
- ✅ Lucide React icons throughout
- ✅ Smooth transitions and hover effects

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite with Prisma
- **Authentication**: Cookie-based sessions with bcryptjs
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom University theme

## 🗄 Database Schema

### User Model
- id, name, email, password, studentId, major, bio, avatarUrl, createdAt

### Post Model
- id, content, authorId, createdAt, likes (relation), comments (relation)

### Like Model
- id, userId, postId (unique constraint)

### Comment Model
- id, content, userId, postId, createdAt

## 🎯 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up database**:
   ```bash
   npx prisma db push
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Open http://localhost:3000
   - Register a new account
   - Login and start using the platform

## 🧪 Testing

The application includes comprehensive testing:
- Authentication flow
- Post creation and interactions
- Profile viewing
- API endpoint functionality

## 🎨 Design System

- **Primary Color**: Blue-700 (University Blue)
- **Background**: Gray-50 (Clean academic feel)
- **Cards**: White with subtle shadows
- **Typography**: Clean, readable fonts
- **Icons**: Consistent Lucide React icons

## 🔒 Security Features

- Password hashing with bcryptjs
- HTTP-only cookies for sessions
- Protected API routes
- Input validation and sanitization
- CSRF protection through Next.js

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interactions
- Adaptive layouts

## 🚀 Deployment Ready

The application is production-ready with:
- Optimized build process
- Environment variable support
- Error handling
- Performance optimizations

---

**Built with ❤️ for university students worldwide**
