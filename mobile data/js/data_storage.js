// Save table data to localStorage
function saveDataToLocalStorage(tableId = "data-table") {
    const table = document.getElementById(tableId);
    const rows = [];
  
    table.querySelectorAll("tbody tr").forEach(tr => {
      const cells = [];
      tr.querySelectorAll("td").forEach(td => cells.push(td.innerText));
      rows.push(cells);
    });
  
    localStorage.setItem("skidPackingData", JSON.stringify(rows));
    alert("✅ Data saved locally!");
  }
  
  // Load data from localStorage
  function loadDataFromLocalStorage(tableId = "data-table") {
    const table = document.getElementById(tableId);
    const savedData = localStorage.getItem("skidPackingData");
  
    if (savedData) {
      const rows = JSON.parse(savedData);
      const tbody = table.querySelector("tbody");
      tbody.innerHTML = "";
  
      rows.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
          const td = document.createElement("td");
          td.innerText = cell;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }
  }
  
  // Reset local storage and table
  function resetAllData(tableId = "data-table") {
    localStorage.removeItem("skidPackingData");
    const table = document.getElementById(tableId);
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";
    alert("🧹 All data reset!");
  }
  