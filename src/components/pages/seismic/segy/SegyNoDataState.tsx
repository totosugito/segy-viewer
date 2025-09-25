import React from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, FileText } from 'lucide-react'
import { AppRoute } from '@/constants/api'

export function SegyNoDataState() {
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
            <h1 className="text-3xl font-bold">SEGY Viewer</h1>
            <p className="text-muted-foreground">No file selected</p>
          </div>
        </div>
      </div>

      {/* No Data Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span>No SEGY File Selected</span>
          </CardTitle>
          <CardDescription>
            Please select a SEGY file from the file list to view it here.
          </CardDescription>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>
    </div>
  )
}