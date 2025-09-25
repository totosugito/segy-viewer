import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { fetchApi } from '@/lib/fetch-api'
import { AppApi } from '@/constants/api'
import { LChartSeismic } from '@/components/segy'
import { Card, CardContent } from '@/components/ui/card'
import { SkeLoading } from '@/components/custom/skeleton'

// Types for SEGY data
interface SegyData {
  info: {
    name: string
    ntrc: number
    nsp: number
    dt: number
    format: string
    [key: string]: any
  }
  data: number[][]
  headers?: number[]
}

interface SegyViewerSearch {
  filename?: string
  maxNtrc?: number
  dtMultiplier?: number
  header?: string
}

export const Route = createFileRoute('/_private/_seismic/segy-viewer')({
  component: App,
  validateSearch: (search: Record<string, unknown>): SegyViewerSearch => ({
    filename: search.filename as string,
    maxNtrc: search.maxNtrc as number,
    dtMultiplier: search.dtMultiplier as number,
    header: search.header as string,
  }),
})

function App() {
  const { filename, maxNtrc, dtMultiplier, header } = Route.useSearch()
  const [segyData, setSegyData] = useState<SegyData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch SEGY data from API
  useEffect(() => {
    if (!filename) {
      setError('No filename provided')
      return
    }

    const loadSegyData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const requestBody = {
          filename,
          ...(maxNtrc && { maxNtrc }),
          ...(dtMultiplier && { dtMultiplier }),
          ...(header && { header }),
        }

        const response = await fetchApi({
          method: 'POST',
          url: AppApi.seismicData.segyRead,
          body: requestBody,
        })

        setSegyData(response)
      } catch (err: any) {
        setError(err.message || 'Failed to load SEGY data')
      } finally {
        setIsLoading(false)
      }
    }

    loadSegyData()
  }, [filename, maxNtrc, dtMultiplier, header])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-6">
          <CardContent>
            <SkeLoading loading={true} />
            <p className="text-center mt-4">Loading SEGY file: {filename}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-6">
          <CardContent>
            <div className="text-center text-red-500">
              <h2 className="text-xl font-bold mb-2">Error Loading SEGY File</h2>
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // No data state
  if (!segyData) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-6">
          <CardContent>
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">No SEGY File Selected</h2>
              <p>Please select a SEGY file from the file list.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Prepare data for the chart component
  const dataProps = {
    title: segyData.info.name,
    ntrc: segyData.info.ntrc,
    nsp: segyData.info.nsp / (dtMultiplier ?? 1),
    dt: segyData.info.dt,
    xAxis: {
      label: segyData.info.header.toUpperCase(),
      data: segyData.headers || Array.from({ length: segyData.info.ntrc }, (_, i) => i + 1)
    },
    yAxis: {
      label: "Time (ms)",
      data: Array.from({ length: segyData.info.nsp }, (_, i) => (i + 1) * (segyData.info.dt * (dtMultiplier ?? 1)))
    }
  }

  const colormap = {
    id: 2, // Seismic colormap
    reverse: false
  }

  return (
    <div className="w-full h-full">
      <LChartSeismic
        dataProps={dataProps}
        points={segyData.data}
        colormap={colormap}
      />
    </div>
  )
}
