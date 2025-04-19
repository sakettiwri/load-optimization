function render3DView(palletNo) {
    const container = document.getElementById("threeCanvasContainer");
    container.innerHTML = ""; // Clear previous canvas
  
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
  
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
  
    // Light
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);
  
    // Get boxes for selected pallet
    const boxes = allData.filter((box) => isRowVisible(box) && box.Pallet == palletNo);
  
    let x = 0, y = 0, z = 0;
    const palletLength = 9, palletWidth = 7, palletHeight = 7;
    const layerHeight = 0.5;
  
    const fontLoader = new THREE.FontLoader();
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
  
      boxes.forEach((box, index) => {
        const length = parseFloat(box.Length) || 1;
        const width = parseFloat(box.Width) || 1;
        const height = parseFloat(box.Height) || 1;
  
        // Box geometry
        const geometry = new THREE.BoxGeometry(length, height, width);
        const material = new THREE.MeshStandardMaterial({ color: 0x8ecae6 });
        const cube = new THREE.Mesh(geometry, material);
  
        // Positioning (layer wise)
        cube.position.set(x + length / 2, y + height / 2, z + width / 2);
        scene.add(cube);
  
        // Text Label: BoxNo - Company
        const labelText = `${box.BoxNo} - ${box.Company}`;
        const textGeom = new THREE.TextGeometry(labelText, {
          font: font,
          size: 0.3,
          height: 0.01,
        });
        const textMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const textMesh = new THREE.Mesh(textGeom, textMat);
        textGeom.computeBoundingBox();
        const textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;
        textMesh.position.set(cube.position.x - textWidth / 2, cube.position.y + height / 2 + 0.2, cube.position.z);
        scene.add(textMesh);
  
        // Move positions for next box
        x += length + 0.3;
        if (x + length > palletLength) {
          x = 0;
          z += width + 0.3;
          if (z + width > palletWidth) {
            z = 0;
            y += height + layerHeight;
          }
        }
      });
    });
  
    camera.position.set(12, 10, 12);
    camera.lookAt(0, 0, 0);
  
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  }
  