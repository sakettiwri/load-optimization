function exportToExcel(tableId = "data-table") {
    const table = document.getElementById(tableId);
    const wb = XLSX.utils.table_to_book(table, { sheet: "Packing Data" });
    XLSX.writeFile(wb, "SkidPackingData.xlsx");
  }
  
  async function exportToPDF(tableId = "data-table") {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const table = document.getElementById(tableId);
  
    let y = 10;
    pdf.setFontSize(14);
    pdf.text("Skid Packing System Report", 20, y);
    y += 10;
  
    const rows = [];
    const headers = [];
  
    table.querySelectorAll("thead th").forEach(th => headers.push(th.innerText));
    rows.push(headers);
  
    table.querySelectorAll("tbody tr").forEach(tr => {
      const row = [];
      tr.querySelectorAll("td").forEach(td => row.push(td.innerText));
      rows.push(row);
    });
  
    rows.forEach((row, i) => {
      row.forEach((cell, j) => {
        pdf.text(cell, 20 + j * 40, y + i * 10);
      });
    });
  
    pdf.save("SkidPackingData.pdf");
  }
  