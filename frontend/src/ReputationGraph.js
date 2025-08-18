import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function ReputationGraph({ muskScores = [], trumpScores = [] }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Prepare data for chart
      const muskData = muskScores.slice(0, 20).reverse().map(score => ({
        x: new Date(score.timestamp).toLocaleDateString(),
        y: score.score
      }));

      const trumpData = trumpScores.slice(0, 20).reverse().map(score => ({
        x: new Date(score.timestamp).toLocaleDateString(),
        y: score.score
      }));

      // Get unique labels (dates) from both datasets
      const allDates = [...new Set([...muskData.map(d => d.x), ...trumpData.map(d => d.x)])].sort();
      
      // Create chart
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: allDates,
          datasets: [
            {
              label: 'Elon Musk',
              data: muskData.map(d => d.y),
              borderColor: 'rgb(79, 172, 254)',
              backgroundColor: 'rgba(79, 172, 254, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointRadius: 6,
              pointHoverRadius: 8,
            },
            {
              label: 'Donald Trump',
              data: trumpData.map(d => d.y),
              borderColor: 'rgb(250, 112, 154)',
              backgroundColor: 'rgba(250, 112, 154, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointRadius: 6,
              pointHoverRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            title: {
              display: true,
              text: 'Reputation Score Trends',
              font: {
                size: 18,
                weight: 'bold'
              },
              padding: 20
            },
            legend: {
              display: true,
              position: 'top',
              labels: {
                usePointStyle: true,
                font: {
                  size: 14,
                  weight: 'bold'
                },
                padding: 20
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: 'white',
              bodyColor: 'white',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: true,
              callbacks: {
                title: function(context) {
                  return `Date: ${context[0].label}`;
                },
                label: function(context) {
                  return `${context.dataset.label}: ${context.parsed.y.toFixed(3)}`;
                }
              }
            }
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Date',
                font: {
                  size: 14,
                  weight: 'bold'
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Reputation Score',
                font: {
                  size: 14,
                  weight: 'bold'
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
              beginAtZero: false,
              min: -1,
              max: 1,
              ticks: {
                callback: function(value) {
                  return value.toFixed(2);
                }
              }
            },
          },
          elements: {
            line: {
              borderJoinStyle: 'round'
            },
            point: {
              borderWidth: 2,
              hoverBorderWidth: 4
            }
          }
        },
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [muskScores, trumpScores]);

  // Show message if no data
  if (!muskScores.length && !trumpScores.length) {
    return (
      <div className="chart-container">
        <div className="text-center py-5">
          <h4>Reputation Trends</h4>
          <p className="text-muted">No data available. Click "Collect New Data" to populate the chart.</p>
          <div className="mt-3">
            <div className="loading-spinner"></div>
            <p className="mt-2 text-muted">Waiting for data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div style={{ position: 'relative', height: '400px', width: '100%' }}>
        <canvas ref={chartRef}></canvas>
      </div>
      
      {/* Chart Statistics */}
      <div className="row mt-3 text-center">
        <div className="col-md-6">
          <div className="p-3" style={{ backgroundColor: 'rgba(79, 172, 254, 0.1)', borderRadius: '8px' }}>
            <h6 style={{ color: 'rgb(79, 172, 254)' }}>🚀 Elon Musk</h6>
            <p className="mb-1">Data Points: {muskScores.length}</p>
            {muskScores.length > 0 && (
              <>
                <p className="mb-1">Latest: {muskScores[0]?.score?.toFixed(3)}</p>
                <p className="mb-0">
                  Avg: {(muskScores.reduce((sum, s) => sum + s.score, 0) / muskScores.length).toFixed(3)}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="p-3" style={{ backgroundColor: 'rgba(250, 112, 154, 0.1)', borderRadius: '8px' }}>
            <h6 style={{ color: 'rgb(250, 112, 154)' }}>🇺🇸 Donald Trump</h6>
            <p className="mb-1">Data Points: {trumpScores.length}</p>
            {trumpScores.length > 0 && (
              <>
                <p className="mb-1">Latest: {trumpScores[0]?.score?.toFixed(3)}</p>
                <p className="mb-0">
                  Avg: {(trumpScores.reduce((sum, s) => sum + s.score, 0) / trumpScores.length).toFixed(3)}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Technical Details */}
      <div className="mt-3">
        <small className="text-muted">
          <strong>Chart Features:</strong> Interactive tooltips, trend analysis, real-time updates
          <br />
          <strong>Data Sources:</strong> AI-powered sentiment analysis, deep learning models, reputation scoring algorithms
        </small>
      </div>
    </div>
  );
}

export default ReputationGraph;