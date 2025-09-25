import React from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, FileX } from 'lucide-react'
import { AppRoute } from '@/constants/api'

export function LasNoDataState() {
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
            <p className="text-muted-foreground">No data available</p>
          </div>
        </div>
      </div>

      {/* No Data Card */}
      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30">
        <CardHeader>
          <CardTitle className="text-yellow-800 dark:text-yellow-200 flex items-center space-x-2">
            <FileX className="h-5 w-5" />
            <span>No LAS Data Available</span>
          </CardTitle>
          <CardDescription className="text-yellow-600 dark:text-yellow-400">
            The LAS file could not be loaded or contains no data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-700 dark:text-yellow-300">
            Please try selecting a different LAS file or check if the file is properly formatted.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}