import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useLasList, type LasFileInfo } from '@/service/las-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { SkeLoading } from '@/components/custom/skeleton'
import { DataTable, useDataTable } from '@/components/custom/table'
import { ColumnDef } from '@tanstack/react-table'
import { Search, FileText, Eye } from 'lucide-react'
import { AppRoute } from '@/constants/api'

interface LasFileListProps {
  onFileSelect?: (file: LasFileInfo) => void
}

export function LasFileList({ onFileSelect }: LasFileListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: files = [], isLoading, error } = useLasList()

  // Filter files based on search term
  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (file.well_name && file.well_name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const columns: ColumnDef<LasFileInfo>[] = [
    {
      accessorKey: 'name',
      header: 'File Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-green-500" />
          <Link
            to={AppRoute.dataManagement.lasViewer.url}
            search={{ filename: row.original.name }}
          >
            <span className="font-medium hover:text-primary hover:underline">{row.getValue('name')}</span>
          </Link>
        </div>
      ),
    },
    {
      accessorKey: 'well_name',
      header: 'Well Name',
      cell: ({ row }) => (
        <span className="text-sm">
          {row.getValue('well_name') || 'Unknown'}
        </span>
      ),
    },
    {
      accessorKey: 'num_curves',
      header: 'Curves',
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.getValue('num_curves')}
        </Badge>
      ),
    },
    {
      accessorKey: 'num_data_points',
      header: 'Data Points',
      cell: ({ row }) => (
        <Badge variant="outline">
          {(row.getValue('num_data_points') as number).toLocaleString()}
        </Badge>
      ),
    },
    {
      accessorKey: 'api_number',
      header: 'API Number',
      cell: ({ row }) => (
        <span className="text-sm font-mono">
          {row.getValue('api_number') || 'N/A'}
        </span>
      ),
    },
    {
      accessorKey: 'size',
      header: 'File Size',
      cell: ({ row }) => (
        <div>
          {formatFileSize(row.getValue('size'))}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <Link
              to={AppRoute.dataManagement.lasViewer.url}
              search={{ filename: row.original.name }}
            >
              <Eye className="h-4 w-4 mr-1" /> View
            </Link>
          </Button>
        </div>
      ),
    },
  ]

  const { table } = useDataTable({
    data: filteredFiles,
    columns,
    pageCount: -1,
  })

  if (isLoading) {
    return <SkeLoading loading={true} />
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">
            Error loading LAS files: {error.message}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">LAS Files</h1>
          <p className="text-muted-foreground">
            Manage and view well log LAS files
          </p>
        </div>
        <div className="flex items-center space-x-2">
        </div>
      </div>

      {/* Search */}
      <Card className='cardStyles'>
        <CardHeader>
          <CardTitle>Search Files</CardTitle>
          <CardDescription>
            Find LAS files by name or well name
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search LAS files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Files Table */}
      <Card className='cardStyles'>
        <CardHeader>
          <CardTitle>
            Available Files ({filteredFiles.length})
          </CardTitle>
          <CardDescription>
            Click on a file to view its details or load it in the viewer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable table={table} />
        </CardContent>
      </Card>
    </div>
  )
}