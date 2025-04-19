let boxData = [];
let filteredData = [];

const MAX_PALLET_WEIGHT = 3700; // including pallet weight
const MAX_PALLET_LENGTH = 9;
const MAX_PALLET_WIDTH = 7;
const MAX_PALLET_HEIGHT = 7;

window.onload = () => {
  loadFromLocalStorage();
  startClock();
};

function handleFileUpload(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    parseCSV(text);
    saveToLocalStorage();
  };
  reader.readAsText(file);
}

function parseCSV(csvText) {
  const rows = csvText.trim().split('\n');
  const headers = rows[0].split(',');
  boxData = rows.slice(1).map(row => {
    const cols = row.split(',');
    const entry = {};
    headers.forEach((h, i) => {
      entry[h.trim()] = cols[i]?.trim();
    });
    return {
      ...entry,
      Length: parseFloat(entry.Length || 0),
      Width: parseFloat(entry.Width || 0),
      Height: parseFloat(entry.Height || 0),
      Weight: parseFloat(entry.Weight || 0),
    };
  });
  autoAssignPallets();
  renderTable();
  renderSummary();
}

function autoAssignPallets() {
  let pallets = [];
  let currentPallet = { boxes: [], weight: 200, height: 0 };

  boxData.forEach((box, index) => {
    const volumeCheck = currentPallet.height + box.Height <= MAX_PALLET_HEIGHT;
    const weightCheck = currentPallet.weight + box.Weight <= MAX_PALLET_WEIGHT;

    if (volumeCheck && weightCheck) {
      currentPallet.boxes.push(box);
      currentPallet.weight += box.Weight;
      currentPallet.height += box.Height;
    } else {
      pallets.push(currentPallet);
      currentPallet = { boxes: [box], weight: 200 + box.Weight, height: box.Height };
    }
  });

  pallets.push(currentPallet);

  let palletCount = 1;
  pallets.forEach(pallet => {
    pallet.boxes.forEach(box => {
      box.Pallet = palletCount;
    });
    palletCount++;
  });

  filteredData = [...boxData];
}

function renderTable() {
  const tableBody = document.getElementById("data-body");
  if (!tableBody) return;

  tableBody.innerHTML = "";
  filteredData.forEach((box, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${box.BoxNo || "-"}</td>
      <td>${box.Company || "-"}</td>
      <td>${box.Length.toFixed(2)} ft</td>
      <td>${box.Width.toFixed(2)} ft</td>
      <td>${box.Height.toFixed(2)} ft</td>
      <td>${box.Weight.toFixed(2)} kg</td>
      <td>${box.Pallet || "-"}</td>
    `;
    tableBody.appendChild(row);
  });
}

function applyFilter() {
  const checkboxes = document.querySelectorAll(".module-checkbox:checked");
  const selectedModules = Array.from(checkboxes).map(cb => cb.value);

  if (selectedModules.includes("BN")) {
    filteredData = boxData.filter(box => box.Company !== "BN MAG");
  } else {
    filteredData = boxData.filter(box => selectedModules.includes(box.Company));
  }

  renderTable();
  renderSummary();
}

function renderSummary() {
  const totalBox = boxData.length;
  const pallets = [...new Set(boxData.map(b => b.Pallet))];
  const totalPallet = pallets.length;
  const totalWeight = boxData.reduce((sum, b) => sum + b.Weight, 0);
  const totalVolume = boxData.reduce((sum, b) => {
    return sum + (b.Length * b.Width * b.Height);
  }, 0);

  document.getElementById("total-boxes").innerText = totalBox;
  document.getElementById("total-pallets").innerText = totalPallet;
  document.getElementById("total-weight").innerText = totalWeight.toFixed(1) + " kg";
  document.getElementById("total-volume").innerText = totalVolume.toFixed(1) + " ft³";
}

function saveToLocalStorage() {
  localStorage.setItem("skidData", JSON.stringify(boxData));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem("skidData");
  if (data) {
    boxData = JSON.parse(data);
    autoAssignPallets();
    renderTable();
    renderSummary();
  }
}

function resetData() {
  localStorage.removeItem("skidData");
  boxData = [];
  filteredData = [];
  renderTable();
  renderSummary();
  document.getElementById("csvInput").value = "";
}

function startClock() {
  const clock = document.getElementById("clock");
  if (!clock) return;
  setInterval(() => {
    const now = new Date();
    clock.innerText = now.toLocaleString();
  }, 1000);
}

function exportTableToExcel() {
  let table = document.getElementById("data-table");
  let html = table.outerHTML;

  let blob = new Blob(["\ufeff", html], {
    type: "application/vnd.ms-excel",
  });

  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "skid_data.xls";
  a.click();
}

function printView() {
  window.print();
}
