# Next.js Design System Guide 2025

> Comprehensive guide for building modern design systems with Next.js, Tailwind CSS, shadcn/ui, and state-driven UI patterns

## Table of Contents
- [Design Principles](#design-principles)
- [Component Architecture](#component-architecture)
- [State-Driven UI](#state-driven-ui)
- [Data Fetching](#data-fetching)
- [Theme System](#theme-system)
- [Component Library](#component-library)
- [Animation System](#animation-system)
- [Typography](#typography)
- [Color System](#color-system)
- [Spacing System](#spacing-system)
- [Icons and Assets](#icons-and-assets)
- [Accessibility](#accessibility)
- [Responsive Design](#responsive-design)
- [Dark Mode](#dark-mode)

## Design Principles

### Core Principles
- **Consistency**: Use design tokens and reusable components
- **State-Driven**: UI reflects global and local state
- **Data-Aware**: Components handle loading and error states
- **Accessibility**: Follow WCAG 2.2 guidelines
- **Performance**: Optimize for Core Web Vitals

### Design Tokens
```typescript
// lib/design-tokens.ts
export const tokens = {
  colors: {
    primary: {
      50: 'hsl(var(--primary-50))',
      // ... other shades
    },
  },
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',
    // ... other spacing values
  },
  // ... other token categories
}
```

## State-Driven UI

### Global State with Zustand
```typescript
// lib/stores/ui-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean
  activeModal: string | null
  setTheme: (theme: UIState['theme']) => void
  setSidebarOpen: (open: boolean) => void
  setActiveModal: (modal: string | null) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarOpen: false,
      activeModal: null,
      setTheme: (theme) => set({ theme }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveModal: (modal) => set({ activeModal: modal }),
    }),
    {
      name: 'ui-store',
    }
  )
)
```

### Atomic State with Jotai
```typescript
// lib/atoms/ui-atoms.ts
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const themeAtom = atomWithStorage<'light' | 'dark' | 'system'>(
  'theme',
  'system'
)

export const sidebarOpenAtom = atom(false)
export const activeModalAtom = atom<string | null>(null)

// Derived atoms
export const isDarkModeAtom = atom(
  (get) => {
    const theme = get(themeAtom)
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return theme === 'dark'
  }
)
```

### State-Aware Components
```typescript
// components/ui/modal.tsx
import { useUIStore } from '@/lib/stores/ui-store'

export function Modal({ name, children }: { name: string; children: React.ReactNode }) {
  const { activeModal, setActiveModal } = useUIStore()
  const isOpen = activeModal === name

  return (
    <Dialog open={isOpen} onOpenChange={() => setActiveModal(null)}>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  )
}

// components/ui/sidebar.tsx
import { useUIStore } from '@/lib/stores/ui-store'

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent side="left">
        {/* Sidebar content */}
      </SheetContent>
    </Sheet>
  )
}
```

## Data Fetching

### SWR Integration
```typescript
// lib/swr-config.ts
import { SWRConfig } from 'swr'

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then((r) => r.json()),
        suspense: true,
        revalidateOnFocus: false,
      }}
    >
      {children}
    </SWRConfig>
  )
}
```

### Data-Aware Components
```typescript
// components/ui/data-table.tsx
import useSWR from 'swr'
import { Suspense } from 'react'

function DataTableContent<T>({ data, columns }: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        {columns.map((column) => (
          <TableHead key={column.key}>{column.label}</TableHead>
        ))}
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            {columns.map((column) => (
              <TableCell key={column.key}>{row[column.key]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function DataTable<T>({ url, columns }: { url: string; columns: Column<T>[] }) {
  return (
    <Suspense fallback={<TableSkeleton columns={columns.length} />}>
      <DataTableContent url={url} columns={columns} />
    </Suspense>
  )
}
```

### Loading States
```typescript
// components/ui/loading-states.tsx
export function TableSkeleton({ columns }: { columns: number }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-[100px]" />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-4 w-[100px]" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border p-4">
      <Skeleton className="h-4 w-[250px]" />
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </div>
  )
}
```

### Error Boundaries
```typescript
// components/ui/error-boundary.tsx
import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

export function ErrorFallback() {
  return (
    <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
      <div className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="h-4 w-4" />
        <p className="text-sm font-medium">Something went wrong</p>
      </div>
    </div>
  )
}
```

## Component Architecture

### Base Components
```typescript
// components/ui/button.tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/lib/stores/ui-store'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && 'opacity-50 cursor-not-allowed'
        )}
        disabled={loading}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
```

### Composite Components
```typescript
// components/ui/command.tsx
import * as React from 'react'
import { Command as CommandPrimitive } from 'cmdk'
import { Search } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Dialog, DialogContent } from '@/components/ui/dialog'

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

// ... rest of the command component implementation
```

## Theme System

### Theme Provider
```typescript
// components/theme-provider.tsx
import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

const ThemeProviderContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
}>({
  theme: 'system',
  setTheme: () => null,
})

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}
```

### CSS Variables
```css
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark theme variables */
  }
}
```

## Animation System

### Framer Motion Integration
```typescript
// components/ui/animated-container.tsx
import { motion, type Variants } from 'framer-motion'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
}

export function AnimatedContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}

export function AnimatedItem({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <motion.div variants={itemVariants}>
      {children}
    </motion.div>
  )
}
```

### Page Transitions
```typescript
// components/transitions/page-transition.tsx
import { motion } from 'framer-motion'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.4,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
}

export function PageTransition({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}
```

## Typography

### Font Configuration
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
```

### Typography Components
```typescript
// components/ui/typography.tsx
import { cn } from '@/lib/utils'

export function H1({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
        className
      )}
    >
      {children}
    </h1>
  )
}

// ... other typography components
```

## Color System

### Color Utilities
```typescript
// lib/color-utils.ts
export function hexToHSL(hex: string): string {
  // Convert hex to HSL
  let r = parseInt(hex.slice(1, 3), 16) / 255
  let g = parseInt(hex.slice(3, 5), 16) / 255
  let b = parseInt(hex.slice(5, 7), 16) / 255

  let max = Math.max(r, g, b)
  let min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    let d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}
```

## Spacing System

### Spacing Scale
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      spacing: {
        '4xs': '0.125rem', // 2px
        '3xs': '0.25rem',  // 4px
        '2xs': '0.375rem', // 6px
        'xs': '0.5rem',    // 8px
        'sm': '0.75rem',   // 12px
        'md': '1rem',      // 16px
        'lg': '1.25rem',   // 20px
        'xl': '1.5rem',    // 24px
        '2xl': '2rem',     // 32px
        '3xl': '2.5rem',   // 40px
        '4xl': '3rem',     // 48px
      },
    },
  },
}

export default config
```

## Icons and Assets

### Icon Component
```typescript
// components/ui/icon.tsx
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IconProps extends React.ComponentPropsWithoutRef<'svg'> {
  name: LucideIcon
  size?: number
}

export function Icon({ name: Icon, size = 24, className, ...props }: IconProps) {
  return (
    <Icon
      size={size}
      className={cn('', className)}
      {...props}
    />
  )
}
```

## Accessibility

### Focus Management
```typescript
// hooks/use-focus-trap.ts
import { useEffect } from 'react'

export function useFocusTrap(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstFocusable = focusableElements[0] as HTMLElement
    const lastFocusable = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus()
          e.preventDefault()
        }
      }
    }

    element.addEventListener('keydown', handleKeyDown)
    return () => element.removeEventListener('keydown', handleKeyDown)
  }, [ref])
}
```

## Responsive Design

### Breakpoint System
```typescript
// lib/breakpoints.ts
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

export const mediaQueries = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
}
```

## Dark Mode

### Dark Mode Toggle
```typescript
// components/dark-mode-toggle.tsx
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

## Best Practices

1. **State Management**
   - Use Zustand for global UI state
   - Use Jotai for atomic component state
   - Implement proper persistence
   - Handle loading states

2. **Data Fetching**
   - Use SWR with suspense
   - Implement error boundaries
   - Show loading states
   - Handle edge cases

3. **Component Design**
   - Make components state-aware
   - Use proper TypeScript types
   - Follow accessibility guidelines
   - Implement proper error handling

4. **Performance**
   - Use proper code splitting
   - Implement proper caching
   - Optimize bundle size
   - Monitor with Speed Insights

## Resources

### Official Documentation
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Jotai Documentation](https://jotai.org)
- [SWR Documentation](https://swr.vercel.app)
- [Radix UI Documentation](https://www.radix-ui.com)

### Design Tools
- [Figma](https://www.figma.com)
- [Storybook](https://storybook.js.org)
- [Tailwind UI](https://tailwindui.com)
- [Radix Colors](https://www.radix-ui.com/colors)

### Community Resources
- [Tailwind CSS Blog](https://blog.tailwindcss.com)
- [shadcn/ui GitHub](https://github.com/shadcn/ui)
- [Vercel Design](https://vercel.com/design)
- [Next.js Discord](https://discord.gg/nextjs)

---

*Note: Keep this document updated with the latest versions and best practices. Always check the official documentation for the most recent changes.* 