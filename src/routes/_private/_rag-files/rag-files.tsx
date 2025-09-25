import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/_rag-files/rag-files')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private/_rag-files/rag-files"!</div>
}
