// Function to read and parse the CSV file
function readCSVFile(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const content = e.target.result;
      const data = parseCSV(content);
      loadCSVData(data);
    };
    reader.readAsText(file);
  }
  
  // Function to parse CSV content into a usable data structure (array of objects)
  function parseCSV(content) {
    const lines = content.split("\n");
    const headers = lines[0].split(",");
    const data = lines.slice(1).map(line => {
      const values = line.split(",");
      return headers.reduce((acc, header, i) => {
        acc[header] = values[i];
        return acc;
      }, {});
    });
    return data;
  }
  
  // Call this function to load the parsed CSV data into your system
  function loadCSVData(data) {
    window.palletData = data;
    updateSummary();
    renderTable();
  }
  function autoAllocatePallets(palletData) {
    const MAX_WEIGHT = 3700; // Total max weight per pallet
    const PALLET_WEIGHT = 200; // Pallet weight
    const MAX_VOLUME = 9 * 7 * 7; // Max volume for a pallet in cubic feet (9x7x7)

    let pallets = [];
    let currentWeight = 0;
    let currentVolume = 0;
    let palletNumber = 1;

    palletData.forEach(item => {
        const weight = parseFloat(item['Weight']);
        const length = parseFloat(item['Length']);
        const width = parseFloat(item['Width']);
        const height = parseFloat(item['Height']);
        const volume = length * width * height;

        // Check if adding this box exceeds weight or volume limits
        if (currentWeight + weight <= MAX_WEIGHT - PALLET_WEIGHT && currentVolume + volume <= MAX_VOLUME) {
            // Add box to current pallet
            currentWeight += weight;
            currentVolume += volume;
        } else {
            // Create a new pallet
            pallets.push({
                palletNumber,
                totalWeight: currentWeight,
                totalVolume: currentVolume
            });
            palletNumber++;
            currentWeight = weight;
            currentVolume = volume;
        }
    });

    // Add last pallet
    pallets.push({
        palletNumber,
        totalWeight: currentWeight,
        totalVolume: currentVolume
    });

    return pallets;
}

  // Function to update the summary
  function updateSummary() {
    const totalPallets = palletData.length;
    const totalWeight = palletData.reduce((sum, item) => sum + parseFloat(item.Weight), 0);
    const totalVolume = palletData.reduce((sum, item) => sum + (parseFloat(item.Length) * parseFloat(item.Width) * parseFloat(item.Height)), 0);
    
    const utilization = (totalWeight / 3700) * 100;
    
    document.getElementById('totalPallets').textContent = totalPallets;
    document.getElementById('totalWeight').textContent = totalWeight.toFixed(2);
    document.getElementById('totalVolume').textContent = totalVolume.toFixed(2);
    document.getElementById('utilization').textContent = utilization.toFixed(2);
  }
  
  function loadModulesAndSubModules(palletData) {
    // Fetch unique modules and submodules
    const modules = [...new Set(palletData.map(item => item['Submodule']))];
    const subModules = [...new Set(palletData.map(item => item['Submodule']))];

    // Fill module filter dropdown
    let moduleDropdown = document.getElementById('moduleFilters');
    modules.forEach(module => {
        const option = document.createElement('option');
        option.value = module;
        option.textContent = module;
        moduleDropdown.appendChild(option);
    });

    // Fill submodule filter dropdown
    let subModuleDropdown = document.getElementById('subModuleFilters');
    subModules.forEach(subModule => {
        const option = document.createElement('option');
        option.value = subModule;
        option.textContent = subModule;
        subModuleDropdown.appendChild(option);
    });
}

  // Function to render the data in the table
  function renderTable() {
    const table = document.getElementById('dataTable');
    const headers = ['Box No', 'Length', 'Width', 'Height', 'Weight', 'Company'];
  
    let headerRow = document.createElement('tr');
    headers.forEach(header => {
      let th = document.createElement('th');
      th.innerText = header;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
  
    palletData.forEach(item => {
      let row = document.createElement('tr');
      row.innerHTML = `
        <td>${item['Box No']}</td>
        <td>${item['Length']}</td>
        <td>${item['Width']}</td>
        <td>${item['Height']}</td>
        <td>${item['Weight']}</td>
        <td>${item['Company']}</td>
      `;
      table.appendChild(row);
    });
  }
  