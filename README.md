# Reservation System

A modern web application for managing reservations with PIN-based confirmation. Built with Laravel, React, TypeScript, and Inertia.js.

## Features

- **Reservation Management**: Create, list, and manage reservations
- **PIN-Based Confirmation**: Generate unique PIN codes for reservations with time-based validity windows
- **Real-Time Countdown**: Visual countdown timer showing PIN validity duration
- **Column Filtering**: Search and filter reservations by name
- **Status Tracking**: Track reservation status (Inactive, Active, Extended, Expired, Confirmed)
- **Pagination**: Efficient data pagination with customizable page sizes
- **Responsive UI**: Modern, accessible interface with dark mode support
- **Form Validation**: Comprehensive validation for reservation creation and PIN confirmation

## Tech Stack

### Backend
- **Laravel**: PHP web framework
- **Inertia**: Server-side rendering for React

### Frontend
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI component library
- **TanStack React Table**: Powerful table component
- **Inertia.js**: SPA-like experience
- **React Countdown**: Countdown timer component

### Development
- **Vite**: Build tool and dev server
- **Pest**: PHP testing framework
- **ESLint**: JavaScript linting
- **Prettier**: Code formatter

## Prerequisites

- **Node.js**: >= 20.17.0 (v20 LTS recommended)
- **PHP**: >= 8.2
- **Composer**: Latest version
- **npm or yarn**: Node package manager
- **Git**: Version control

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd reservation-system
```

### 2. Install Backend Dependencies
```bash
composer install
```

### 3. Install Frontend Dependencies
```bash
npm install
```

### 4. Environment Configuration
```bash
# Copy example environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 5. Database Setup
```bash
# Run migrations
php artisan migrate
```

### 6. Build Frontend Assets
```bash
# Development
npm run dev

# Production
npm run build
```

### 7. Start the Application

#### Development Environment
```bash
# Terminal 1: Run the dev server
npm run dev

# Terminal 2: Run Laravel development server
php artisan serve
```

The application will be available at `http://localhost:8000`

#### Production Build
```bash
# Build assets
npm run build

# Serve with PHP's built-in server or your preferred web server
php artisan serve
```

## Project Structure

```
reservation-system/
├── app/
│   ├── Http/
│   │   ├── Controllers/     # API and page controllers
│   │   └── Requests/        # Form request validation
│   ├── Models/              # Eloquent models
│   ├── Services/            # Business logic services
│   ├── Traits/              # Reusable traits (PIN generation)
│   └── Enums/               # PHP enums
├── resources/
│   ├── js/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── layouts/         # Layout components
│   │   └── types/           # TypeScript type definitions
│   └── css/                 # Global styles
├── routes/
│   ├── web.php              # Web routes
│   └── console.php          # Console commands
├── database/
│   ├── migrations/          # Database migrations
│   └── seeders/             # Database seeders
├── tests/                   # Test files
└── config/                  # Configuration files
```

## Available Commands

### Frontend
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run format      # Format code with Prettier
npm run lint        # Lint code with ESLint
npm run types       # Check TypeScript types
```

### Backend
```bash
php artisan serve               # Start development server
php artisan migrate             # Run database migrations
php artisan db:seed             # Seed database
php artisan tinker              # Interactive shell
php artisan test                # Run tests
```

## Key Features Guide

### Creating a Reservation
1. Navigate to "Create Reservation"
2. Fill in first name, last name, phone, and reservation time
3. Submit the form
4. A unique PIN code will be generated and displayed
5. Copy the PIN code for later use

### Confirming a Reservation
1. Go to the Reservations list
2. Use the "Confirm Reservation with PIN" form at the top
3. Enter the PIN code
4. Click "Confirm" to mark the reservation as confirmed

### Filtering Reservations
1. Use the search input to filter by:
   - First name
2. Results update from the current page

### PIN Validity
- Each PIN has a time-based validity window
- The countdown timer shows remaining validity time
- After expiration, the reservation cannot be confirmed with the old PIN


## Database Schema

### Reservations Table
- `id`: Primary key
- `first_name`: Reservation holder's first name
- `last_name`: Reservation holder's last name
- `phone`: Contact phone number
- `reservation_time`: Scheduled reservation time
- `pin_code`: PIN code
- `pin_active_from`: Start of PIN validity window
- `pin_active_until`: End of PIN validity window
- `confirmed_at`: Confirmation timestamp
- `extended_at`: Extension timestamp
- `processed_at`: Processing timestamp
- `created_at`, `updated_at`: Timestamps


## Support & Contribution

For issues or feature requests, please create a GitHub issue or contact the development team.

## License

This project is licensed under the MIT License.
