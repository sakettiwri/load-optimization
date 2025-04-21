import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls";

export function render3DView(selectedPallet) {
  const canvasContainer = document.getElementById("threeCanvas");
  canvasContainer.innerHTML = "";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
  canvasContainer.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  const light = new THREE.AmbientLight(0xffffff);
  scene.add(light);

  // Grid setup
  const gridHelper = new THREE.GridHelper(108, 10); // 9 ft pallet length
  scene.add(gridHelper);

  let data = window.allData.filter(item => item.Pallet === selectedPallet);
  let startX = 0, startY = 0, startZ = 0;
  let layerHeight = 0;

  data.forEach((box, i) => {
    const geometry = new THREE.BoxGeometry(box.Length, box.Height, box.Width);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(`hsl(${(i * 35) % 360}, 70%, 60%)`),
    });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(startX + box.Length / 2, startY + box.Height / 2, startZ + box.Width / 2);
    scene.add(mesh);

    // Position update logic for next box
    startX += box.Length;
    if (startX + box.Length > 108) {
      startX = 0;
      startZ += box.Width;
    }
    if (startZ + box.Width > 84) {
      startZ = 0;
      startY += layerHeight;
      layerHeight = 0;
    }
    if (box.Height > layerHeight) {
      layerHeight = box.Height;
    }
  });

  camera.position.set(100, 100, 200);
  camera.lookAt(scene.position);

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}
function render3DBoxLayout(palletData) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    palletData.forEach(item => {
        const geometry = new THREE.BoxGeometry(parseFloat(item['Length']), parseFloat(item['Height']), parseFloat(item['Width']));
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const box = new THREE.Mesh(geometry, material);

        // Position boxes in 3D space
        box.position.set(Math.random() * 10, Math.random() * 10, Math.random() * 10);
        scene.add(box);
    });

    camera.position.z = 50;

    const animate = function () {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };

    animate();
}
