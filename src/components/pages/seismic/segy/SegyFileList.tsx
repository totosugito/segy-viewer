import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useSegyList, type SegyFileInfo } from '@/service/segy-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { SkeLoading } from '@/components/custom/skeleton'
import { DataTable, useDataTable } from '@/components/custom/table'
import { ColumnDef } from '@tanstack/react-table'
import { Search, FileText, Eye } from 'lucide-react'
import { AppRoute } from '@/constants/api'

interface SegyFileListProps {
  onFileSelect?: (file: SegyFileInfo) => void
}

export function SegyFileList({ onFileSelect }: SegyFileListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: files = [], isLoading, error } = useSegyList()

  // Filter files based on search term
  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const columns: ColumnDef<SegyFileInfo>[] = [
    {
      accessorKey: 'name',
      header: 'File Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-blue-500" />
          <span className="font-medium">{row.getValue('name')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'ntrc',
      header: 'Traces',
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.getValue('ntrc')}
        </Badge>
      ),
    },
    {
      accessorKey: 'nsp',
      header: 'Samples',
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.getValue('nsp')}
        </Badge>
      ),
    },
    {
      accessorKey: 'dt',
      header: 'Sample Rate (ms)',
      cell: ({ row }) => (
        <span className="text-sm">
          {row.getValue('dt')}
        </span>
      ),
    },
    {
      accessorKey: 'format',
      header: 'Format',
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.getValue('format')}
        </Badge>
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
              to={AppRoute.dataManagement.segyViewer.url}
              search={{ filename: row.original.name, dtMultiplier: row.original.dtMultiplier, header: row.original.header }}
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
            Error loading SEGY files: {error.message}
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
          <h1 className="text-3xl font-bold">SEGY Files</h1>
          <p className="text-muted-foreground">
            Manage and view seismic SEGY files
          </p>
        </div>
        <div className="flex items-center space-x-2">
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Files</CardTitle>
          <CardDescription>
            Find SEGY files by name
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search SEGY files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Files Table */}
      <Card>
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