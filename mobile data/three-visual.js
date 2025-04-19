let scene, camera, renderer, controls, boxGroup;

function init3DScene() {
  const container = document.getElementById("threeCanvasContainer");
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf8f9fa);

  // Camera setup
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(15, 15, 20);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  container.innerHTML = ""; // Clear previous canvas
  container.appendChild(renderer.domElement);

  // Controls (Orbit)
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.update();

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 10);
  scene.add(directionalLight);

  // Ground/Grid
  const gridHelper = new THREE.GridHelper(9, 9, 0xaaaaaa, 0xdddddd);
  gridHelper.rotation.x = Math.PI / 2;
  scene.add(gridHelper);

  // Box group holder
  boxGroup = new THREE.Group();
  scene.add(boxGroup);

  animate();
}

function render3DView(palletNo) {
    const container = document.getElementById("threeCanvasContainer");
    container.innerHTML = ""; // Clear previous canvas
  
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
  
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
  
    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);
  
    const boxes = allData.filter((box) => isRowVisible(box) && box.Pallet == palletNo);
  
    let x = 0, y = 0, z = 0;
    boxes.forEach((box, index) => {
      const length = parseFloat(box.Length) || 1;
      const width = parseFloat(box.Width) || 1;
      const height = parseFloat(box.Height) || 1;
  
      const geometry = new THREE.BoxGeometry(length, height, width);
      const material = new THREE.MeshStandardMaterial({ color: 0x8ecae6 });
      const cube = new THREE.Mesh(geometry, material);
  
      cube.position.set(x + length / 2, y + height / 2, z + width / 2);
      scene.add(cube);
  
      x += length + 0.5;
      if (x > 9) { x = 0; z += width + 0.5; }
      if (z > 7) { z = 0; y += height + 0.5; }
    });
  
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
  
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  }
  

    // Calculate position in layer
    const x = currentRow * length + length / 2;
    const y = layerHeight + height / 2;
    const z = currentCol * width + width / 2;

    cube.position.set(x, y, z);
    boxGroup.add(cube);

    // Label: BoxNo + Company
    const label = makeTextSprite(`${box.BoxNo} - ${box.Company}`, { fontsize: 60, borderColor: {r:0, g:0, b:0, a:1} });
    label.position.set(x, y + height / 2 + 0.1, z);
    boxGroup.add(label);

    // Update stacking layout logic
    currentCol++;
    if ((currentCol + 1) * width > 7) {
      currentCol = 0;
      currentRow++;
    }
    if ((currentRow + 1) * length > 9) {
      currentRow = 0;
      currentCol = 0;
      layerHeight += height;
    }
  });
}

function makeTextSprite(message, parameters) {
  const fontface = parameters.fontface || "Arial";
  const fontsize = parameters.fontsize || 18;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = fontsize + "px " + fontface;
  const textWidth = context.measureText(message).width;
  canvas.width = textWidth + 20;
  canvas.height = fontsize + 20;
  context.font = fontsize + "px " + fontface;
  context.fillStyle = "rgba(0, 0, 0, 1.0)";
  context.fillText(message, 10, fontsize + 10);
  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(3, 1, 1);
  return sprite;
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
