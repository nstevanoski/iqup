# iQup Dashboard Setup

This is a Next.js 15 App Router project with TypeScript, Tailwind CSS, and shadcn/ui components, featuring a role-based access control (RBAC) dashboard system.

## Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Role-based Access Control (RBAC)** with 4 user roles:
  - HQ (Headquarters) - Full access
  - MF (Master Franchise) - Franchise management
  - LC (Learning Center) - Student/teacher management
  - TT (Teacher Trainer) - Training management
- **Zustand** for state management
- **MSW** for API mocking in development
- **React Hook Form** with Zod validation
- **TanStack Query** for data fetching
- **TanStack Table** for data tables
- **Lucide React** for icons

## Prerequisites

Make sure you have Node.js and npm/pnpm installed on your system.

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Install additional dependencies for DataTable and Forms:**
   ```bash
   ./install-missing-deps.sh
   # or manually:
   npm install @hookform/resolvers@^3.9.1
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)
   
   **Demo the DataTable and Forms:**
   Visit [http://localhost:3000/demo](http://localhost:3000/demo) to see the complete DataTable and Forms system in action!

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page with role selection
│   ├── dashboard/         # Main dashboard
│   ├── programs/          # Programs management
│   ├── subprograms/       # Subprograms management
│   ├── contacts/          # Student and teacher management
│   ├── learning-groups/   # Learning groups management
│   ├── orders/            # Orders management
│   ├── trainings/         # Training management
│   ├── teacher-trainers/  # Teacher trainer management
│   ├── accounts/          # Account management
│   ├── reports/           # Reports (royalties, students)
│   └── settings/          # System settings
├── components/
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard layout components
│   └── ui/                # Reusable UI components
├── lib/
│   └── rbac.ts           # Role-based access control logic
├── store/
│   └── auth.ts           # Zustand authentication store
└── mocks/                # MSW API mocking
```

## User Roles and Permissions

### HQ (Headquarters)
- Full access to all features
- Can view all reports and settings

### MF (Master Franchise)
- Access to franchise management features
- Can view programs, students, teachers, orders
- Cannot access system settings

### LC (Learning Center)
- Access to student and teacher management
- Can view learning groups and student reports
- Limited access to other features

### TT (Teacher Trainer)
- Access to training and learning group features
- Can view trainings and learning groups
- Limited access to other features

## Development

### Mock Authentication
The app includes mock authentication for development:
- Visit `/login` to select a role and login
- Authentication state is persisted in localStorage
- MSW is enabled in development for API mocking

### API Mocking
MSW (Mock Service Worker) is configured to mock API endpoints:
- All API calls are intercepted in development
- Mock data is provided for all dashboard features
- See `src/mocks/handlers.ts` for available endpoints

### Adding New Features
1. Create new pages in the `src/app/` directory
2. Add route permissions to `src/lib/rbac.ts`
3. Update the sidebar navigation in `src/components/dashboard/Sidebar.tsx`
4. Add mock API handlers in `src/mocks/handlers.ts`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm test` - Run tests

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Reusable component library
- **Zustand** - Lightweight state management
- **MSW** - API mocking library
- **React Hook Form** - Form handling
- **@hookform/resolvers** - Form validation resolvers
- **Zod** - Schema validation
- **TanStack Query** - Data fetching and caching
- **TanStack Table** - Data table components
- **Lucide React** - Icon library
- **dayjs** - Date manipulation
- **pdf-lib** - PDF generation
- **idb-keyval** - IndexedDB key-value storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
