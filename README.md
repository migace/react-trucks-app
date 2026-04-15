# Fleet Manager

> Full-stack fleet management dashboard with AI-powered assistant, built with React 18 and TypeScript.

[![CI](https://github.com/migace/react-trucks-app/actions/workflows/ci.yml/badge.svg)](https://github.com/migace/react-trucks-app/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![Node](https://img.shields.io/badge/Node-22%20LTS-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

![Fleet Manager Screenshot](./docs/screenshot.png)

## Features

- **Fleet CRUD** — Create, view, and delete trucks with real-time list updates
- **Real-time filtering** — Filter fleet by status (Out of Service, Loading, To Job, At Job, Returning)
- **AI Fleet Assistant** — Chat interface powered by GPT-4o with tool calling for live fleet queries
- **Form validation** — Schema-based validation with Zod and React Hook Form
- **Dark mode** — System-aware theme toggle with Zustand state management
- **Toast notifications** — Success/error feedback via Sonner
- **Skeleton loading** — Graceful loading states with animated placeholders
- **Error boundary** — Graceful crash recovery with user-friendly fallback UI

## Tech Stack

| Category     | Technology                              |
| ------------ | --------------------------------------- |
| Framework    | React 18                                |
| Language     | TypeScript (strict mode)                |
| Build Tool   | Vite 5                                  |
| Styling      | Tailwind CSS v4                         |
| Server State | TanStack Query (React Query) v5         |
| Client State | Zustand                                 |
| Forms        | React Hook Form + Zod                   |
| Routing      | React Router v7                         |
| AI           | OpenAI GPT-4o (tool calling)            |
| Unit Testing | Vitest + React Testing Library + MSW    |
| E2E Testing  | Playwright                              |
| CI/CD        | GitHub Actions                          |
| Code Quality | ESLint + Prettier + Husky + lint-staged |

## Architecture

```
src/
├── ai/                  # AI assistant integration (OpenAI, tool definitions)
├── api/                 # HTTP client layer (fetch wrappers)
├── components/          # Reusable UI components
│   ├── AddTruck.tsx     #   Truck creation form
│   ├── ConfirmDialog.tsx#   Reusable confirmation modal
│   ├── ErrorBoundary.tsx#   React error boundary
│   ├── Layout.tsx       #   App shell with navigation
│   └── TrucksList.tsx   #   Fleet table with delete flow
├── hooks/               # Custom React Query hooks
├── pages/               # Route-level page components
├── schemas/             # Zod validation schemas
├── store/               # Zustand state management
├── test/                # Test infrastructure (MSW handlers, utils)
├── types/               # TypeScript type definitions
├── env.ts               # Runtime environment variable validation
└── main.tsx             # Application entry point
```

**Data flow:** `API layer` → `React Query hooks` → `Components/Pages` → `User`

## Getting Started

### Prerequisites

- Node.js 22+ (see `.nvmrc`)
- npm 10+

### Installation

```bash
git clone https://github.com/migace/react-trucks-app.git
cd react-trucks-app
npm install
```

### Environment Setup

Copy the example env file and fill in the values:

```bash
cp .env.example .env
```

| Variable              | Required | Description                           |
| --------------------- | -------- | ------------------------------------- |
| `VITE_API_URL`        | Yes      | Backend API URL                       |
| `VITE_OPENAI_API_KEY` | No       | OpenAI API key (enables AI assistant) |

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

| Script                  | Description                         |
| ----------------------- | ----------------------------------- |
| `npm run dev`           | Start development server            |
| `npm run build`         | Type-check and build for production |
| `npm run preview`       | Preview production build locally    |
| `npm run lint`          | Run ESLint on all source files      |
| `npm run format`        | Format code with Prettier           |
| `npm run format:check`  | Check formatting without writing    |
| `npm run typecheck`     | Run TypeScript compiler checks      |
| `npm test`              | Run unit tests with Vitest          |
| `npm run test:watch`    | Run tests in watch mode             |
| `npm run test:coverage` | Run tests with coverage report      |
| `npm run test:e2e`      | Run Playwright E2E tests            |
| `npm run test:e2e:ui`   | Run E2E tests with interactive UI   |

## Testing

### Unit & Component Tests

Built with **Vitest**, **React Testing Library**, and **MSW** (Mock Service Worker) for API mocking.

```bash
npm test              # Run once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
```

Test coverage includes:

- **Schema validation** — Zod schema boundary cases
- **API layer** — HTTP client with mocked responses (success + error paths)
- **React Query hooks** — Data fetching, mutations, cache invalidation
- **Zustand store** — State transitions
- **Components** — Rendering, user interactions, accessibility

### E2E Tests

Built with **Playwright** targeting Chromium.

```bash
npm run test:e2e      # Headless
npm run test:e2e:ui   # Interactive UI
```

## CI/CD

GitHub Actions pipeline runs on every push and PR to `main`:

1. **Prettier** — Format check
2. **ESLint** — Linting with zero warnings policy
3. **TypeScript** — Strict type checking
4. **Vitest** — Unit and component tests
5. **Build** — Production build verification

## License

[MIT](./LICENSE)
