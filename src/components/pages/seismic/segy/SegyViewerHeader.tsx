import React from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { AppRoute } from '@/constants/api'

export function SegyViewerHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to={AppRoute.dataManagement.segyList.url}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to File List
          </Link>
        </Button>
        <div>
        </div>
      </div>
    </div>
  )
}