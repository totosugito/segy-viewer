import React from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Info } from 'lucide-react'
import { AppRoute } from '@/constants/api'

interface LasErrorStateProps {
  filename?: string
  error: string
}

export function LasErrorState({ filename, error }: LasErrorStateProps) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to={AppRoute.dataManagement.lasList.url}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to File List
            </Link>
          </Button>
          <div>
            <p className="text-muted-foreground">Error loading file</p>
          </div>
        </div>
      </div>

      {/* Error Card */}
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
        <CardHeader>
          <CardTitle className="text-red-800 dark:text-red-200 flex items-center space-x-2">
            <Info className="h-5 w-5" />
            <span>Error Loading LAS File</span>
          </CardTitle>
          <CardDescription className="text-red-600 dark:text-red-400">
            {filename ? `Failed to load ${filename}` : 'Failed to load LAS file'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
          <div className="mt-4">
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}