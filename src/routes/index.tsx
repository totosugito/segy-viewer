import {createFileRoute, redirect} from '@tanstack/react-router'
import {APP_CONFIG} from "@/constants/config";

export const Route = createFileRoute('/')({
  loader: ({ context }) => {
    // return redirect({ to: context.auth.isAuthenticated ? APP_CONFIG.path.defaultPrivate : APP_CONFIG.path.defaultPublic })
    return redirect({ to: APP_CONFIG.path.defaultPrivate})
  },
  component: () => null,
})
