# Zahid Farooq - Portfolio Website

A modern, responsive portfolio website built with Next.js, React, TypeScript, and Tailwind CSS. This portfolio showcases projects, skills, and provides a contact form with email notifications.

![Portfolio Preview](public/og-image.jpg)

## Features

- **Responsive Design**: Works on all devices from mobile to desktop
- **Dark/Light Mode**: Automatic theme switching based on system preferences
- **Admin Dashboard**: Secure admin panel to manage projects and messages
- **Contact Form**: With database storage and email notifications
- **Custom Cursor**: Interactive cursor with glow effect on hover
- **Project Showcase**: Display and filter projects by category
- **SEO Optimized**: Meta tags and Open Graph support
- **Fast Performance**: Built with Next.js for optimal loading speeds

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Framework**: Next.js 15 (App Router)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with secure HTTP-only cookies
- **Email**: Nodemailer for contact form notifications
- **Animation**: Framer Motion for smooth transitions
- **Icons**: Lucide React for consistent iconography

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- MongoDB database (local or Atlas)
- Yarn or npm

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/muzad79/Portfolio.git
   cd Portfolio
   ```

2. Install dependencies

   ```bash
   yarn install
   # or
   npm install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:

   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email_address@gmail.com
   EMAIL_PASSWORD=your_email_app_password
   NOTIFICATION_EMAIL=email_to_receive_notifications@gmail.com
   ```

4. Run the development server

   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Creating an Admin User

To access the admin dashboard, you need to create an admin user:

1. Run the admin creation script

   ```bash
   node scripts/create-admin.js
   ```

2. Follow the prompts or use the default credentials

   - Default username: admin@example.com
   - Default password: admin123

3. Access the admin dashboard at [http://localhost:3000/admin](http://localhost:3000/admin)

## Project Structure

```
├── public/              # Static assets
├── scripts/             # Utility scripts
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── admin/       # Admin dashboard pages
│   │   ├── api/         # API routes
│   │   └── [...]/       # Other pages
│   ├── components/      # React components
│   │   ├── admin/       # Admin-specific components
│   │   ├── common/      # Shared components
│   │   └── [...]/       # Feature-specific components
│   ├── lib/             # Utility functions and services
│   │   ├── models/      # MongoDB models
│   │   ├── db.ts        # Database connection
│   │   ├── email.ts     # Email service
│   │   └── [...]/       # Other utilities
│   └── styles/          # Global styles
├── .env.local           # Environment variables (not in repo)
└── [...config files]    # Configuration files
```

## Email Notifications

The portfolio includes two types of email notifications:

1. **Admin Notifications**: When someone submits the contact form, you receive an email with their details and message.

2. **Auto-Reply**: The person who submitted the form receives a confirmation email thanking them for their message.

To configure email notifications:

1. Set up the required environment variables in `.env.local`
2. For Gmail, you'll need to create an App Password if you have 2FA enabled

## Customization

### Tailwind Configuration

Customize the design by editing `tailwind.config.js`.

### Content

Update your personal information:

- Edit `src/app/page.tsx` for the main landing page
- Modify `src/components/common/Footer.tsx` for contact links
- Update `src/components/common/Navbar.tsx` for navigation items

## Deployment

This project can be deployed on any platform that supports Next.js applications:

- **Vercel** (recommended): Connect your GitHub repository for automatic deployments
- **Netlify**: Use the Netlify adapter for optimal performance
- **Self-hosted**: Build the application and serve with Node.js

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org) - The React Framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [MongoDB](https://www.mongodb.com) - Database
- [Nodemailer](https://nodemailer.com) - Email sending
