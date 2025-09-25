import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { readLasFile } from '@/service/las-service'
import { 
  LasLoadingState,
  LasErrorState,
  LasNoDataState,
  LasFileStats,
  LasFileInfo,
  LasChartViewer,
  LasViewerHeader
} from '@/components/pages/seismic/las'
import type { LasData } from '@/service/las-service'

// Types for LAS viewer search parameters
interface LasViewerSearch {
  filename?: string
  maxDepth?: number
  dtMultiplier?: number
  curves?: string
}

export const Route = createFileRoute('/_private/_seismic/las-viewer')({
  component: App,
  validateSearch: (search: Record<string, unknown>): LasViewerSearch => ({
    filename: search.filename as string,
    maxDepth: search.maxDepth as number,
    dtMultiplier: search.dtMultiplier as number,
    curves: search.curves as string,
  }),
})

function App() {
  const { filename, maxDepth, dtMultiplier, curves } = Route.useSearch()
  const [lasData, setLasData] = useState<LasData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Fetch LAS data from API
  useEffect(() => {
    if (!filename) {
      setError('No filename provided')
      return
    }

    const loadLasData = async () => {
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
          ...(maxDepth && { maxDepth }),
          ...(dtMultiplier && { dtMultiplier }),
          ...(curves && { curves: curves.split(',') }),
        }

        const response = await readLasFile(requestBody)

        clearInterval(progressInterval)
        setLoadingProgress(100)
        
        // Small delay to show 100% progress
        setTimeout(() => {
          setLasData(response)
        }, 200)

      } catch (err: any) {
        setError(err.message || 'Failed to load LAS data')
      } finally {
        setIsLoading(false)
      }
    }

    loadLasData()
  }, [filename, maxDepth, dtMultiplier, curves])

  // Loading state
  if (isLoading) {
    return <LasLoadingState filename={filename || ''} loadingProgress={loadingProgress} />
  }

  // Error state
  if (error) {
    return <LasErrorState filename={filename} error={error} />
  }

  // No data state
  if (!lasData) {
    return <LasNoDataState />
  }

  return (
    <div className="container mx-auto space-y-6">
      {/* Header */}
      <LasViewerHeader />

      {/* File Information Stats */}
      <LasFileStats lasData={lasData} />

      {/* File Details */}
      <LasFileInfo lasData={lasData} maxDepth={maxDepth} />

      {/* LAS Chart */}
      <LasChartViewer lasData={lasData} />
    </div>
  )
}
