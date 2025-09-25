import React from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { AppRoute } from '@/constants/api'

interface SegyLoadingStateProps {
  filename: string
  loadingProgress: number
}

export function SegyLoadingState({ filename, loadingProgress }: SegyLoadingStateProps) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to={AppRoute.dataManagement.segyList.url}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to File List
            </Link>
          </Button>
          <div>
            <p className="text-muted-foreground">Loading {filename}</p>
          </div>
        </div>
      </div>

      {/* Loading Card */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span>Loading SEGY File</span>
          </CardTitle>
          <CardDescription>
            Processing seismic data from {filename}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              {loadingProgress < 100 ? `Loading... ${Math.round(loadingProgress)}%` : 'Almost ready!'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}