import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react';
import { createWaterDropDataGenerator } from '@arction/xydata';
import { LChartSeismic } from '@/components/segy';
export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  // State to hold water drop generated data
  const [points, setPoints] = useState<number[][]>([[]]);
  const dataProps = {
    title: "Seismic Viewer",
    ntrc: 100, // number of columns
    nsp: 100,  // number of rows
    dt: 0.004, // second
    xAxis: {
      label: "Trace Number",
      data: Array.from({ length: 100 }, (_, i) => i + 1)
    },
    yAxis: {
      label: "Time (ms)",
      data: Array.from({ length: 100 }, (_, i) => (i + 1) * 0.04 * 1000)
    }
  }
  const colormap = {
    id: 2, // Seismic colormap
    reverse: false
  }

  // Initialize with createWaterDropDataGenerator
  useEffect(() => {
    createWaterDropDataGenerator()
      .setRows(dataProps.nsp)
      .setColumns(dataProps.ntrc)
      .generate()
      .then((data: any) => {
        setPoints(data);
      })
      .catch((error: any) => {
      });
  }, []);

  return (
    <div className="text-center">
      <LChartSeismic
        dataProps={dataProps}
        points={points}
        colormap={colormap}
      />
    </div>
  )
}
