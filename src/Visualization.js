import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

function Visualization({ data, centroids, clusters, manualMode, onPointClick }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    const datasets = [
      {
        label: 'Data Points',
        data: data,
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        pointRadius: 5,
      },
      {
        label: 'Centroids',
        data: centroids,
        backgroundColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 8,
      },
    ];

    // Add clustered data points
    clusters.forEach((cluster, index) => {
      datasets.push({
        label: `Cluster ${index + 1}`,
        data: cluster,
        backgroundColor: `hsla(${index * 360 / clusters.length}, 100%, 50%, 0.5)`,
        pointRadius: 5,
      });
    });

    chartInstance.current = new Chart(ctx, {
      type: 'scatter',
      data: { datasets },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            min: 0,
            max: 100,
          },
          y: {
            type: 'linear',
            position: 'left',
            min: 0,
            max: 100,
          },
        },
        onClick: (event, elements) => {
          if (manualMode && elements.length > 0) {
            const clickedPoint = data[elements[0].index];
            onPointClick(clickedPoint);
          }
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, centroids, clusters, manualMode, onPointClick]);

  return <canvas ref={chartRef} />;
}

export default Visualization;