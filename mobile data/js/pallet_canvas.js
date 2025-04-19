const canvas = document.getElementById("pallet-canvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 700;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const palletLength = 9; // feet
const palletWidth = 7;  // feet
const scale = 60;       // 1 ft = 60px

function drawBox(x, y, w, h, label, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#000";
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = "#000";
  ctx.font = "12px Arial";
  ctx.fillText(label, x + 2, y + 12);
}

function getColor(company) {
  const colors = {
    "A COY": "#FF9999", "B COY": "#99FF99", "C COY": "#9999FF", "D COY": "#FFCC99",
    "SP COY": "#CC99FF", "HQ COY": "#66FFFF", "BN MAG": "#FFD700", "BN": "#CCCCCC"
  };
  return colors[company] || "#ccc";
}

function drawPallets(pallets) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  pallets.forEach((pallet, index) => {
    let offsetX = 0;
    let offsetY = index * (palletWidth * scale + 40);

    ctx.fillStyle = "#333";
    ctx.fillText(`Pallet ${index + 1}`, 10, offsetY + 12);

    let layers = {};

    pallet.forEach((box) => {
      const key = box.layer || 0;
      if (!layers[key]) layers[key] = [];
      layers[key].push(box);
    });

    let layerY = offsetY + 20;
    Object.keys(layers).forEach((layer) => {
      let boxes = layers[layer];
      let xCursor = 10;

      boxes.forEach((box) => {
        const boxW = box.length * scale;
        const boxH = box.width * scale;
        const label = `${box.boxNumber}\n${box.company}`;
        drawBox(xCursor, layerY, boxW, boxH, label, getColor(box.company));
        xCursor += boxW + 4;
      });

      layerY += (palletWidth * scale) / 3; // layer spacing
    });
  });
}

function applyAutoPacking() {
  const data = manualEntries || [];
  const pallets = [];
  let currentPallet = [];
  let currentWeight = 0;
  let layer = 0;

  const maxWeight = 3700;
  const maxVolume = palletLength * palletWidth * 7;

  let remainingArea = palletLength * palletWidth;
  let remainingHeight = 7;

  data.forEach((box, i) => {
    const boxVolume = box.length * box.width * box.height;
    const boxWeight = box.weight;
    const boxArea = box.length * box.width;

    if (
      currentWeight + boxWeight > maxWeight ||
      box.height > remainingHeight ||
      boxArea > remainingArea
    ) {
      pallets.push(currentPallet);
      currentPallet = [];
      currentWeight = 0;
      remainingArea = palletLength * palletWidth;
      remainingHeight = 7;
      layer = 0;
    }

    box.layer = layer;
    currentPallet.push(box);
    currentWeight += boxWeight;
    remainingArea -= boxArea;
  });

  if (currentPallet.length > 0) pallets.push(currentPallet);

  drawPallets(pallets);
}
