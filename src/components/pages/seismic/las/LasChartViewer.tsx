import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { BarChart3, RefreshCw } from 'lucide-react'
import { LChartLas } from '@/components/seismic'

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

interface LasChartViewerProps {
  lasData: LasData
}

export function LasChartViewer({ lasData }: LasChartViewerProps) {
  // Get available curves (excluding null curves and TIME/DEPT index curves)
  const availableCurves = Object.keys(lasData.data).filter(curveName => {
    const curveData = lasData.data[curveName]
    // Filter out null curves and common index curve names
    const isIndexCurve = ['TIME', 'DEPT', 'DEPTH', 'MD', 'TVD'].includes(curveName.toUpperCase())
    return curveData && curveData.some(value => value !== null) && !isIndexCurve
  })

  // State for selected curves (default to first 3 curves or all if less than 3)
  const [selectedCurves, setSelectedCurves] = useState<string[]>(
    availableCurves.slice(0, Math.min(3, availableCurves.length))
  )

  // Toggle curve selection
  const toggleCurve = (curveName: string) => {
    setSelectedCurves(prev => 
      prev.includes(curveName)
        ? prev.filter(name => name !== curveName)
        : [...prev, curveName]
    )
  }

  // Select all curves
  const selectAll = () => {
    setSelectedCurves(availableCurves)
  }

  // Clear all selections
  const clearAll = () => {
    setSelectedCurves([])
  }

  // Get index label (usually DEPT or TIME)
  const indexLabel = lasData.headers ? (
    lasData.headers.some(h => h !== null && h < 1000) ? 'TIME (ms)' : 'DEPTH (ft)'
  ) : 'INDEX'

  // Prepare data for the chart component
  const dataProps = {
    title: lasData.info.name,
    curves: availableCurves,
    totalPoints: lasData.headers?.length || 0,
    indexLabel: indexLabel,
  }

  return (
    <Card className='cardStyles'>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>Well Log Viewer</span>
        </CardTitle>
        <CardDescription>
          Interactive well log visualization with curve selection
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Curve Selection Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Select Curves to Display</h4>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={selectAll}
                disabled={selectedCurves.length === availableCurves.length}
              >
                Select All
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAll}
                disabled={selectedCurves.length === 0}
              >
                Clear All
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedCurves(availableCurves.slice(0, 3))}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>
          
          {/* Curve checkboxes */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {availableCurves.map((curveName) => (
              <div key={curveName} className="flex items-center space-x-2">
                <Checkbox
                  id={curveName}
                  checked={selectedCurves.includes(curveName)}
                  onCheckedChange={() => toggleCurve(curveName)}
                />
                <label
                  htmlFor={curveName}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {curveName}
                </label>
              </div>
            ))}
          </div>
          
          <div className="text-sm text-muted-foreground">
            {selectedCurves.length} of {availableCurves.length} curves selected
          </div>
        </div>

        {/* Individual Charts for Each Curve */}
        {selectedCurves.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 space-y-4 gap-4">
            {selectedCurves.map((curveName, index) => (
              <div key={curveName} className="border rounded-lg">
                {/* <div className="p-3 border-b bg-muted/50">
                  <h4 className="font-medium text-sm">{curveName}</h4>
                </div> */}
                <LChartLas
                  dataProps={dataProps}
                  data={lasData.data}
                  headers={lasData.headers || []}
                  index={index}
                  selectedCurves={[curveName]} // Single curve per chart
                  className="rounded-b-lg"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="border rounded-lg p-8 text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Select at least one curve to display the charts
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}