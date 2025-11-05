# Overview

This is a modern full-stack web application for iBoothme, a brand activation and interactive experience company. The project showcases an immersive, cinematic website with advanced UI components, 3D elements, and micro-animations. It's built as a sophisticated marketing platform to demonstrate the company's cutting-edge photo booth technology, AI capabilities, and brand activation services.

The application features a comprehensive landing page with multiple sections including hero presentation, product showcases, technology demonstrations, and client testimonials, all designed with premium visual effects and interactions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom design system and CSS variables for consistent theming
- **UI Components**: Radix UI primitives with shadcn/ui component library for accessible, customizable components
- **Animations**: Framer Motion for smooth micro-animations and scroll-triggered effects
- **3D Graphics**: Three.js integration planned for hero background and interactive elements
- **Routing**: Wouter for lightweight client-side routing

## Backend Architecture
- **Runtime**: Node.js with Express.js for the web server
- **Language**: TypeScript throughout the stack for consistency
- **API Structure**: RESTful API design with route organization in `/server/routes.ts`
- **Data Layer**: Storage abstraction interface with in-memory implementation (expandable to database)
- **Development**: Hot reload and development middleware via Vite integration

## Data Storage
- **Database**: PostgreSQL configured via Drizzle ORM
- **ORM**: Drizzle with schema-first approach in `/shared/schema.ts`
- **Validation**: Zod for runtime type validation and schema generation
- **Migrations**: Drizzle Kit for database schema management
- **Session Store**: PostgreSQL session storage via connect-pg-simple

## Component Organization
- **Shared Types**: Common schemas and types in `/shared` directory
- **UI Components**: Modular component structure with atomic design principles
- **Page Components**: Section-based components for different landing page areas
- **Custom Hooks**: Reusable logic for intersection observers, mobile detection, and accessibility

## Development Features
- **Type Safety**: Full TypeScript coverage across client, server, and shared code
- **Code Quality**: ESLint and TypeScript strict mode for code consistency
- **Development Tools**: Replit integration with cartographer and error overlay plugins
- **Path Aliases**: Configured import paths for clean module resolution

## Accessibility & Performance
- **Motion Preferences**: `prefers-reduced-motion` support for accessibility
- **Responsive Design**: Mobile-first approach with adaptive breakpoints
- **Performance**: Lazy loading, code splitting, and optimized asset delivery
- **SEO**: Semantic HTML structure and proper meta tags

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: Neon database connectivity for PostgreSQL
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-zod**: Schema validation integration

## UI and Animation Libraries
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **framer-motion**: Advanced animation library for React
- **@tanstack/react-query**: Server state management and caching
- **class-variance-authority**: Type-safe component variants
- **tailwindcss**: Utility-first CSS framework

## Development Tools
- **@replit/vite-plugin-***: Replit-specific development enhancements
- **@vitejs/plugin-react**: React support for Vite
- **tsx**: TypeScript execution for development server

## Planned Integrations
- **Three.js**: For 3D background effects and interactive elements
- **GSAP**: Additional animation capabilities for complex sequences
- **Troika-three-text**: 3D typography for hero headlines

## Build and Deployment
- **esbuild**: Fast bundling for production server code
- **postcss**: CSS processing with autoprefixer
- **vite**: Modern build tool for client-side assets