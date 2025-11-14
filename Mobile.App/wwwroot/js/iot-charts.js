// Simple Chart.js helper cho Blazor gọi
window.iotCharts = (function () {
  const charts = {};

  function makeChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) throw new Error("Chart canvas not found: " + canvasId);

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          { label: 'Temp (°C)', data: [], pointRadius: 0, tension: 0.25 },
          { label: 'Hum  (%)', data: [], pointRadius: 0, tension: 0.25 },
          { label: 'Lux (lx)', data: [], pointRadius: 0, tension: 0.25 },
        ]
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { maxTicksLimit: 8 } },
          y: { beginAtZero: true }
        },
        plugins: {
          legend: { display: true }
        }
      }
    });
    charts[canvasId] = chart;
  }

  // Thêm 1 điểm (timeLabel, {t, h, lx}), giữ tối đa 60 điểm
  function addPoint(canvasId, label, t, h, lx) {
    const c = charts[canvasId];
    if (!c) return;

    c.data.labels.push(label);
    c.data.datasets[0].data.push(t);
    c.data.datasets[1].data.push(h);
    c.data.datasets[2].data.push(lx);

    const max = 60;
    if (c.data.labels.length > max) {
      c.data.labels.shift();
      c.data.datasets.forEach(ds => ds.data.shift());
    }
    c.update();
  }

  return { makeChart, addPoint };
})();
