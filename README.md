# Student Career & Internship Portal Management System

A comprehensive, role-based Job & Internship Portal designed to seamlessly connect candidates, recruiters, and administrators. This platform features distinct workflows for each role, an integrated recruiter approval system, robust application tracking, automated email notifications, and an AI-powered ATS resume analyzer.

## 🌟 Key Features

- **Role-Based Access Control**: Tailored experiences for Candidates, Recruiters, and Admins.
- **Job & Internship Management**: Recruiters can post and manage listings; candidates can search, filter, save, and apply for jobs.
- **AI-Powered ATS Resume Analysis**: Integrated Google Gemini AI to analyze candidate resumes against job descriptions, providing match scores, skill gaps, and actionable feedback.
- **Application Tracking**: Real-time status updates and tracking for job applications.
- **Recruiter Approval System**: Admin workflow to verify and approve new recruiter accounts.
- **Automated Email Notifications**: Seamless communication for application updates and portal alerts using Nodemailer & EmailJS.
- **Secure Authentication**: Robust user authentication and identity management powered by Clerk.

## 💻 Tech Stack

**Frontend:**
- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/) for accessible components
- [React Router DOM](https://reactrouter.com/) for navigation
- [Clerk](https://clerk.com/) for authentication
- [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for form validation

**Backend:**
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- [Supabase](https://supabase.com/) as the primary database
- [Google Generative AI (Gemini)](https://ai.google.dev/) for resume parsing and chat
- [Socket.io](https://socket.io/) for real-time communication
- [Multer](https://github.com/expressjs/multer) & PDF parsing libraries (`pdf-parse`, `mammoth`) for document handling

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- Supabase account & project
- Clerk account for authentication
- Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Student-Career-Internship-Portal-Management-System
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your credentials (refer to `.env.example` if available):
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   # Add other required API keys (EmailJS, Database URIs, etc.)
   ```

4. **Run the Development Server:**
   ```bash
   # Start the Vite React Frontend
   npm run dev
   
   # Start the Express Backend Server (in a separate terminal)
   npm run server
   ```
   The frontend will typically run on `http://localhost:5173` and the backend on `http://localhost:3000`.

## 📂 Project Structure

- `/src/pages` - Core application pages (Job listings, Dashboard, ATS Analysis, etc.)
- `/src/components` - Reusable UI components (buttons, forms, modals)
- `/src/routes` - Express backend API routes
- `server.js` - Main entry point for the backend server
- `package.json` - Project dependencies and scripts

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!