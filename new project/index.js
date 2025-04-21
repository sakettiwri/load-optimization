document.getElementById("importCSVBtn").addEventListener("click", function () {
    const fileInput = document.getElementById("csvFileInput");
    const file = fileInput.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          parseCSVData(results.data);
        }
      });
    }
  });
  
  let allData = [];
  let palletMap = {};
  
  // Function to parse CSV data
function parseCSV(csvData) {
    let rows = csvData.split("\n");
    let headers = rows[0].split(",");
    let data = [];

    for (let i = 1; i < rows.length; i++) {
        let row = rows[i].split(",");
        let rowData = {};
        for (let j = 0; j < headers.length; j++) {
            rowData[headers[j].trim()] = row[j].trim();
        }
        data.push(rowData);
    }

    return data;
}

// Call parseCSV() function to load data
let csvData = `Box No,Company,Submodule,Length,Width,Height,Weight,Volume,Pallet
1,A COY,NSQM STORE,3.3,2.9,2.5,169.4,0.01,
2,A COY,NSQM STORE,2.9,2.3,2.3,156.5,0.01,
...`;

// Assuming the CSV data is provided directly or through a file upload
let palletData = parseCSV(csvData);

 
  // 🧠 Pallet assignment based on constraints
  function assignPallets() {
    palletMap = {};
    let palletIndex = 1;
    let currentPallet = { boxes: [], weight: 200, layers: [] };
    let currentLayerHeight = 0;
    let maxHeight = 84, maxLength = 108, maxWidth = 84;
  
    for (const box of allData) {
      const length = parseFloat(box.Length);
      const width = parseFloat(box.Width);
      const height = parseFloat(box.Height);
      const weight = parseFloat(box.Weight);
  
      // Fit check
      if (
        currentPallet.weight + weight > 3700 ||
        currentLayerHeight + height > maxHeight
      ) {
        palletMap[`Pallet ${palletIndex}`] = currentPallet;
        palletIndex++;
        currentPallet = { boxes: [], weight: 200, layers: [] };
        currentLayerHeight = 0;
      }
  
      currentPallet.boxes.push({ ...box, Length: length, Width: width, Height: height });
      currentPallet.weight += weight;
      currentLayerHeight += height;
    }
  
    palletMap[`Pallet ${palletIndex}`] = currentPallet;
    allData = Object.values(palletMap).flatMap(p => p.boxes.map(b => ({ ...b, Pallet: Object.keys(palletMap).find(key => palletMap[key].boxes.includes(b)) })));
  }
  
  function generateFilters() {
    // Logic for dynamically creating module/submodule checkboxes
  }
  
  function renderTable() {
    const table = document.getElementById("dataTable");
    table.innerHTML = "";
  
    const headers = ["Pallet", "Box No", "Company", "Module", "SubModule", "Length", "Width", "Height", "Weight"];
    const headerRow = document.createElement("tr");
    headers.forEach(header => {
      const th = document.createElement("th");
      th.innerText = header;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
  
    allData.forEach(box => {
      const row = document.createElement("tr");
      headers.forEach(key => {
        const td = document.createElement("td");
        td.innerText = box[key] || "";
        row.appendChild(td);
      });
      table.appendChild(row);
    });
  }
  
  function updateSummary() {
    const totalBoxes = allData.length;
    const totalWeight = allData.reduce((sum, b) => sum + parseFloat(b.Weight), 0);
    const totalVolume = allData.reduce((sum, b) => sum + (parseFloat(b.Length) * parseFloat(b.Width) * parseFloat(b.Height)), 0);
    const maxVolume = Object.keys(palletMap).length * (108 * 84 * 84);
    const utilization = ((totalVolume / maxVolume) * 100).toFixed(2);
  
    document.getElementById("totalBoxes").innerText = totalBoxes;
    document.getElementById("totalWeight").innerText = totalWeight.toFixed(2);
    document.getElementById("totalVolume").innerText = totalVolume.toFixed(2);
    document.getElementById("totalPallets").innerText = Object.keys(palletMap).length;
    document.getElementById("utilization").innerText = utilization;
  }
  document.getElementById('selectAllModules').addEventListener('click', function() {
    const checkboxes = document.querySelectorAll('.moduleCheckbox');
    checkboxes.forEach(checkbox => checkbox.checked = true);
});

document.getElementById('unselectAllModules').addEventListener('click', function() {
    const checkboxes = document.querySelectorAll('.moduleCheckbox');
    checkboxes.forEach(checkbox => checkbox.checked = false);
});

  function populatePalletSelector() {
    const select = document.getElementById("palletSelect");
    select.innerHTML = "";
    Object.keys(palletMap).forEach(pallet => {
      const option = document.createElement("option");
      option.value = pallet;
      option.innerText = pallet;
      select.appendChild(option);
    });
  
    select.addEventListener("change", () => {
      render3DView(select.value);
    });
  }
  