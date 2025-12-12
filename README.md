# 🍬 Sweet Shop Management System

A full-stack sweet shop management application built with TDD principles, featuring comprehensive authentication, inventory management, and a beautiful candy-themed UI.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Screenshots](#screenshots)
- [My AI Usage](#my-ai-usage)

## 🎯 Overview

Sweet Shop is a modern e-commerce platform for managing and purchasing sweet treats. It includes user authentication, role-based access control (admin/user), full CRUD operations for sweets inventory, search and filtering capabilities, and a responsive, mobile-first design.

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + useReducer
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **Testing**: Vitest + React Testing Library

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

## ✨ Features

### User Features
- ✅ User registration and login with JWT authentication
- ✅ Browse sweets catalog with pagination
- ✅ Search and filter by name, category, and price range
- ✅ View detailed sweet information
- ✅ Purchase sweets with stock validation
- ✅ Real-time stock updates

### Admin Features
- ✅ Add new sweets to inventory
- ✅ Update sweet details (name, price, description, etc.)
- ✅ Delete sweets from catalog
- ✅ Restock inventory
- ✅ Manage all sweets in admin panel

### Technical Features
- ✅ TDD approach with comprehensive test coverage
- ✅ Role-based access control (USER/ADMIN)
- ✅ Protected routes and authentication middleware
- ✅ Rate limiting to prevent abuse (auth, purchase, and API endpoints)
- ✅ Input validation and error handling
- ✅ Responsive design (mobile-first)
- ✅ Toast notifications for user feedback
- ✅ Loading states and error boundaries

## 📦 Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose
- PostgreSQL 15 (if running locally without Docker)

## 🚀 Setup Instructions

### Option 1: Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/devznsh/sweet-shop.git
   cd sweet-shop
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the applications**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - PostgreSQL: localhost:5432

4. **Seed the database**
   ```bash
   docker-compose exec backend npm run prisma:seed
   ```

### Option 2: Local Development

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Run Prisma migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

6. **Seed the database**
   ```bash
   npm run prisma:seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env if needed (default: http://localhost:3000/api)
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Sweets Endpoints (Protected)

All sweets endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### Get All Sweets
```http
GET /api/sweets?page=1&limit=10
```

#### Get Single Sweet
```http
GET /api/sweets/:id
```

#### Search Sweets
```http
GET /api/sweets/search?name=chocolate&category=Chocolates&minPrice=2&maxPrice=10
```

#### Create Sweet (Admin Only)
```http
POST /api/sweets
Content-Type: application/json

{
  "name": "Chocolate Bar",
  "category": "Chocolates",
  "price": 2.99,
  "quantity": 100,
  "description": "Delicious chocolate",
  "imageUrl": "https://example.com/image.jpg"
}
```

#### Update Sweet (Admin Only)
```http
PUT /api/sweets/:id
Content-Type: application/json

{
  "name": "Updated Chocolate Bar",
  "price": 3.99
}
```

#### Delete Sweet (Admin Only)
```http
DELETE /api/sweets/:id
```

#### Purchase Sweet
```http
POST /api/sweets/:id/purchase
Content-Type: application/json

{
  "quantity": 2
}
```

#### Restock Sweet (Admin Only)
```http
POST /api/sweets/:id/restock
Content-Type: application/json

{
  "quantity": 50
}
```

### Default Credentials

After seeding the database, use these credentials:

**Admin User**
- Email: `admin@sweetshop.com`
- Password: `admin123`

**Regular User**
- Email: `user@sweetshop.com`
- Password: `user123`

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

Test Coverage:
- Authentication (registration, login, validation)
- Sweets CRUD operations
- Inventory management (purchase, restock)
- Search and filtering
- Authorization and access control

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

Test Coverage:
- Component rendering
- User interactions
- Form validation

## 📸 Screenshots

_Screenshots will be added here showing:_
- Login/Register pages
- Home page with sweets catalog
- Search and filter functionality
- Sweet details page
- Admin panel
- Purchase flow
- Mobile responsive views

## 🤖 My AI Usage

This project was built with assistance from AI tools, following transparent AI co-authorship practices.

### Tools Used
- **GitHub Copilot**: Used for code generation and assistance throughout the project

### How AI Was Used

AI tools were instrumental in accelerating development while maintaining code quality and best practices:

1. **Project Structure & Boilerplate**
   - Generated initial project structure for both backend and frontend
   - Created configuration files (TypeScript, ESLint, Jest, Vite, Tailwind)
   - Set up Docker and Docker Compose configurations
   - Generated GitHub Actions CI/CD workflow

2. **Backend Development**
   - Assisted with Prisma schema design following the requirements
   - Generated boilerplate for Express routes, controllers, and services
   - Helped implement JWT authentication and bcrypt password hashing
   - Created middleware for authentication and authorization
   - Generated Zod validation schemas
   - Assisted with error handling patterns

3. **Test-Driven Development**
   - Generated comprehensive test cases following TDD principles
   - Created test setup and configuration files
   - Helped write unit and integration tests for all API endpoints
   - Generated test data and mock objects
   - Assisted with testing authentication flows and protected routes

4. **Frontend Development**
   - Generated React component boilerplate with TypeScript
   - Assisted with React Context API setup for state management
   - Created custom hooks (useAuth, useSweets)
   - Generated form validation with React Hook Form
   - Helped implement React Router configuration
   - Assisted with Axios setup and API client creation

5. **Styling & UX**
   - Generated Tailwind CSS utility classes and custom color schemes
   - Assisted with responsive design implementation
   - Created candy/sweet shop themed color palette
   - Helped implement loading states and error handling
   - Generated toast notification patterns

6. **Database & Seeding**
   - Assisted with seed data generation (15 sample sweets)
   - Helped create realistic product descriptions and categories
   - Generated proper image URLs for sweets

### Reflection

AI tools significantly accelerated the development process, especially for:
- **Boilerplate Code**: Reduced time spent on repetitive configuration and setup
- **TDD Workflow**: AI excelled at generating comprehensive test cases, allowing focus on implementation
- **Type Safety**: Helped ensure TypeScript types were consistent across backend and frontend
- **Best Practices**: AI suggested modern patterns like React hooks, context API, and clean architecture
- **Documentation**: Assisted in creating this comprehensive README

However, human oversight was crucial for:
- **Architecture Decisions**: Final decisions on project structure and technology choices
- **Code Review**: All AI-generated code was reviewed, understood, and modified as needed
- **Business Logic**: Complex business rules and edge cases required human reasoning
- **Testing Strategy**: While AI generated tests, the testing approach was human-designed
- **User Experience**: UX decisions and design choices were made with human judgment

The combination of AI assistance and human expertise resulted in a high-quality, production-ready application built efficiently while maintaining clean code principles.

## 📄 License

MIT

## 👥 Contributors

Built with ❤️ using AI co-authorship practices.

---

**Note**: This is a learning project demonstrating full-stack development with TDD principles and AI assistance.