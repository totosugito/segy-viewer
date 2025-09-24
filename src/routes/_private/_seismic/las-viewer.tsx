import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/_seismic/las-viewer')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private/_seismic/las-viewer"!</div>
}
