# iQuP Dashboard Setup

This is a Next.js 15 App Router project with TypeScript, Tailwind CSS, and role-based access control.

## Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Role-based access control** (RBAC) with roles: HQ, MF, LC, TT
- **Zustand** for state management with localStorage persistence
- **MSW** for API mocking in development
- **Responsive dashboard** with sidebar and topbar
- **Conditional navigation** based on user roles

## Installation

1. Install dependencies:
```bash
npm install @tanstack/react-query @tanstack/react-table react-hook-form zustand msw dayjs pdf-lib idb-keyval
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Login
The application includes a mock login system. Choose from these roles:
- **HQ Admin**: Full system access
- **MF Manager**: Management functions
- **LC Coordinator**: Local coordination
- **TT Teacher Trainer**: Training functions

### Navigation
The sidebar will show different navigation items based on your selected role:
- All roles can access: Dashboard, Students, Learning Groups, Trainings, Settings
- HQ, MF, LC can access: Programs, Subprograms, Teachers, Orders, Students Report
- HQ, MF can access: Teacher Trainers, Accounts, Royalties Report

### Routes
All routes are available under the `/app` directory:
- `/login` - Authentication page
- `/dashboard` - Main dashboard
- `/programs` - Program management
- `/subprograms` - Subprogram management
- `/contacts/students` - Student management
- `/contacts/teachers` - Teacher management
- `/learning-groups` - Learning group management
- `/orders` - Order management
- `/trainings` - Training management
- `/teacher-trainers` - Teacher trainer management
- `/accounts` - Account management
- `/reports/royalties` - Royalties report
- `/reports/students` - Students report
- `/settings` - System settings

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── layout/            # Dashboard layout components
│   └── ui/                # Reusable UI components
├── lib/
│   └── rbac.ts           # Role-based access control
├── store/
│   └── auth.ts           # Zustand auth store
└── mocks/
    └── worker.ts         # MSW API mocking
```

## Development

The project uses MSW (Mock Service Worker) for API mocking in development. All API endpoints are mocked and will return sample data.

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Zustand
- MSW
- Lucide React (icons)
- Zod (validation)
- React Hook Form
- TanStack Query
- TanStack Table
- Day.js
- PDF-lib
- IDB Keyval
