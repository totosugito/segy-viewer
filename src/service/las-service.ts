import { useQuery } from '@tanstack/react-query'
import { fetchApi } from '@/lib/fetch-api'
import { AppApi } from '@/constants/api'

// Types
export interface LasFileInfo {
  name: string
  size: number
  well_name?: string
  api_number?: string | null
  num_curves: number
  num_data_points: number
  curve_names?: string[]
  version?: string | null
  wrap?: string | null
  [key: string]: any
}

export interface LasData {
  info: LasFileInfo
  data: Record<string, (number | null)[]>
  headers?: (number | null)[]
}

export interface LasReadRequest {
  filename: string
  maxDepth?: number
  dtMultiplier?: number
  curves?: string[]
}

// React Query hook for LAS list
export const useLasList = () => {
  return useQuery({
    queryKey: ['las-list'],
    queryFn: async (): Promise<LasFileInfo[]> => {
      return await fetchApi({
        method: 'GET',
        url: AppApi.seismicData.lasList,
      })
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Function to read LAS file data
export const readLasFile = async (request: LasReadRequest): Promise<LasData> => {
  return await fetchApi({
    method: 'POST',
    url: AppApi.seismicData.lasRead,
    body: request,
  })
}