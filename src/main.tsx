import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { NotFoundError } from "@/components/custom/errors";

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import './assets/styles.css'

import { Theme, ThemeProvider } from "@/lib/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import {useAuthStore} from "@/stores/useAuthStore";

// Set up a Router instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
})

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  defaultNotFoundComponent: NotFoundError,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  // const auth = useAuth()
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} /*context={{auth}}*/ />
    </QueryClientProvider>)
}

function App() {
  const theme = useAuthStore((state) => state?.theme ?? "light");
  return (
    <ThemeProvider defaultTheme={theme as Theme} attribute="class">
      {/* <AuthProvider> */}
      <InnerApp />
      {/* </AuthProvider> */}
    </ThemeProvider>
  )
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <div>
      <App />
      <Toaster />
    </div>,
  )
}
