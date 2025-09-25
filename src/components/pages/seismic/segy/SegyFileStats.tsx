import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Activity, Database, Clock, FileText } from 'lucide-react'

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

interface SegyFileStatsProps {
  segyData: SegyData
}

export function SegyFileStats({ segyData }: SegyFileStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30 p-0">
        <CardContent className="p-4">
          <div className="text-blue-800 dark:text-blue-200">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Total Traces
            </h3>
            <div className='flex flex-row items-center gap-4 my-2'>
              <Activity className="h-5 w-5" />
              <p className="text-3xl font-bold">
                {segyData.info.ntrc?.toLocaleString() || 0}
              </p>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Seismic traces</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30 p-0">
        <CardContent className="p-4">
          <div className="text-green-800 dark:text-green-200">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Sample Points
            </h3>
            <div className='flex flex-row items-center gap-4 my-2'>
              <Database className="h-5 w-5" />
              <p className="text-3xl font-bold">
                {segyData.info.nsp?.toLocaleString() || 0}
              </p>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">Data points per trace</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/30 p-0">
        <CardContent className="p-4">
          <div className="text-purple-800 dark:text-purple-200">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Sample Rate
            </h3>
            <div className='flex flex-row items-center gap-4 my-2'>
              <Clock className="h-5 w-5" />
              <p className="text-3xl font-bold">
                {segyData.info.dt || 0}
              </p>
            </div>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Milliseconds</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30 p-0">
        <CardContent className="p-4">
          <div className="text-orange-800 dark:text-orange-200">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Data Format
            </h3>
            <div className='flex flex-row items-center gap-4 my-2'>
              <FileText className="h-5 w-5" />
              <p className="text-3xl font-bold truncate">
                {segyData.info.format || 'N/A'}
              </p>
            </div>
            <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">File format</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}