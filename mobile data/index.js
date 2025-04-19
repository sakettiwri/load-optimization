let allData = [];
let scene, camera, renderer, controls;

document.getElementById("csvFileInput").addEventListener("change", handleCSVImport);
document.getElementById("selectAllBtn").addEventListener("click", selectAllModules);
document.getElementById("unselectAllBtn").addEventListener("click", unselectAllModules);
document.getElementById("exportExcelBtn").addEventListener("click", exportToExcel);
document.getElementById("printBtn").addEventListener("click", () => window.print());
document.getElementById("palletSelector").addEventListener("change", (e) => {
  const palletNo = e.target.value;
  drawBoxesForPallet(palletNo); // Redraw 3D boxes when pallet is selected
});

function handleCSVImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    allData = parseCSV(text);
    autoAssignPallets(allData);  // Auto-assign pallets
    populateModuleFilters(allData);
    renderDataTable(allData);
    updateSummary(allData);
    populatePalletSelector(allData);  // Populate pallet selector after loading data
    init3DScene();  // Initialize 3D scene
  };
  reader.readAsText(file);
}

function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const obj = {};
    headers.forEach((h, i) => (obj[h.trim()] = values[i]?.trim() || ""));
    return obj;
  });
}

function populateModuleFilters(data) {
  const moduleSubMap = {};
  data.forEach((item) => {
    if (!moduleSubMap[item.Company]) moduleSubMap[item.Company] = new Set();
    moduleSubMap[item.Company].add(item.Submodule);
  });

  const moduleDiv = document.getElementById("module-checkboxes");
  moduleDiv.innerHTML = "";

  Object.keys(moduleSubMap).forEach((mod) => {
    const modLabel = document.createElement("label");
    modLabel.classList.add("fw-bold", "d-block", "mt-2");
    modLabel.textContent = mod;
    moduleDiv.appendChild(modLabel);

    moduleSubMap[mod].forEach((sub) => {
      const div = document.createElement("div");
      div.classList.add("form-check", "ms-3");
      const chk = document.createElement("input");
      chk.type = "checkbox";
      chk.value = `${mod}__${sub}`;
      chk.checked = true;
      chk.classList.add("form-check-input", "module-filter");
      chk.onchange = applyModuleFilter;

      const lbl = document.createElement("label");
      lbl.classList.add("form-check-label");
      lbl.textContent = sub;

      div.appendChild(chk);
      div.appendChild(lbl);
      moduleDiv.appendChild(div);
    });
  });
}
// Add the isRowVisible function
function isRowVisible(row) {
  const selectedModules = Array.from(document.querySelectorAll('#module-checkboxes input[type="checkbox"]:checked')).map(cb => cb.value.split("__")[0]);
  const selectedSubmodules = Array.from(document.querySelectorAll('#module-checkboxes input[type="checkbox"]:checked')).map(cb => cb.value.split("__")[1]);

  const matchesModule = selectedModules.length === 0 || selectedModules.includes(row.Company);
  const matchesSubmodule = selectedSubmodules.length === 0 || selectedSubmodules.includes(row.Submodule);

  return matchesModule && matchesSubmodule;
}

function applyModuleFilter() {
  renderDataTable(allData); // Render the table again after applying filters
  updateSummary(allData);   // Update the summary after applying filters
}

