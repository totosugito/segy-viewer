import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Info, HardDrive } from 'lucide-react'
import { formatFileSize } from '@/lib/my-utils'

interface SegyData {
  info: {
    name: string
    ntrc: number
    nsp: number
    dt: number
    format: string
    header?: string
    size?: number
    [key: string]: any
  }
  data: number[][]
  headers?: number[]
}

interface SegyFileInfoProps {
  segyData: SegyData
  maxNtrc?: number
}

export function SegyFileInfo({ segyData, maxNtrc }: SegyFileInfoProps) {
  return (
    <Card className='cardStyles'>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Info className="h-5 w-5" />
          <span>File Information</span>
        </CardTitle>
        <CardDescription>
          Detailed information about the loaded SEGY file
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">File Name</p>
            <p className="font-mono text-sm">{segyData.info.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Header Type</p>
            <Badge variant="secondary">{segyData.info.header?.toUpperCase() || 'DEFAULT'}</Badge>
          </div>
          {segyData.info.size && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">File Size</p>
              <div className="flex items-center space-x-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline">{formatFileSize(segyData.info.size)}</Badge>
              </div>
            </div>
          )}
          {maxNtrc && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Max Traces (Limited)</p>
              <Badge variant="destructive">{maxNtrc.toLocaleString()}</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}