import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Info, HardDrive, MapPin } from 'lucide-react'
import { formatFileSize } from '@/lib/my-utils'

interface LasData {
  info: {
    name: string
    size?: number
    well_name?: string
    api_number?: string | null
    version?: string | null
    wrap?: string | null
    curve_names?: string[]
    [key: string]: any
  }
  data: Record<string, (number | null)[]>
  headers?: (number | null)[]
}

interface LasFileInfoProps {
  lasData: LasData
  maxDepth?: number
}

export function LasFileInfo({ lasData, maxDepth }: LasFileInfoProps) {
  return (
    <Card className='cardStyles'>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Info className="h-5 w-5" />
          <span>File Information</span>
        </CardTitle>
        <CardDescription>
          Detailed information about the loaded LAS file
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">File Name</p>
            <p className="font-mono text-sm">{lasData.info.name}</p>
          </div>
          
          {lasData.info.well_name && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Well Name</p>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary">{lasData.info.well_name}</Badge>
              </div>
            </div>
          )}
          
          {lasData.info.version && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">LAS Version</p>
              <Badge variant="outline">{lasData.info.version}</Badge>
            </div>
          )}
          
          {lasData.info.api_number && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">API Number</p>
              <p className="font-mono text-sm">{lasData.info.api_number}</p>
            </div>
          )}
          
          {lasData.info.wrap && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Wrap Mode</p>
              <Badge variant="secondary">{lasData.info.wrap}</Badge>
            </div>
          )}
          
          {lasData.info.size && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">File Size</p>
              <div className="flex items-center space-x-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline">{formatFileSize(lasData.info.size)}</Badge>
              </div>
            </div>
          )}
          
          {maxDepth && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Max Depth (Limited)</p>
              <Badge variant="destructive">{maxDepth.toLocaleString()}</Badge>
            </div>
          )}
        </div>
        
        {/* {lasData.info.curve_names && lasData.info.curve_names.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-muted-foreground mb-3">Available Curves</p>
            <div className="flex flex-wrap gap-2">
              {lasData.info.curve_names.map((curve, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {curve}
                </Badge>
              ))}
            </div>
          </div>
        )} */}
      </CardContent>
    </Card>
  )
}