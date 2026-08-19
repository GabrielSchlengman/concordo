const canvas = document.getElementById('overlay');
let items = [];

function draw() {
  const ratio = Math.min(devicePixelRatio || 1, 2);
  const width = Math.round(innerWidth * ratio); const height = Math.round(innerHeight * ratio);
  if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
  const context = canvas.getContext('2d'); context.clearRect(0, 0, width, height); context.lineCap = 'round'; context.lineJoin = 'round';
  for (const item of items) {
    context.globalCompositeOperation = item.tool === 'eraser' ? 'destination-out' : 'source-over';
    if (item.tool === 'text') {
      context.fillStyle = item.color; context.font = `700 ${Math.max(18, item.width * 4) * ratio}px Arial, sans-serif`;
      context.fillText(item.text, item.x * width, item.y * height); continue;
    }
    if (item.tool === 'pointer') {
      const x = item.x * width; const y = item.y * height; const radius = Math.max(16, item.width * 3) * ratio;
      context.strokeStyle = item.color; context.lineWidth = Math.max(3, item.width / 2) * ratio;
      context.beginPath(); context.arc(x, y, radius, 0, Math.PI * 2); context.moveTo(x - radius * 1.45, y); context.lineTo(x + radius * 1.45, y); context.moveTo(x, y - radius * 1.45); context.lineTo(x, y + radius * 1.45); context.stroke(); continue;
    }
    if (!Array.isArray(item.points) || item.points.length < 2) continue;
    context.beginPath(); context.strokeStyle = item.color; context.lineWidth = item.width * ratio;
    context.moveTo(item.points[0].x * width, item.points[0].y * height);
    item.points.slice(1).forEach((point) => context.lineTo(point.x * width, point.y * height)); context.stroke();
  }
  context.globalCompositeOperation = 'source-over';
}

window.concordAnnotationOverlay.onState((state) => { items = Array.isArray(state?.items) ? state.items : []; draw(); });
addEventListener('resize', draw);
