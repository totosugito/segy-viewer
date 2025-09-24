import { useQuery } from '@tanstack/react-query'
import { fetchApi } from '@/lib/fetch-api'
import { AppApi } from '@/constants/api'

// Types
export interface SegyFileInfo {
  name: string
  ntrc: number
  nsp: number
  dt: number
  header: string
  size: number
  format: string
  dtMultiplier: number
  [key: string]: any
}

// React Query hook
export const useSegyList = () => {
  return useQuery({
    queryKey: ['segy-list'],
    queryFn: async (): Promise<SegyFileInfo[]> => {
      return await fetchApi({
        method: 'GET',
        url: AppApi.seismicData.segyList,
      })
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}