# BlogVerse - Next.js Blogging Platform

BlogVerse is a modern, full-stack blogging platform built with Next.js, featuring authentication, rich content creation, and a beautiful user interface.

## ✨ Key Features

- **Next.js 15 with Turbopack** for blazing fast performance
- **React 19** with server components architecture
- **Modern UI Components** using Radix UI primitives
- **Authentication System** with secure JWT tokens
- **Rich Text Editor** for content creation
- **Dark/Light Mode** with `next-themes`
- **Responsive Design** with Tailwind CSS
- **Form Validation** with React Hook Form + Zod
- **Data Tables** with TanStack Table
- **Toast Notifications** with Sonner
- **Database Integration** with Mongoose

## 🛠️ Tech Stack

### Frontend

- Next.js 15 (App Router)
- React 19
- Tailwind CSS + Tailwind Merge
- Radix UI Primitives
- Framer Motion (Animations)
- Lucide & Tabler Icons

### Backend

- Next.js API Routes
- Mongoose (MongoDB ODM)
- BcryptJS (Password Hashing)
- Jose (JWT Utilities)

### Utilities

- Zod (Schema Validation)
- React Hook Form (Forms Management)
- TanStack Table (Data Tables)
- Class Variance Authority (Class Utilities)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Muhammed-Salih-PK/BlogVerse.git
   cd BlogVerse
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NEXTAUTH_SECRET=your_next_auth_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
BlogVerse/
├── app/                  # Next.js app router
│   ├── (auth)/           # Authentication routes
│   ├── (main)/           # Protected routes
│   ├── api/              # API routes
│   └── components/       # Shared components
├── lib/                  # Utility functions
├── models/               # Mongoose models
├── styles/               # Global styles
├── public/               # Static assets
├── package.json          # Dependencies
└── README.md            # This file
```

## 🎨 UI Components

BlogVerse uses a modern component library built with:

- Radix UI primitives for accessibility
- Tailwind CSS for styling
- Class Variance Authority for variant management
- Framer Motion for animations

## 🔒 Authentication

Secure authentication system featuring:

- JWT token-based authentication
- Password hashing with bcryptjs
- Protected routes
- Session management

## 📝 Scripts

- `npm run dev`: Start development server with Turbopack
- `npm run build`: Create production build
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📬 Contact

Muhammed Salih PK - [LinkedIn](https://linkedin.com/in/mhdsalihpk) - mhdsalihoffl@gmail.com

Project Link: [https://github.com/Muhammed-Salih-PK/BlogVerse](https://github.com/Muhammed-Salih-PK/BlogVerse)

## 🌐 Deployment

This project is easily deployable to [Vercel](https://vercel.com/):

- Push your repo to GitHub
- Import into Vercel
- Add environment variables
- Deploy and enjoy 🎉
