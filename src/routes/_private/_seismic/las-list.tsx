import {createFileRoute} from '@tanstack/react-router'
import { LasListPage } from '@/components/pages/seismic/las'

export const Route = createFileRoute('/_private/_seismic/las-list')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LasListPage />
}
