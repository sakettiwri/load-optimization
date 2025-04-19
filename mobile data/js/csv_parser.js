function handleCSVImport(event) {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = function (e) {
      const contents = e.target.result;
      const data = parseCSV(contents);
  
      // ✅ Populate table
      populateDataTable(data);
  
      // ✅ Filter panel: Module/Company-wise filters
      generateModuleCheckboxes(data);
      applyModuleFilter();
  
      // ✅ Pallet auto layout (अगर है तो)
      autoAssignPallets(data);
      updateSummary(data);
      render3DBoxes(data);
    };
  
    reader.readAsText(file);
  }
  
  
  function parseCSV(text) {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",");
    const rows = lines.slice(1).map(line => {
      const values = line.split(",");
      const row = {};
      headers.forEach((h, i) => {
        row[h.trim()] = values[i] ? values[i].trim() : "";
      });
      return row;
    });
    return rows;
  }
  
    