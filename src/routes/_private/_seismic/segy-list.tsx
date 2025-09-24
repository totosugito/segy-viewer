import { createFileRoute } from '@tanstack/react-router'
import { SegyListPage } from '@/components/pages/seismic/segy'

export const Route = createFileRoute('/_private/_seismic/segy-list')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SegyListPage />
}
