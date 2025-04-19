let allData = [];
let filteredData = [];

document.getElementById('csvFileInput').addEventListener('change', handleCSVUpload);
document.getElementById('palletSelector').addEventListener('change', (e) => {
  const pallet = parseInt(e.target.value);
  if (!isNaN(pallet)) {
    const selectedBoxes = filteredData.filter(d => parseInt(d.Pallet) === pallet);
    render3DView(selectedBoxes);
    console.log("📦 Showing boxes for Pallet:", pallet, selectedBoxes);
  }
});

function handleCSVUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      const parsed = results.data.map(item => ({
        ...item,
        Length: parseFloat(item.Length),
        Width: parseFloat(item.Width),
        Height: parseFloat(item.Height),
        Weight: parseFloat(item.Weight),
        Volume: parseFloat(item.Volume),
        Pallet: ""
      }));

      console.log("📥 Raw CSV Data Loaded:", parsed);
      allData = autoAssignPallets(parsed);
      localStorage.setItem('boxData', JSON.stringify(allData));
      initFilters(allData);
      applyFilters();
    }
  });
}

function autoAssignPallets(data) {
  let pallets = [];
  let current = { boxes: [], weight: 0, maxHeight: 0, palletNo: 1 };

  data.forEach((item, index) => {
    const weight = parseFloat(item.Weight) || 0;
    const height = parseFloat(item.Height) || 0;
    const fitsWeight = current.weight + weight <= 3700;
    const fitsHeight = current.maxHeight < 7;

    if (!fitsWeight || !fitsHeight) {
      console.log(`🔄 Pallet ${current.palletNo} filled. Boxes: ${current.boxes.length}, Weight: ${current.weight.toFixed(2)}kg, Height: ${current.maxHeight.toFixed(2)}ft`);
      pallets.push(current);
      current = { boxes: [], weight: 0, maxHeight: 0, palletNo: current.palletNo + 1 };
    }

    current.boxes.push(item);
    current.weight += weight;
    current.maxHeight = Math.max(current.maxHeight, height);
    item.Pallet = current.palletNo;

    console.log(`✅ Box ${index + 1} → Pallet ${item.Pallet}`);
  });

  if (current.boxes.length) {
    console.log(`✅ Final Pallet ${current.palletNo} with ${current.boxes.length} boxes`);
    pallets.push(current);
  }

  console.log("🧾 Pallet Summary:", pallets.map(p => `P${p.palletNo}(${p.boxes.length} boxes)`));
  return data;
}

function initFilters(data) {
  const moduleSet = new Set(data.map(d => d.Company));
  const submoduleSet = new Set(data.map(d => d.Submodule));
  const container = document.getElementById("filters");
  container.innerHTML = "";

  moduleSet.forEach(module => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = module;
    checkbox.name = "companyFilter";
    checkbox.checked = true;
    checkbox.addEventListener("change", applyFilters);

    const label = document.createElement("label");
    label.textContent = module;

    container.appendChild(checkbox);
    container.appendChild(label);
    container.appendChild(document.createElement("br"));
  });

  console.log("📍 Filters Initialized:", [...moduleSet]);
}

function applyFilters() {
  const selectedModules = Array.from(document.querySelectorAll('input[name="companyFilter"]:checked')).map(cb => cb.value);
  filteredData = allData.filter(d => selectedModules.includes(d.Company));
  renderTable(filteredData);
  populatePalletSelector(filteredData);
  const selectedPallet = parseInt(document.getElementById('palletSelector').value) || 1;
  render3DView(filteredData.filter(d => parseInt(d.Pallet) === selectedPallet));
}

function populatePalletSelector(data) {
  const selector = document.getElementById('palletSelector');
  const uniquePallets = [...new Set(data.map(d => parseInt(d.Pallet)))].filter(p => !isNaN(p));
  selector.innerHTML = "";

  uniquePallets.forEach(p => {
    const option = document.createElement("option");
    option.value = p;
    option.text = `Pallet ${p}`;
    selector.appendChild(option);
  });

  console.log("📦 Pallet Selector Updated:", uniquePallets);
}

function renderTable(data) {
  const table = document.getElementById('dataTable');
  table.innerHTML = "";

  const headers = ['Box No', 'Company', 'Submodule', 'Length', 'Width', 'Height', 'Weight', 'Volume', 'Pallet'];
  const headerRow = table.insertRow();
  headers.forEach(h => {
    const cell = headerRow.insertCell();
    cell.textContent = h;
    cell.style.fontWeight = "bold";
  });

  data.forEach(item => {
    const row = table.insertRow();
    headers.forEach(h => {
      const cell = row.insertCell();
      cell.textContent = item[h] || item[h.replace(" ", "")] || "";
    });
  });

  console.log(`📊 Table Rendered with ${data.length} boxes`);
}

// Basic 3D View Example — Placeholder (customize as needed)
function render3DView(boxes) {
  const container = document.getElementById("threeContainer");
  container.innerHTML = ""; // Clear before rendering

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  boxes.forEach((box, index) => {
    const geometry = new THREE.BoxGeometry(box.Length, box.Height, box.Width);
    const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(`hsl(${(index * 30) % 360}, 70%, 50%)`) });
    const cube = new THREE.Mesh(geometry, material);

    cube.position.set((index % 3) * 5, box.Height / 2, Math.floor(index / 3) * 5);
    scene.add(cube);
  });

  camera.position.set(10, 20, 30);
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);

  console.log("🧱 3D View Rendered with", boxes.length, "boxes");
}
