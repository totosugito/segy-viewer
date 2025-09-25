import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { LChartSeismic } from '@/components/seismic'
import { Activity, Palette, RotateCcw } from 'lucide-react'
import { getColormapName, getColormapAsset } from '@/components/seismic/utils/colormap'

interface SegyData {
    info: {
        name: string
        ntrc: number
        nsp: number
        dt: number
        format: string
        header?: string
        [key: string]: any
    }
    data: number[][]
    headers?: number[]
}

interface SegyChartViewerProps {
    segyData: SegyData
    dtMultiplier?: number
    minValue?: number
    maxValue?: number
}

export function SegyChartViewer({ segyData, dtMultiplier, minValue, maxValue }: SegyChartViewerProps) {
    // State for colormap controls
    const [selectedColormap, setSelectedColormap] = useState(2) // Default to Seismic
    const [isReversed, setIsReversed] = useState(false)

    // State for percentage controls
    const [percMin, setPercMin] = useState([95]) // Default 95%
    const [percMax, setPercMax] = useState([95]) // Default 95%

    // Reset function to restore all defaults
    const resetToDefaults = () => {
        setSelectedColormap(2) // Seismic
        setIsReversed(false)
        setPercMin([95])
        setPercMax([95])
    }

    // Available colormaps
    const colormaps = [
        { id: 0, name: 'Sharp' },
        { id: 1, name: 'YRWBC' },
        { id: 2, name: 'Seismic' },
        { id: 3, name: 'Petrel' },
        { id: 4, name: 'Gray' },
        { id: 5, name: 'Density' },
    ]
    // Prepare data for the chart component
    const dataProps = {
        title: segyData.info.name,
        ntrc: segyData.info.ntrc,
        nsp: segyData.info.nsp / (dtMultiplier ?? 1),
        dt: segyData.info.dt,
        xAxis: {
            label: segyData.info.header?.toUpperCase() || 'TRACE',
            data: segyData.headers || Array.from({ length: segyData.info.ntrc }, (_, i) => i + 1)
        },
        yAxis: {
            label: "Time (ms)",
            data: Array.from({ length: segyData.info.nsp }, (_, i) => (i + 1) * (segyData.info.dt * (dtMultiplier ?? 1)))
        }
    }

    const colormap = {
        id: selectedColormap,
        reverse: isReversed
    }

    return (
        <Card className='cardStyles'>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Seismic Data Visualization</span>
                </CardTitle>
                <CardDescription>
                    Interactive seismic data visualization with zoom and hover capabilities
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                {/* Colormap Toolbar */}
                <div className="flex items-center p-2 border-y bg-muted gap-4 justify-between">
                    <div className='flex flex-row gap-2 flex-wrap'>
                        <div className="flex items-center space-x-4">
                            <Select
                                value={selectedColormap.toString()}
                                onValueChange={(value) => setSelectedColormap(parseInt(value))}
                            >
                                <SelectTrigger className="w-[180px]" id="colormap-select">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {colormaps.map((cm) => (
                                        <SelectItem key={cm.id} value={cm.id.toString()}>
                                            <div className="flex items-center space-x-2">
                                                <img
                                                    src={getColormapAsset(cm.id)}
                                                    alt={cm.name}
                                                    className="h-4 w-16 object-cover rounded"
                                                />
                                                <span>{cm.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Label htmlFor="reverse-switch" className="text-sm font-medium">
                                Reverse:
                            </Label>
                            <Switch
                                id="reverse-switch"
                                checked={isReversed}
                                onCheckedChange={setIsReversed}
                            />
                        </div>

                        {/* Vertical Separator */}
                        <div className='mx-2 h-8 w-0.5 bg-border'></div>

                        {/* Percentage Controls */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="perc-min" className="text-sm font-medium whitespace-nowrap">
                                    Min %:
                                </Label>
                                <div className="w-20">
                                    <Slider
                                        id="perc-min"
                                        value={percMin}
                                        onValueChange={setPercMin}
                                        max={100}
                                        min={0}
                                        step={1}
                                        className="w-full"
                                    />
                                </div>
                                <span className="text-xs text-muted-foreground w-8 text-right">
                                    {percMin[0]}%
                                </span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Label htmlFor="perc-max" className="text-sm font-medium whitespace-nowrap">
                                    Max %:
                                </Label>
                                <div className="w-20">
                                    <Slider
                                        id="perc-max"
                                        value={percMax}
                                        onValueChange={setPercMax}
                                        max={100}
                                        min={0}
                                        step={1}
                                        className="w-full"
                                    />
                                </div>
                                <span className="text-xs text-muted-foreground w-8 text-right">
                                    {percMax[0]}%
                                </span>
                            </div>
                        </div>
                        <div className='mx-2 h-8 w-0.5 bg-border'></div>
                    </div>
                    {/* Reset Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={resetToDefaults}
                        className="flex items-center space-x-1 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                        <RotateCcw className="h-3 w-3" />
                        <span>Reset</span>
                    </Button>
                </div>

                <div className="h-[600px] w-full overflow-hidden p-2">
                    <LChartSeismic
                        dataProps={dataProps}
                        points={segyData.data}
                        colormap={colormap}
                        className="h-full w-full p-0"
                        minValue={minValue}
                        maxValue={maxValue}
                        perc={{ min: percMin[0], max: percMax[0] }}
                    />
                </div>
            </CardContent>
        </Card>
    )
}