let scene, camera, renderer, controls;

function init3DLayout(pallets) {
  const canvasContainer = document.getElementById("pallet-3d-view");
  canvasContainer.innerHTML = "";

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, 1.5, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(800, 600);
  canvasContainer.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const gridHelper = new THREE.GridHelper(100, 20);
  scene.add(gridHelper);

  const maxHeight = 7;
  const scale = 10;

  let palletGap = 100;

  pallets.forEach((pallet, pIndex) => {
    let xStart = pIndex * palletGap;
    let y = 0;
    let z = 0;

    pallet.forEach((box, i) => {
      const boxGeo = new THREE.BoxGeometry(
        box.length * scale,
        box.height * scale,
        box.width * scale
      );

      const material = new THREE.MeshPhongMaterial({
        color: getColor3D(box.company),
        transparent: true,
        opacity: 0.9
      });

      const cube = new THREE.Mesh(boxGeo, material);

      cube.position.x = xStart + (box.length * scale) / 2;
      cube.position.y = (box.height * scale) / 2 + y;
      cube.position.z = z + (box.width * scale) / 2;

      const label = createLabel(`${box.boxNumber} (${box.company})`);
      label.position.set(cube.position.x, cube.position.y + 10, cube.position.z);

      scene.add(cube);
      scene.add(label);

      z += box.width * scale;
      if (z > palletWidth * scale) {
        z = 0;
        y += box.height * scale;
      }
    });
  });

  camera.position.set(100, 100, 200);
  camera.lookAt(0, 0, 0);

  animate();
}

function getColor3D(company)