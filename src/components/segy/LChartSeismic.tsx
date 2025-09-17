import React, { useEffect, useRef } from 'react';
import {
  AxisTickStrategies,
  ColorRGBA,
  lightningChart,
  PalettedFill,
  ChartXY,
  emptyLine,
  NumericTickStrategy,
  emptyFill,
} from '@arction/lcjs';

// Import utility functions
import {
  getLcColormap,
  get2dMinData,
  get2dMaxData
} from './utils/colormap';
import { createColorObject } from './utils/libLC';
import { cn } from '@/lib/utils';

interface ColorMapData {
  id: number;
  reverse?: boolean;
}

interface DataProps {
  title: string;
  ntrc: number;
  nsp: number;
  dt: number;
  xAxis: {
    label: string;
    data: number[]; // Array of actual X-axis values (e.g., trace numbers, shot points, etc.)
  };
  yAxis: {
    label: string;
    data: number[]; // Array of actual Y-axis values (e.g., time in ms, depth, etc.)
  };
}
interface LChartSeismicProps {
  dataProps: DataProps;
  points: number[][];
  colormap: ColorMapData;
  className?: string;
}

export const LChartSeismic: React.FC<LChartSeismicProps> = ({
  dataProps,
  points,
  colormap,
  className
}) => {
  const chartRef = useRef<ChartXY | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Constants
  const defColor = {
    background: ColorRGBA(250, 250, 250, 255),
    default: ColorRGBA(0, 0, 0, 255),
  };

  // Main effect to create/update chart when points change
  useEffect(() => {
    // Only proceed if we have points and container is ready
    if (!points || points.length <= 1 || !containerRef.current) {
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
      // Get actual data ranges
      const xDataStart = dataProps.xAxis.data?.[0] ?? 0;
      const xDataEnd = dataProps.xAxis.data?.[dataProps.ntrc - 1] ?? dataProps.ntrc;
      const yDataStart = dataProps.yAxis.data?.[0] ?? 0;
      const yDataEnd = dataProps.yAxis.data?.[dataProps.nsp - 1] ?? dataProps.nsp;

      // Create chartXY
      const chart = lightningChart().ChartXY({ container: containerRef.current })
        .setTitleFillStyle(grColor.default)
        .setBackgroundFillStyle(grColor.background)
        .setTitle(dataProps.title)
        .setTitleFont((font: any) => font
          .setSize(20) // Large font size for title
          .setWeight('bold') // Bold font weight
        );
      chartRef.current = chart;

      // Calculate min and max values from the actual data
      const minValue = get2dMinData(points);
      const maxValue = get2dMaxData(points);
      
      let newPalette = new PalettedFill({ lut: getLcColormap(colormap, minValue, maxValue) });

      // Create custom X-axis positioned at the top using actual data values
      const customXAxis = chart.addAxisX({ opposite: true }) // Position at top
        .setTitleFillStyle(grColor.default)
        .setInterval(xDataStart, xDataEnd) // Use actual data range
        .setTitle(dataProps.xAxis.label) // Remove title from X-axis
        .setTickStrategy(AxisTickStrategies.Numeric, (strategy: NumericTickStrategy) => strategy
          .setFormattingFunction((value: number) => Math.round(value).toString()) // No decimals
          .setMajorTickStyle((tickStyle: any) => tickStyle
            .setLabelFillStyle(grColor.default) // Set tick label color
            .setLabelFont((font: any) => font
              .setWeight('normal')
              .setSize(12)
            )
          )
          .setMinorTickStyle((tickStyle: any) => tickStyle
            .setLabelFillStyle(emptyFill)
          )
        )
        .disableAnimations()

      // Create custom Y-axis with reversed direction using actual data values
      const customYAxis = chart.addAxisY()
        .setTitleFillStyle(grColor.default)
        .setInterval(yDataEnd, yDataStart) // Reversed interval: high to low using actual data
        .setTitle(dataProps.yAxis.label)
        .setTickStrategy(AxisTickStrategies.Numeric, (strategy: NumericTickStrategy) => strategy
          .setFormattingFunction((value: number) => Math.round(value).toString()) // No decimals
          .setMajorTickStyle((tickStyle: any) => tickStyle
            .setLabelFillStyle(grColor.default) // Set tick label color
            .setLabelFont((font: any) => font
              .setWeight('normal')
              .setSize(12)
            )
          )
          .setMinorTickStyle((tickStyle: any) => tickStyle
            .setLabelFillStyle(emptyFill)
          )
        )
      // .setThickness(60)

      // Create heatmap series using actual data coordinates
      const heatmapSeries = chart.addHeatmapGridSeries({
        rows: dataProps.nsp,
        columns: dataProps.ntrc,
        start: { x: xDataStart, y: yDataStart }, // Use actual data coordinates
        end: { x: xDataEnd, y: yDataEnd },       // Use actual data coordinates
        xAxis: customXAxis,
        yAxis: customYAxis,
      })
        .setWireframeStyle(emptyLine)
        .invalidateIntensityValues(points)
        .setFillStyle(newPalette)
        .setCursorResultTableFormatter((builder: any, series: any, dataPoint: any) => {
          // Custom popup content for seismic data with justified layout
          const maxLabelWidth = 20; // Adjust this value to control spacing
          
          const formatRow = (label: string, value: string) => {
            const paddedLabel = label.padEnd(maxLabelWidth, ' ');
            return `${paddedLabel}${value}`;
          };
          
          return builder
            .addRow(formatRow(dataProps.xAxis.label, dataPoint.x ? Math.round(dataPoint.x).toString() : 'N/A'))
            .addRow(formatRow(dataProps.yAxis.label, dataPoint.y ? Math.round(dataPoint.y).toString() : 'N/A'))
            .addRow(formatRow('Amplitude', dataPoint.intensity ? dataPoint.intensity.toFixed(2) : 'N/A'))
        });

      // Dispose default axes
      chart.getDefaultAxisX().dispose();
      chart.getDefaultAxisY().dispose();

      // // Add X-axis title as a text element positioned on the left
      // chart.addUIElement()
      //   .setText(dataProps.xAxis.label) // Use the X-axis label (e.g., "Trace Number")
      //   .setPosition({ x: 5, y: 90 }) // Position on the left side
      //   .setOrigin({ x: 0, y: 0 })
      //   .setTextFillStyle(grColor.default)
      //   .setTextFont((font: any) => font
      //     .setSize(14)
      //     .setWeight('normal')
      //   );
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }, [points, colormap]);

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
      className={cn("p-2 h-[500px]", className)}
    />
  );
};