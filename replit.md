# Little Explorers - Fun Learning Adventures

## Overview

Little Explorers is a fun and accessible educational application designed for curious kids of all abilities. The app provides engaging learning experiences through interactive categories including fruits, vegetables, animals, alphabet letters, colors, shapes, numbers, and transportation. Built with React and Express, it features mobile vibration feedback, high-contrast visuals, enhanced screen reader support, and comprehensive keyboard navigation to create an inclusive and delightful learning environment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application uses React with TypeScript, structured as a single-page application with component-based architecture. The UI is built with shadcn/ui components and Tailwind CSS for styling, providing a clean and accessible interface. Navigation is handled by Wouter for lightweight client-side routing.

**Key Design Decisions:**
- **Accessibility-first approach**: All components include comprehensive ARIA labels, keyboard navigation support, and semantic HTML structure
- **Alternative accessibility features**: Mobile vibration feedback, high-contrast visuals, and enhanced screen reader announcements
- **Touch-friendly design**: Large interactive elements with 48px minimum touch targets for mobile accessibility
- **Visual learning display**: Modal-based learning interface showing item spelling, emojis, and educational facts
- **Component composition**: Modular UI components for categories and learning items with consistent interaction patterns
- **State management**: React Query for server state management and React hooks for local state

### Backend Architecture
The server follows a REST API pattern using Express.js with TypeScript. The architecture separates concerns between routing, storage, and server configuration.

**Core Components:**
- **Route handlers**: RESTful endpoints for categories and learning items (`/api/categories`, `/api/learning-items`)
- **Storage abstraction**: Interface-based storage system with in-memory implementation containing seed data for educational content
- **Development tooling**: Vite integration for hot module replacement during development
- **Accessibility service**: Custom accessibility service providing vibration feedback and screen reader announcements

### Data Storage Solutions
Currently implements an in-memory storage system with pre-seeded educational content. The application is configured for PostgreSQL with Drizzle ORM for future database persistence.

**Storage Strategy:**
- **Development**: Memory-based storage with educational seed data
- **Production-ready**: Drizzle schema defined for PostgreSQL migration
- **Data structure**: Learning items with categories, emojis, and educational facts
- **Learning display**: Interactive modal showing item spelling, pronunciation guide, and educational content

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

#### Accessibility Features
- **Mobile Vibration API**: Tactile feedback for supported devices
- **High-contrast design**: Enhanced visual accessibility with strong color contrasts
- **Screen reader optimization**: Comprehensive ARIA labels and live announcements
- **Keyboard navigation**: Full application control via keyboard input
- **Touch accessibility**: Large, touch-friendly interactive elements

#### Database Integration
- **Neon Database**: Serverless PostgreSQL with connection pooling
- **PostgreSQL**: Configured as the primary database dialect for production use

#### Development Tools
- **TypeScript**: Static type checking across the full stack
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit integration**: Development environment plugins for enhanced debugging

## Recent Changes (January 7, 2025)

### Major Accessibility Redesign
- **Removed audio dependency**: Eliminated problematic Web Speech API implementation that was failing in the development environment
- **Added mobile vibration feedback**: Implemented Vibration API for tactile confirmation on supported mobile devices
- **Enhanced visual design**: High-contrast color scheme with improved focus indicators and touch-friendly elements
- **Created LearningDisplay component**: Modal interface showing item spelling with individual letter breakdown and educational facts
- **Improved screen reader support**: Added comprehensive ARIA live announcements and enhanced semantic markup
- **Responsive design**: Large touch targets (48px minimum) and improved mobile accessibility
- **CSS accessibility features**: Added support for prefers-contrast, prefers-reduced-motion, and prefers-font-size media queries