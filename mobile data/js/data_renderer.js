function populateDataTable(data) {
    const tbody = document.querySelector("#data-table tbody");
    tbody.innerHTML = "";
  
    data.forEach((row, index) => {
      const tr = document.createElement("tr");
  
      const cols = [
        "Box No", "Company", "Submodule", "Length", "Width", "Height", "Weight", "Volume", "Pallet"
      ];
  
      cols.forEach(col => {
        const td = document.createElement("td");
        td.textContent = row[col] || "";
        tr.appendChild(td);
      });
  
      tbody.appendChild(tr);
    });
  }
  