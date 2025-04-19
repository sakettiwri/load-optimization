function printView() {
  const printContents = document.getElementById("data-table").outerHTML;
  const style = `
    <style>
      body { font-family: Arial; padding: 20px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #000; padding: 8px; text-align: center; }
      h1 { text-align: center; }
      .footer { position: fixed; bottom: 20px; text-align: center; font-size: 12px; }
    </style>
  `;
  const brand = `<h1>🚁 Skid Packing System</h1><hr>`;
  const footer = `<div class="footer">Designed by Hav Ritesh | ${new Date().toLocaleString()}</div>`;

  const win = window.open("", "_blank");
  win.document.write("<html><head><title>Print Preview</title>");
  win.document.write(style);
  win.document.write("</head><body>");
  win.document.write(brand + printContents + footer);
  win.document.write("</body></html>");
  win.document.close();
  win.print();
}
