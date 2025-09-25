import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, BarChart3, Database, Hash } from 'lucide-react'

interface LasData {
  info: {
    name: string
    num_curves: number
    num_data_points: number
    [key: string]: any
  }
  data: Record<string, (number | null)[]>
  headers?: (number | null)[]
}

interface LasFileStatsProps {
  lasData: LasData
}

export function LasFileStats({ lasData }: LasFileStatsProps) {
  const totalCurves = Object.keys(lasData.data).length
  const totalDataPoints = lasData.headers?.length || 0
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30 p-0">
        <CardContent className="p-4">
          <div className="text-blue-800 dark:text-blue-200">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Total Curves
            </h3>
            <div className='flex flex-row items-center gap-4 my-2'>
              <BarChart3 className="h-5 w-5" />
              <p className="text-3xl font-bold">
                {totalCurves.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Well log curves</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30 p-0">
        <CardContent className="p-4">
          <div className="text-green-800 dark:text-green-200">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Data Points
            </h3>
            <div className='flex flex-row items-center gap-4 my-2'>
              <Database className="h-5 w-5" />
              <p className="text-3xl font-bold">
                {totalDataPoints.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">Depth/time samples</p>
          </div>
        </CardContent>
      </Card>

      {/* <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/30 p-0">
        <CardContent className="p-4">
          <div className="text-purple-800 dark:text-purple-200">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Available Curves
            </h3>
            <div className='flex flex-row items-center gap-4 my-2'>
              <Activity className="h-5 w-5" />
              <p className="text-3xl font-bold">
                {lasData.info.num_curves?.toLocaleString() || totalCurves.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Measurement types</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30 p-0">
        <CardContent className="p-4">
          <div className="text-orange-800 dark:text-orange-200">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Total Points
            </h3>
            <div className='flex flex-row items-center gap-4 my-2'>
              <Hash className="h-5 w-5" />
              <p className="text-3xl font-bold">
                {lasData.info.num_data_points?.toLocaleString() || totalDataPoints.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">File data points</p>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}