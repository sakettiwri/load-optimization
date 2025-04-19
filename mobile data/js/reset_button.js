function resetAllData() {
    if (!confirm("क्या आप वाकई सारा डेटा रीसेट करना चाहते हैं?")) return;
  
    // Clear table
    const tableBody = document.querySelector("#data-table tbody");
    if (tableBody) tableBody.innerHTML = "";
  
    // Clear 3D view
    const container = document.getElementById("pallet-3d-container");
    if (container) container.innerHTML = "";
  
    // Clear summary
    document.getElementById("summary-boxes").innerText = "0";
    document.getElementById("summary-pallets").innerText = "0";
    document.getElementById("summary-weight").innerText = "0 kg";
    document.getElementById("summary-volume").innerText = "0 ft³";
  
    // Clear local storage
    localStorage.removeItem("skid_data");
  
    // Clear global boxData
    if (window.boxData) {
      window.boxData = [];
    }
  
    alert("डेटा सफलतापूर्वक रीसेट कर दिया गया है ✅");
  }