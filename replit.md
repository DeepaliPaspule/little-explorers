# Learn & Listen - Educational App for Blind Children

## Overview

Learn & Listen is an accessible educational application designed specifically for blind and visually impaired children. The app provides sound-based learning experiences through interactive categories including fruits, vegetables, animals, and alphabet letters. Built with React and Express, it features text-to-speech capabilities, keyboard navigation, and ARIA-compliant accessibility standards to create an inclusive learning environment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application uses React with TypeScript, structured as a single-page application with component-based architecture. The UI is built with shadcn/ui components and Tailwind CSS for styling, providing a clean and accessible interface. Navigation is handled by Wouter for lightweight client-side routing.

**Key Design Decisions:**
- **Accessibility-first approach**: All components include ARIA labels, keyboard navigation support, and semantic HTML structure
- **Speech synthesis integration**: Custom speech service wrapper around Web Speech API for text-to-speech functionality
- **Component composition**: Modular UI components for categories and learning items with consistent interaction patterns
- **State management**: React Query for server state management and React hooks for local state

### Backend Architecture
The server follows a REST API pattern using Express.js with TypeScript. The architecture separates concerns between routing, storage, and server configuration.

**Core Components:**
- **Route handlers**: RESTful endpoints for categories and learning items (`/api/categories`, `/api/learning-items`)
- **Storage abstraction**: Interface-based storage system with in-memory implementation containing seed data for educational content
- **Development tooling**: Vite integration for hot module replacement during development

### Data Storage Solutions
Currently implements an in-memory storage system with pre-seeded educational content. The application is configured for PostgreSQL with Drizzle ORM for future database persistence.

**Storage Strategy:**
- **Development**: Memory-based storage with educational seed data
- **Production-ready**: Drizzle schema defined for PostgreSQL migration
- **Data structure**: Learning items with categories, emojis, and educational facts

### Authentication and Authorization
No authentication system is currently implemented, as the application is designed for open educational access.

### External Dependencies

#### Core Framework Dependencies
- **React ecosystem**: React 18 with TypeScript for component-based UI development
- **Express.js**: Node.js web framework for REST API backend
- **Vite**: Build tool and development server with hot module replacement

#### UI and Styling
- **shadcn/ui**: Comprehensive component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Accessible, unstyled UI primitives for complex components

#### Data Management
- **TanStack Query**: Server state management with caching and synchronization
- **Drizzle ORM**: TypeScript ORM with PostgreSQL dialect configuration
- **Zod**: TypeScript-first schema validation library

#### Accessibility and Speech
- **Web Speech API**: Browser-native text-to-speech capabilities
- **ARIA standards**: Comprehensive accessibility attributes and semantic markup

#### Database Integration
- **Neon Database**: Serverless PostgreSQL with connection pooling
- **PostgreSQL**: Configured as the primary database dialect for production use

#### Development Tools
- **TypeScript**: Static type checking across the full stack
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit integration**: Development environment plugins for enhanced debugging