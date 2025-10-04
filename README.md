# UC Christus - Frontend

Repositorio de frontend de proyecto de gestión de estadía de Desarrollo de Software (IIC3144)

## 🚀 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **React Router** - Client-side routing

## 📁 Project Structure

```
src/
├── components/     # Reusable components
│   └── ui/        # shadcn/ui components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
│   └── utils.ts   # cn() helper for Tailwind
├── App.tsx        # Main app component
├── main.tsx       # App entry point
└── index.css      # Global styles with Tailwind
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Adding shadcn/ui Components

To add new shadcn/ui components, use the CLI:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

This will automatically add components to `src/components/ui/` with the correct configuration.

## 🎯 Features

- ✅ TypeScript for type safety
- ✅ Path aliases configured (`@/` -> `src/`)
- ✅ Tailwind CSS 4 with custom theme
- ✅ Dark mode support
- ✅ React Router for navigation
- ✅ shadcn/ui component system
- ✅ ESLint configured

## 📝 Notes

- The project uses Tailwind CSS 4 (latest version)
- Components from shadcn/ui can be customized in `src/components/ui/`
- Global styles and CSS variables are in `src/index.css`
- Theme colors can be customized in `tailwind.config.ts`

## 🔧 Configuration Files

- `vite.config.ts` - Vite configuration with path aliases
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS theme configuration
- `components.json` - shadcn/ui configuration
- `postcss.config.js` - PostCSS configuration

## 📚 Learn More

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Vite](https://vitejs.dev)
