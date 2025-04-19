function showPallet3DView(palletNumber) {
    const container = document.getElementById("pallet-3d-container");
    container.innerHTML = "";
    init3DSceneForPallet(palletNumber); // You must define this function elsewhere
  }
  