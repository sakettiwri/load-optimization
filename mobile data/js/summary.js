function updateSummaryCards(data) {
    let totalBoxes = data.length;
    let totalPallets = new Set(data.map(item => item.pallet)).size;
    let totalWeight = 0;
    let totalVolume = 0;
  
    data.forEach(item => {
      const w = parseFloat(item.weight) || 0;
      const l = parseFloat(item.length) || 0;
      const b = parseFloat(item.breadth) || 0;
      const h = parseFloat(item.height) || 0;
  
      totalWeight += w;
      totalVolume += l * b * h;
    });
  
    document.getElementById("summary-boxes").innerText = totalBoxes;
    document.getElementById("summary-pallets").innerText = totalPallets;
    document.getElementById("summary-weight").innerText = totalWeight.toFixed(2) + " kg";
    document.getElementById("summary-volume").innerText = totalVolume.toFixed(2) + " ft³";
  }
  