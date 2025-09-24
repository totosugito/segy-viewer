import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/_seismic/segy-list')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private/_seismic/seismic-list"!</div>
}
