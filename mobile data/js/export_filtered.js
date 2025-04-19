function exportVisibleTableToExcel(tableId = "data-table") {
    const table = document.getElementById(tableId);
    const clone = table.cloneNode(true);
  
    Array.from(clone.querySelectorAll("tr")).forEach(row => {
      if (row.style.display === "none") row.remove();
    });
  
    let html = clone.outerHTML;
    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "Filtered_SkidPacking.xls";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  function printFilteredView() {
    const original = document.body.innerHTML;
    const table = document.getElementById("data-table").cloneNode(true);
  
    Array.from(table.querySelectorAll("tr")).forEach(row => {
      if (row.style.display === "none") row.remove();
    });
  
    const printable = `<html><head><title>Print View</title></head><body>${table.outerHTML}</body></html>`;
    const win = window.open("", "", "height=700,width=900");
    win.document.write(printable);
    win.document.close();
    win.print();
  }
  