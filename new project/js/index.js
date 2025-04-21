document.addEventListener("DOMContentLoaded", () => {
    const csvFileInput = document.getElementById("csvFileInput");
    const importCSVBtn = document.getElementById("importCSVBtn");
    const dataTable = document.getElementById("dataTable");
    const moduleFilters = document.getElementById("moduleFilters");
    const subModuleFilters = document.getElementById("subModuleFilters");
  
    let originalData = [];
    let currentData = [];
  
    // ⏰ Real-time Clock
    function updateClock() {
      const clock = document.getElementById("clock");
      const now = new Date();
      clock.innerText = now.toLocaleString();
    }
    setInterval(updateClock, 1000);
    updateClock();
  
    // 📦 CSV Parse
    importCSVBtn.addEventListener("click", () => {
      const file = csvFileInput.files[0];
      if (!file) {
        alert("कृपया पहले CSV फ़ाइल चुनें");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split("\n").map(row => row.trim().split(","));
        const headers = rows.shift();
        const jsonData = rows.map(row => {
          const obj = {};
          headers.forEach((h, i) => {
            obj[h.trim()] = row[i]?.trim() || "";
          });
          return obj;
        });
        originalData = jsonData;
        currentData = [...jsonData];
        renderTable(currentData);
        populateFilters(currentData);
      };
      reader.readAsText(file);
    });
  
    // 🧾 Table Render
    function renderTable(data) {
      if (data.length === 0) {
        dataTable.innerHTML = "<tr><td>कोई डेटा नहीं मिला</td></tr>";
        return;
      }
      const headers = Object.keys(data[0]);
      let html = "<thead><tr>";
      headers.forEach(h => {
        html += `<th>${h}</th>`;
      });
      html += "</tr></thead><tbody>";
      data.forEach(row => {
        html += "<tr>";
        headers.forEach(h => {
          html += `<td>${row[h]}</td>`;
        });
        html += "</tr>";
      });
      html += "</tbody>";
      dataTable.innerHTML = html;
    }
  
    // Filters - Modules/Submodules
    function populateFilters(data) {
      const modules = new Set();
      const submodules = new Set();
      data.forEach(row => {
        if (row["Module"]) modules.add(row["Module"]);
        if (row["Sub-Module"]) submodules.add(row["Sub-Module"]);
      });
  
      moduleFilters.innerHTML = "";
      subModuleFilters.innerHTML = "";
  
      modules.forEach(mod => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="checkbox" class="moduleFilter" value="${mod}" checked /> ${mod}`;
        moduleFilters.appendChild(label);
      });
  
      submodules.forEach(sub => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="checkbox" class="subModuleFilter" value="${sub}" checked /> ${sub}`;
        subModuleFilters.appendChild(label);
      });
    }
  });
  