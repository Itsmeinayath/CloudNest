# CloudNest

A modern file storage and management system built with Next.js, featuring secure file uploads, organization, and sharing capabilities.

## Features

- 📁 File and folder management
- ⭐ Star important files
- 🗑️ Trash functionality
- 👥 User authentication
- 🔒 Secure file storage
- 📱 Responsive design

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk
- **File Storage**: Cloud storage integration
- **Styling**: Tailwind CSS

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Set up your environment variables by creating a `.env.local` file:

```env
# Database
DATABASE_URL=your_postgresql_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Other environment variables as needed
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
cloudnest/
├── app/                 # Next.js app directory
├── components/          # Reusable UI components
├── lib/                 # Utility functions and configurations
│   └── db/             # Database schema and connections
├── public/             # Static assets
└── ...
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM documentation
- [Clerk Authentication](https://clerk.com/docs) - authentication and user management

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.