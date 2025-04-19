function generateModuleCheckboxes(data) {
    const modulePanel = document.getElementById("module-checkboxes");
    if (!modulePanel) return;
  
    const uniqueModules = [...new Set(data.map(item => item.Company))];
    modulePanel.innerHTML = "";
  
    uniqueModules.forEach(mod => {
      const label = document.createElement("label");
      label.style.display = "block";
      label.style.marginBottom = "4px";
      label.innerHTML = `
        <input type="checkbox" class="module-filter" value="${mod}" checked />
        ${mod}
      `;
      modulePanel.appendChild(label);
    });
  
    // Add event listeners
    document.querySelectorAll(".module-filter").forEach(cb => {
      cb.addEventListener("change", applyModuleFilter);
    });
  }
  
  function applyModuleFilter() {
    const selectedModules = Array.from(document.querySelectorAll(".module-filter:checked"))
      .map(cb => cb.value);
  
    const rows = document.querySelectorAll("#data-table tbody tr");
    rows.forEach(row => {
      const company = row.children[1].textContent.trim(); // Company is column index 1
      if (selectedModules.includes(company)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }
  
  function selectAllModules() {
    document.querySelectorAll(".module-filter").forEach(cb => cb.checked = true);
    applyModuleFilter();
  }
  
  function unselectAllModules() {
    document.querySelectorAll(".module-filter").forEach(cb => cb.checked = false);
    applyModuleFilter();
  }
  