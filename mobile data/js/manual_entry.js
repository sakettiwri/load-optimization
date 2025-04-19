// Default entry structure
function getDefaultEntry() {
  return {
    boxNumber: "",
    company: "",
    module: "",
    subModule: "",
    length: 0,
    width: 0,
    height: 0,
    weight: 0
  };
}

let manualEntries = [];

function addManualEntryRow() {
  const table = document.getElementById("manual-entry-table");
  const row = document.createElement("tr");
  const entry = getDefaultEntry();

  Object.keys(entry).forEach((key) => {
    const td = document.createElement("td");
    const input = document.createElement("input");
    input.type = key === "weight" || key === "length" || key === "width" || key === "height" ? "number" : "text";
    input.placeholder = key;
    input.dataset.key = key;
    input.onchange = () => {
      entry[key] = input.type === "number" ? parseFloat(input.value) : input.value;
    };
    td.appendChild(input);
    row.appendChild(td);
  });

  const tdAction = document.createElement("td");
  const btn = document.createElement("button");
  btn.innerText = "Save";
  btn.onclick = () => {
    manualEntries.push(entry);
    saveManualEntries();
    alert("Entry saved!");
    row.remove();
    renderManualData();
  };
  tdAction.appendChild(btn);
  row.appendChild(tdAction);

  table.appendChild(row);
}

function saveManualEntries() {
  localStorage.setItem("manualData", JSON.stringify(manualEntries));
  applyAutoPacking();
}

function loadManualEntries() {
  const data = localStorage.getItem("manualData");
  if (data) {
    manualEntries = JSON.parse(data);
    renderManualData();
    applyAutoPacking();
  }
}

function renderManualData() {
  const container = document.getElementById("manual-data-display");
  container.innerHTML = "";

  manualEntries.forEach((entry, index) => {
    const div = document.createElement("div");
    div.className = "entry-box";
    div.innerText = `#${entry.boxNumber} - ${entry.company} (${entry.module}-${entry.subModule}) - ${entry.length}x${entry.width}x${entry.height} ft, ${entry.weight} kg`;
    container.appendChild(div);
  });
}

function clearManualEntries() {
  if (confirm("Are you sure you want to clear all manual entries?")) {
    manualEntries = [];
    localStorage.removeItem("manualData");
    renderManualData();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadManualEntries();

  const btn = document.getElementById("add-manual-entry");
  if (btn) btn.onclick = addManualEntryRow;

  const clearBtn = document.getElementById("clear-manual-entry");
  if (clearBtn) clearBtn.onclick = clearManualEntries;
});