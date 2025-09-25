import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, useMemo } from 'react'
import { fetchApi } from '@/lib/fetch-api'
import { AppApi } from '@/constants/api'
import { get2dMinData, get2dMaxData } from '@/components/seismic/utils/colormap'
import { 
  SegyLoadingState,
  SegyErrorState,
  SegyNoDataState,
  SegyFileStats,
  SegyFileInfo,
  SegyChartViewer,
  SegyViewerHeader
} from '@/components/pages/seismic/segy'

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
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Compute min and max values once using useMemo for performance
  const { minValue, maxValue } = useMemo(() => {
    if (!segyData?.data || segyData.data.length === 0) {
      return { minValue: 0, maxValue: 0 }
    }
    return {
      minValue: get2dMinData(segyData.data),
      maxValue: get2dMaxData(segyData.data)
    }
  }, [segyData?.data])

  // Fetch SEGY data from API
  useEffect(() => {
    if (!filename) {
      setError('No filename provided')
      return
    }

    const loadSegyData = async () => {
      setIsLoading(true)
      setError(null)
      setLoadingProgress(0)
      
      try {
        // Simulate loading progress
        const progressInterval = setInterval(() => {
          setLoadingProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return prev
            }
            return prev + Math.random() * 10
          })
        }, 100)

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

        clearInterval(progressInterval)
        setLoadingProgress(100)
        
        // Small delay to show 100% progress
        setTimeout(() => {
          setSegyData(response)
        }, 200)

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
    return <SegyLoadingState filename={filename || ''} loadingProgress={loadingProgress} />
  }

  // Error state
  if (error) {
    return <SegyErrorState filename={filename} error={error} />
  }

  // No data state
  if (!segyData) {
    return <SegyNoDataState />
  }

  return (
    <div className="container mx-auto space-y-6">
      {/* Header */}
      <SegyViewerHeader />

      {/* File Information Stats */}
      <SegyFileStats segyData={segyData} />

      {/* File Details */}
      <SegyFileInfo segyData={segyData} maxNtrc={maxNtrc} />

      {/* Seismic Chart */}
      <SegyChartViewer 
        segyData={segyData} 
        dtMultiplier={dtMultiplier} 
        minValue={minValue}
        maxValue={maxValue}
      />
    </div>
  )
}
