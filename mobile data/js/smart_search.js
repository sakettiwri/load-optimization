function setupSmartSearch(tableId = "data-table") {
    const inputBox = document.getElementById("search-box");
    inputBox.addEventListener("input", () => {
      const searchText = inputBox.value.toLowerCase();
      const rows = document.querySelectorAll(`#${tableId} tbody tr`);
      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(searchText) ? "" : "none";
      });
    });
  }
  