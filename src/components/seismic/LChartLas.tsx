import React, { useEffect, useRef, useState } from 'react';
import {
  lightningChart,
  ChartXY,
  ColorRGBA,
  AxisTickStrategies,
  NumericTickStrategy,
  emptyFill,
  SolidFill,
} from '@arction/lcjs';
import { createColorObject } from './utils/libLC';
import { cn } from '@/lib/utils';

interface LasDataProps {
  title: string;
  curves: string[]; // Array of curve names
  totalPoints: number;
  indexLabel: string; // Usually 'DEPT' or 'TIME'
}

interface LChartLasProps {
  dataProps: LasDataProps;
  data: Record<string, (number | null)[]>; // Dictionary with curve names as keys, allowing nulls
  headers: (number | null)[]; // Index values (depth/time), allowing nulls
  className?: string;
  selectedCurves?: string[]; // Optional: specific curves to display
  index: number;
}

export const LChartLas: React.FC<LChartLasProps> = ({
  dataProps,
  data,
  headers,
  className,
  selectedCurves,
  index=0
}) => {
  const chartRef = useRef<ChartXY | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [idxColor, setIdxColor] = useState<number>(index);

  // Constants
  const defColor = {
    background: ColorRGBA(250, 250, 250, 255),
    default: ColorRGBA(0, 0, 0, 255),
  };

  // Predefined colors for different curves
  const curveColors = [
    new SolidFill({ color: ColorRGBA(31, 119, 180, 255) }),   // Blue
    new SolidFill({ color: ColorRGBA(255, 127, 14, 255) }),   // Orange
    new SolidFill({ color: ColorRGBA(44, 160, 44, 255) }),    // Green
    new SolidFill({ color: ColorRGBA(214, 39, 40, 255) }),    // Red
    new SolidFill({ color: ColorRGBA(148, 103, 189, 255) }),  // Purple
    new SolidFill({ color: ColorRGBA(140, 86, 75, 255) }),    // Brown
    new SolidFill({ color: ColorRGBA(227, 119, 194, 255) }),  // Pink
    new SolidFill({ color: ColorRGBA(127, 127, 127, 255) }),  // Gray
    new SolidFill({ color: ColorRGBA(188, 189, 34, 255) }),   // Olive
    new SolidFill({ color: ColorRGBA(23, 190, 207, 255) }),   // Cyan
  ];

  // Main effect to create/update chart when data changes
  useEffect(() => {
    // Only proceed if we have data and container is ready
    if (!data || Object.keys(data).length === 0 || !containerRef.current) {
      return;
    }

    // Find TIME curve data to use as Y-axis
    const timeCurveNames = ['TIME', 'DEPT', 'DEPTH', 'MD', 'TVD'];
    const timeCurveName = timeCurveNames.find(name => data[name] && data[name].some(v => v !== null));
    const timeData = timeCurveName ? data[timeCurveName] : headers;
    
    if (!timeData || timeData.length === 0) {
      return;
    }

    // Clean up existing chart
    if (chartRef.current) {
      try {
        chartRef.current.dispose();
      } catch (error) {
        console.warn('Error disposing chart:', error);
      }
      chartRef.current = null;
    }

    const grColor = createColorObject(defColor);

    try {
      // Get full time range from TIME curve data (including all time points)
      const allTimeValues = timeData.filter(t => t !== null) as number[];
      const minIndex = Math.min(...allTimeValues);
      const maxIndex = Math.max(...allTimeValues);
      
      // Determine the actual label for Y-axis
      const yAxisLabel = timeCurveName ? timeCurveName : dataProps.indexLabel;

      // Create chartXY
      const chart = lightningChart().ChartXY({ container: containerRef.current })
        .setTitleMarginTop(-30)
        .setSeriesBackgroundFillStyle(grColor.background)
        .setBackgroundFillStyle(grColor.background);

      chartRef.current = chart;

      // Create Y-axis for depth/time (usually reversed for well logs)
      const yAxis = chart.addAxisY()
        .setTitleFillStyle(grColor.default)
        .setInterval(maxIndex, minIndex) // Reversed interval: high to low
        .setTitle(yAxisLabel)
        .setTickStrategy(AxisTickStrategies.Numeric, (strategy: NumericTickStrategy) => strategy
          .setFormattingFunction((value: number) => value.toFixed(1))
          .setMajorTickStyle((tickStyle: any) => tickStyle
            .setLabelFillStyle(grColor.default)
            .setLabelFont((font: any) => font
              .setWeight('normal')
              .setSize(12)
            )
          )
          .setMinorTickStyle((tickStyle: any) => tickStyle
            .setLabelFillStyle(emptyFill)
          )
        );

      // Filter curves to display
      const curvesToDisplay = selectedCurves || Object.keys(data);
      
      // Create separate X-axis for each curve
      curvesToDisplay.forEach((curveName, idx) => {
        const curveData = data[curveName];
        if (!curveData || curveData.length === 0) return;

        // Create data points for all indices - plot all data, let LightningChart handle nulls
        const allData: Array<{ x: number | null; y: number | null }> = [];
        for (let i = 0; i < Math.max(timeData.length, curveData.length); i++) {
          allData.push({ 
            x: curveData[i] || null, 
            y: timeData[i] || null 
          });
        }

        // Calculate value range for X-axis from non-null curve values only
        const validCurveValues = curveData.filter(v => v !== null) as number[];
        if (validCurveValues.length === 0) return;
        
        const curveValues = validCurveValues;
        const minValue = Math.min(...curveValues);
        const maxValue = Math.max(...curveValues);
        const padding = (maxValue - minValue) * 0.1; // 10% padding

        // Create X-axis for this curve
        const xAxis = chart.addAxisX({ opposite: true })
          .setTitleFillStyle(grColor.default)
        //   .setInterval(minValue - padding, maxValue + padding)
          .setTitle(curveName)
          .setTickStrategy(AxisTickStrategies.Numeric, (strategy: NumericTickStrategy) => strategy
            .setFormattingFunction((value: number) => value.toFixed(2))
            .setMajorTickStyle((tickStyle: any) => tickStyle
              .setLabelFillStyle(grColor.default)
              .setLabelFont((font: any) => font
                .setWeight('normal')
                .setSize(10)
              )
            )
            .setMinorTickStyle((tickStyle: any) => tickStyle
              .setLabelFillStyle(emptyFill)
            )
          );

        // Position the X-axis
        if (idx > 0) {
          xAxis.setThickness(40);
        }

        // Create line series for this curve
        const lineSeries = chart.addLineSeries({ 
          xAxis: xAxis, 
          yAxis: yAxis 
        })
          .setStrokeStyle((stroke) => stroke
            .setFillStyle(curveColors[idxColor % curveColors.length])
            .setThickness(2)
          )
          .setName(curveName)
          .setCursorResultTableFormatter((builder: any, series: any, dataPoint: any) => {
            return builder
              .addRow(`${yAxisLabel}: ${dataPoint.y?.toFixed(2) || 'N/A'}`)
              .addRow(`${curveName}: ${dataPoint.x?.toFixed(3) || 'N/A'}`);
          });

        // Add data to the series - plot all data points
        lineSeries.add(allData as any);
      });

      // Dispose default axes
      chart.getDefaultAxisX().dispose();
      chart.getDefaultAxisY().dispose();

    } catch (error) {
      console.error('Error creating LAS chart:', error);
    }
  }, [data, headers, selectedCurves]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        try {
          chartRef.current.dispose();
        } catch (error) {
          console.warn('Error disposing chart on unmount:', error);
        }
        chartRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("p-2 h-[600px]", className)}
    />
  );
};