function renderDataTable(data) {
  const tbody = document.querySelector("#data-table tbody");
  tbody.innerHTML = "";

  const selectedPallet = document.getElementById("palletSelector").value;

  const thead = document.querySelector("#data-table thead");
  thead.innerHTML = "";
  if (data.length > 0) {
    const headerRow = document.createElement("tr");
    Object.keys(data[0]).forEach((key) => {
      const th = document.createElement("th");
      th.textContent = key;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
  }

  data.forEach((row) => {
    if (!isRowVisible(row)) return;
    if (selectedPallet && row.Pallet != selectedPallet) return;

    const tr = document.createElement("tr");
    Object.keys(row).forEach((key) => {
      const td = document.createElement("td");
      td.textContent = row[key];
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

function selectAllModules() {
  document.querySelectorAll(".module-filter").forEach((chk) => (chk.checked = true));
  renderDataTable(allData);
  updateSummary(allData);
}

function unselectAllModules() {
  document.querySelectorAll(".module-filter").forEach((chk) => (chk.checked = false));
  renderDataTable(allData);
  updateSummary(allData);
}

function updateSummary(data) {
  const visibleRows = data.filter(isRowVisible);
  const totalWeight = visibleRows.reduce((sum, row) => sum + (parseFloat(row.Weight) || 0), 0);
  const uniquePallets = new Set(visibleRows.map((r) => r.Pallet)).size;
  const boxCount = visibleRows.length;
  const utilPercent = ((totalWeight / (uniquePallets * 3700)) * 100).toFixed(1);

  document.getElementById("summary-boxes").textContent = boxCount;
  document.getElementById("summary-pallets").textContent = uniquePallets;
  document.getElementById("summary-weight").textContent = totalWeight.toFixed(1) + " kg";
  document.getElementById("summary-util").textContent = utilPercent + "%";
}

function exportToExcel() {
  const table = document.getElementById("data-table");
  const wb = XLSX.utils.table_to_book(table, { sheet: "Pallet Data" });
  XLSX.writeFile(wb, "pallet_data.xlsx");
}

function autoAssignPallets(data) {
  let pallets = [];
  let current = { boxes: [], weight: 0, maxHeight: 0, palletNo: 1 };

  data.forEach((item) => {
    const volume = parseFloat(item.Volume) || 0;
    const weight = parseFloat(item.Weight) || 0;
    const height = parseFloat(item.Height) || 0;

    const fitsWeight = current.weight + weight <= 3700;
    const fitsHeight = current.maxHeight < 7;

    if (!fitsWeight || !fitsHeight) {
      pallets.push(current);
      current = { boxes: [], weight: 0, maxHeight: 0, palletNo: current.palletNo + 1 };
    }

    current.boxes.push(item);
    current.weight += weight;
    current.maxHeight = Math.max(current.maxHeight, height);
    item.Pallet = current.palletNo;
  });

  if (current.boxes.length) pallets.push(current);

  console.log("✅ Assigned Pallet Numbers:", pallets.map(p => p.palletNo));

  populatePalletSelector(data); // Ensure you call this after assigning pallets

  return data;
}

function populatePalletSelector(data) {
  const palletSelector = document.getElementById("palletSelector");
  const pallets = [...new Set(data.map(item => item.Pallet))].filter(Boolean);

  palletSelector.innerHTML = ""; // Clear existing options

  if (pallets.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No Pallets Available";
    palletSelector.appendChild(option);
    return;
  }

  pallets.forEach(palletNo => {
    const option = document.createElement("option");
    option.value = palletNo;
    option.textContent = `Pallet ${palletNo}`;
    palletSelector.appendChild(option);
  });

  palletSelector.value = pallets[0]; // Set the default pallet value
  drawBoxesForPallet(pallets[0]); // Draw boxes for the default pallet
}
// Function to filter the CSV data based on selected company and submodule


// Function to handle company and submodule selection
function handleSelection() {
  const companySelect = document.getElementById('company-select');
  const submoduleSelect = document.getElementById('submodule-select');

  const selectedCompany = companySelect.value;
  const selectedSubmodule = submoduleSelect.value;

  const filteredData = filterData(selectedCompany, selectedSubmodule);
  updateTable(filteredData);
}

// Event listeners for company and submodule selection
document.getElementById('company-select').addEventListener('change', handleSelection);
document.getElementById('submodule-select').addEventListener('change', handleSelection);

// Sample CSV data loading function (replace this with your actual CSV data loading function)
const csvData = [
  { BoxNo: 1, Company: 'A COY', Submodule: 'NSQM STORE', Length: 3.3, Width: 2.9, Height: 2.5, Weight: 169.4, Volume: 0.01, Pallet: '' },
  { BoxNo: 2, Company: 'A COY', Submodule: 'NSQM STORE', Length: 2.9, Width: 2.3, Height: 2.3, Weight: 156.5, Volume: 0.01, Pallet: '' },
  { BoxNo: 3, Company: 'A COY', Submodule: 'KOTE', Length: 3.5, Width: 2.7, Height: 2.9, Weight: 126.6, Volume: 0.02, Pallet: '' },
  { BoxNo: 4, Company: 'A COY', Submodule: 'KOTE', Length: 2.2, Width: 3.4, Height: 3, Weight: 128.6, Volume: 0.01, Pallet: '' },
  { BoxNo: 5, Company: 'B COY', Submodule: 'NSQM STORE', Length: 2.7, Width: 2.7, Height: 2.3, Weight: 122.1, Volume: 0.01, Pallet: '' },
  { BoxNo: 6, Company: 'B COY', Submodule: 'NSQM STORE', Length: 3.3, Width: 3.4, Height: 2.7, Weight: 103, Volume: 0.02, Pallet: '' },
  { BoxNo: 7, Company: 'B COY', Submodule: 'KOTE', Length: 3.1, Width: 2.6, Height: 2.8, Weight: 114, Volume: 0.01, Pallet: '' },
  { BoxNo: 8, Company: 'B COY', Submodule: 'KOTE', Length: 2.3, Width: 3.5, Height: 2.1, Weight: 144.6, Volume: 0.01, Pallet: '' },
  { BoxNo: 9, Company: 'C COY', Submodule: 'NSQM STORE', Length: 2.1, Width: 3.3, Height: 3.1, Weight: 181, Volume: 0.01, Pallet: '' },
  { BoxNo: 10, Company: 'C COY', Submodule: 'NSQM STORE', Length: 2.7, Width: 3.3, Height: 3.3, Weight: 166.1, Volume: 0.02, Pallet: '' },
  // More rows...
];

// Initialize the selections and table
function init() {
  // Populate company select dropdown
  const companySelect = document.getElementById('company-select');
  const companies = [...new Set(csvData.map(item => item.Company))];
  companies.unshift('All');
  companies.forEach(company => {
    const option = document.createElement('option');
    option.value = company;
    option.textContent = company;
    companySelect.appendChild(option);
  });

  // Populate submodule select dropdown
  const submoduleSelect = document.getElementById('submodule-select');
  const submodules = [...new Set(csvData.map(item => item.Submodule))];
  submodules.unshift('All');
  submodules.forEach(submodule => {
    const option = document.createElement('option');
    option.value = submodule;
    option.textContent = submodule;
    submoduleSelect.appendChild(option);
  });

  // Display all data initially
  updateTable(csvData);
}

init();

function init3DScene() {
  const canvas = document.getElementById("three-canvas");
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  camera.position.set(10, 10, 15);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function drawBoxesForPallet(palletNo) {
  if (!scene) return;
  while (scene.children.length) scene.remove(scene.children[0]);

  const palletData = allData.filter(item => item.Pallet == palletNo && isRowVisible(item));
  const palletLength = 9, palletWidth = 7;
  let x = 0, y = 0, z = 0;

  palletData.forEach((box, i) => {
    const length = parseFloat(box.Length) || 1;
    const width = parseFloat(box.Width) || 1;
    const height = parseFloat(box.Height) || 1;

    const geometry = new THREE.BoxGeometry(length, height, width);
    const material = new THREE.MeshBasicMaterial({ color: 0x3498db, wireframe: false });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x + length / 2, y + height / 2, z + width / 2);

    scene.add(cube);

    x += length;
    if (x + length > palletLength) {
      x = 0;
      z += width;
      if (z + width > palletWidth) {
        z = 0;
        y += height;
      }
    }
  });
}
