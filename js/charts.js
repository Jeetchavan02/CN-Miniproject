/**
 * charts.js - Chart.js visualizations for Results page
 * Supports switching between "Our Results" and "Paper Results (Mücke et al., 2025)"
 */

let resultsData = null;
let currentDataSet = 'our'; // 'our' | 'paper'

let chartAvgLoad = null;
let chartLoss = null;
let chartSetup = null;
let chartRadar = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadResultsData();
  initToggleControls();
  renderAllCharts();
});

async function loadResultsData() {
  try {
    const res = await fetch('data/results.json');
    resultsData = await res.json();
  } catch (e) {
    console.error('Failed to load results.json, fallback to embedded model:', e);
    resultsData = {
      protocols: ["HTTP/1.1", "HTTP/2", "HTTP/3"],
      avgLoadTime: [1850, 920, 640],
      loadVsPacketLoss: {
        packetLoss: [0, 1, 2, 5],
        http1: [1850, 2900, 4100, 7200],
        http2: [920, 1400, 2100, 3800],
        http3: [640, 680, 720, 810]
      },
      connectionSetup: [320, 180, 45],
      radarData: {
        labels: ["Speed", "Loss Resilience", "Low Latency", "Multiplexing", "Security"],
        http1: [2, 1, 2, 1, 2],
        http2: [4, 3, 3, 4, 4],
        http3: [5, 5, 5, 5, 5]
      },
      paperResults: {
        avgLoadTime: [2100, 1050, 710],
        loadVsPacketLoss: {
          packetLoss: [0, 1, 2, 5],
          http1: [2100, 3200, 4800, 8600],
          http2: [1050, 1620, 2450, 4200],
          http3: [710, 740, 790, 890]
        },
        connectionSetup: [360, 200, 52],
        radarData: {
          labels: ["Speed", "Loss Resilience", "Low Latency", "Multiplexing", "Security"],
          http1: [2, 1, 2, 1, 2],
          http2: [4, 2.8, 3.2, 4.2, 4],
          http3: [4.8, 4.9, 4.9, 5, 5]
        }
      }
    };
  }
}

function initToggleControls() {
  const btnOur = document.getElementById('toggle-our');
  const btnPaper = document.getElementById('toggle-paper');

  if (btnOur && btnPaper) {
    btnOur.addEventListener('click', () => {
      if (currentDataSet === 'our') return;
      currentDataSet = 'our';
      btnOur.classList.add('active');
      btnPaper.classList.remove('active');
      updateAllCharts();
    });

    btnPaper.addEventListener('click', () => {
      if (currentDataSet === 'paper') return;
      currentDataSet = 'paper';
      btnPaper.classList.add('active');
      btnOur.classList.remove('active');
      updateAllCharts();
    });
  }
}

function getActiveData() {
  if (currentDataSet === 'paper' && resultsData.paperResults) {
    return {
      protocols: resultsData.protocols,
      avgLoadTime: resultsData.paperResults.avgLoadTime,
      loadVsPacketLoss: resultsData.paperResults.loadVsPacketLoss,
      connectionSetup: resultsData.paperResults.connectionSetup,
      radarData: resultsData.paperResults.radarData
    };
  }
  return resultsData;
}

function applyChartTheme() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  Chart.defaults.color = isLight ? '#334155' : '#94a3b8';
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.borderColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
}

window.addEventListener('themeChange', () => {
  if (typeof Chart === 'undefined') return;
  applyChartTheme();
  
  // Update radar chart scales for light/dark
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  if (chartRadar) {
    chartRadar.options.scales.r.angleLines.color = isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.1)';
    chartRadar.options.scales.r.grid.color = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
    chartRadar.options.scales.r.pointLabels.color = isLight ? '#0f172a' : '#cbd5e1';
    chartRadar.options.scales.r.ticks.color = isLight ? '#475569' : '#64748b';
  }
  if (chartAvgLoad) {
    chartAvgLoad.options.scales.y.title.color = isLight ? '#475569' : '#64748b';
  }
  if (chartLoss) {
    chartLoss.options.scales.y.title.color = isLight ? '#475569' : '#64748b';
    chartLoss.options.scales.x.title.color = isLight ? '#475569' : '#64748b';
  }
  if (chartSetup) {
    chartSetup.options.scales.y.title.color = isLight ? '#475569' : '#64748b';
  }
  updateAllCharts();
});

