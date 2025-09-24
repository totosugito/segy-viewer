import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/_private/_seismic/las-list')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private/_seismic/las-list"!</div>
}