function renderAllCharts() {
  if (typeof Chart === 'undefined') {
    console.error('Chart.js not loaded!');
    return;
  }

  // Common styling configuration
  applyChartTheme();

  const data = getActiveData();

  // Chart 1: Average Page Load Time (Bar)
  const ctx1 = document.getElementById('chart-avg-load')?.getContext('2d');
  if (ctx1) {
    chartAvgLoad = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: data.protocols,
        datasets: [{
          label: 'Page Load Time (ms)',
          data: data.avgLoadTime,
          backgroundColor: [
            'rgba(67, 97, 238, 0.75)',
            'rgba(157, 78, 221, 0.75)',
            'rgba(0, 212, 255, 0.85)'
          ],
          borderColor: [
            '#4361ee',
            '#9d4edd',
            '#00d4ff'
          ],
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y} ms`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Time in Milliseconds (ms)', color: '#64748b' }
          }
        }
      }
    });
  }

  // Chart 2: Load Time vs Packet Loss (Line)
  const ctx2 = document.getElementById('chart-loss')?.getContext('2d');
  if (ctx2) {
    chartLoss = new Chart(ctx2, {
      type: 'line',
      data: {
        labels: data.loadVsPacketLoss.packetLoss.map(p => `${p}% Loss`),
        datasets: [
          {
            label: 'HTTP/1.1',
            data: data.loadVsPacketLoss.http1,
            borderColor: '#ef476f',
            backgroundColor: 'rgba(239, 71, 111, 0.1)',
            borderWidth: 2.5,
            tension: 0.3,
            fill: false
          },
          {
            label: 'HTTP/2',
            data: data.loadVsPacketLoss.http2,
            borderColor: '#ffd166',
            backgroundColor: 'rgba(255, 209, 102, 0.1)',
            borderWidth: 2.5,
            tension: 0.3,
            fill: false
          },
          {
            label: 'HTTP/3 (QUIC)',
            data: data.loadVsPacketLoss.http3,
            borderColor: '#00d4ff',
            backgroundColor: 'rgba(0, 212, 255, 0.15)',
            borderWidth: 3.5,
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.3,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y} ms`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            title: { display: true, text: 'Load Time (ms)', color: '#64748b' }
          }
        }
      }
    });
  }

  // Chart 3: Connection Setup Time (Bar)
  const ctx3 = document.getElementById('chart-setup')?.getContext('2d');
  if (ctx3) {
    chartSetup = new Chart(ctx3, {
      type: 'bar',
      data: {
        labels: data.protocols,
        datasets: [{
          label: 'Handshake Time (ms)',
          data: data.connectionSetup,
          backgroundColor: [
            'rgba(239, 71, 111, 0.7)',
            'rgba(255, 209, 102, 0.7)',
            'rgba(6, 214, 160, 0.85)'
          ],
          borderColor: [
            '#ef476f',
            '#ffd166',
            '#06d6a0'
          ],
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` Handshake: ${ctx.parsed.y} ms`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Time in Milliseconds (ms)', color: '#64748b' }
          }
        }
      }
    });
  }

  // Chart 4: Radar Multi-dimension Comparison
  const ctx4 = document.getElementById('chart-radar')?.getContext('2d');
  if (ctx4) {
    chartRadar = new Chart(ctx4, {
      type: 'radar',
      data: {
        labels: data.radarData.labels,
        datasets: [
          {
            label: 'HTTP/1.1',
            data: data.radarData.http1,
            backgroundColor: 'rgba(239, 71, 111, 0.15)',
            borderColor: '#ef476f',
            borderWidth: 1.5,
            pointBackgroundColor: '#ef476f'
          },
          {
            label: 'HTTP/2',
            data: data.radarData.http2,
            backgroundColor: 'rgba(157, 78, 221, 0.2)',
            borderColor: '#9d4edd',
            borderWidth: 2,
            pointBackgroundColor: '#9d4edd'
          },
          {
            label: 'HTTP/3 (QUIC)',
            data: data.radarData.http3,
            backgroundColor: 'rgba(0, 212, 255, 0.3)',
            borderColor: '#00d4ff',
            borderWidth: 2.5,
            pointBackgroundColor: '#00d4ff'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
            grid: { color: 'rgba(255, 255, 255, 0.08)' },
            suggestedMin: 0,
            suggestedMax: 5,
            ticks: {
              stepSize: 1,
              backdropColor: 'transparent',
              color: '#64748b'
            },
            pointLabels: {
              color: '#cbd5e1',
              font: { size: 12, weight: '600' }
            }
          }
        },
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}

function updateAllCharts() {
  const data = getActiveData();

  if (chartAvgLoad) {
    chartAvgLoad.data.datasets[0].data = data.avgLoadTime;
    chartAvgLoad.update();
  }

  if (chartLoss) {
    chartLoss.data.datasets[0].data = data.loadVsPacketLoss.http1;
    chartLoss.data.datasets[1].data = data.loadVsPacketLoss.http2;
    chartLoss.data.datasets[2].data = data.loadVsPacketLoss.http3;
    chartLoss.update();
  }

  if (chartSetup) {
    chartSetup.data.datasets[0].data = data.connectionSetup;
    chartSetup.update();
  }

  if (chartRadar) {
    chartRadar.data.datasets[0].data = data.radarData.http1;
    chartRadar.data.datasets[1].data = data.radarData.http2;
    chartRadar.data.datasets[2].data = data.radarData.http3;
    chartRadar.update();
  }
}
