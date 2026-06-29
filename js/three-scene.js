/* ==========================================================================
   THREE-SCENE.JS - Original 3D Background (Particles, Toruses, Icosahedron, Grid)
   ========================================================================== */

(function () {
  // Check if Three.js is loaded
  if (typeof THREE === 'undefined') {
    console.error('Three.js is not loaded.');
    return;
  }

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  // Renderer Setup
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Scene Setup
  const scene = new THREE.Scene();

  // Camera Setup
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 22);

  // Lighting - cyan/teal color tones matching dental aesthetics
  const ambientLight = new THREE.AmbientLight(0x00b4d8, 0.4);
  scene.add(ambientLight);
  
  const pointLight1 = new THREE.PointLight(0x00b4d8, 2.5, 80);
  pointLight1.position.set(10, 10, 10);
  scene.add(pointLight1);
  
  const pointLight2 = new THREE.PointLight(0x0077b6, 2.0, 80);
  pointLight2.position.set(-10, -10, -5);
  scene.add(pointLight2);

  // Particle System
  const particleCount = 400;
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 80;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;
    sizes[i] = Math.random() * 1.5 + 0.3;
  }
  
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  const particleMat = new THREE.PointsMaterial({
    color: 0x00b4d8,
    size: 0.18,
    transparent: true,
    opacity: 0.65,
    sizeAttenuation: true,
  });
  
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Torus Group
  const torusGroup = new THREE.Group();
  scene.add(torusGroup);

  const torusMat = new THREE.MeshStandardMaterial({
    color: 0x00b4d8,
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: 0.25,
  });

  for (let i = 0; i < 5; i++) {
    const r = 2 + i * 1.2;
    const geo = new THREE.TorusGeometry(r, 0.04, 12, 80);
    const mat = torusMat.clone();
    mat.opacity = 0.12 - i * 0.018;
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    mesh.position.set(
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 4 - 6
    );
    mesh.userData = {
      rotSpeedX: (Math.random() - 0.5) * 0.003,
      rotSpeedY: (Math.random() - 0.5) * 0.004,
      floatAmp: Math.random() * 0.4 + 0.1,
      floatFreq: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
    };
    torusGroup.add(mesh);
  }

  // Wireframe Icosahedron
  const icosGeo = new THREE.IcosahedronGeometry(2.8, 1);
  const icosMat = new THREE.MeshStandardMaterial({
    color: 0x00b4d8,
    metalness: 0.9,
    roughness: 0.1,
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  });
  const icos = new THREE.Mesh(icosGeo, icosMat);
  icos.position.set(7, 0, -5);
  scene.add(icos);

  // Grid Helper
  const gridHelper = new THREE.GridHelper(80, 40, 0x00b4d8, 0x023e8a);
  gridHelper.material.opacity = 0.08;
  gridHelper.material.transparent = true;
  gridHelper.position.y = -14;
  scene.add(gridHelper);

  // Interactive 3D Model: Stylized Dental implant / tooth structure to be showcased
  const toothGroup = new THREE.Group();
  const toothMat = new THREE.MeshPhysicalMaterial({
    color: 0xe0f7fa, // Soft cyan-tinted white to match dental branding
    metalness: 0.1,
    roughness: 0.15,
    transmission: 0.75, // Translucency balance
    ior: 1.55,
    transparent: true,
    opacity: 0.95,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });

  // Molar Crown Base (rounded cylinder base)
  const crownBaseGeo = new THREE.CylinderGeometry(1.4, 1.1, 1.4, 32);
  const crownBase = new THREE.Mesh(crownBaseGeo, toothMat);
  crownBase.position.y = 0.1;
  toothGroup.add(crownBase);

  // 4 Cusps of the Molar (positioned at top corners of the base)
  const cuspGeo = new THREE.SphereGeometry(0.52, 24, 24);
  
  const cuspFL = new THREE.Mesh(cuspGeo, toothMat);
  cuspFL.position.set(-0.5, 0.7, -0.5);
  cuspFL.scale.set(1, 1.2, 1);
  toothGroup.add(cuspFL);

  const cuspFR = new THREE.Mesh(cuspGeo, toothMat);
  cuspFR.position.set(0.5, 0.7, -0.5);
  cuspFR.scale.set(1, 1.2, 1);
  toothGroup.add(cuspFR);

  const cuspBL = new THREE.Mesh(cuspGeo, toothMat);
  cuspBL.position.set(-0.5, 0.7, 0.5);
  cuspBL.scale.set(1, 1.2, 1);
  toothGroup.add(cuspBL);

  const cuspBR = new THREE.Mesh(cuspGeo, toothMat);
  cuspBR.position.set(0.5, 0.7, 0.5);
  cuspBR.scale.set(1, 1.2, 1);
  toothGroup.add(cuspBR);

  // Roots of the Molar
  const rootGeo = new THREE.ConeGeometry(0.48, 2.0, 16);
  
  const rootL = new THREE.Mesh(rootGeo, toothMat);
  rootL.position.set(-0.5, -1.3, 0);
  rootL.rotation.z = 0.18;
  toothGroup.add(rootL);

  const rootR = new THREE.Mesh(rootGeo, toothMat);
  rootR.position.set(0.5, -1.3, 0);
  rootR.rotation.z = -0.18;
  toothGroup.add(rootR);

  // Default positioning for Hero section
  toothGroup.position.set(6, 0, -4);
  scene.add(toothGroup);

  // Mouse Parallax movement variables
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    particles.rotation.y = t * 0.012;
    particles.rotation.x = t * 0.006;

    torusGroup.children.forEach(m => {
      m.rotation.x += m.userData.rotSpeedX;
      m.rotation.y += m.userData.rotSpeedY;
      m.position.y += Math.sin(t * m.userData.floatFreq + m.userData.phase) * m.userData.floatAmp * 0.005;
    });

    icos.rotation.x = t * 0.07;
    icos.rotation.y = t * 0.11;

    // Tooth model rotation (if not overridden by GSAP ScrollTrigger)
    if (!window.gsapOverrideActive) {
      toothGroup.rotation.y = t * 0.25;
      toothGroup.rotation.x = Math.sin(t * 0.5) * 0.12;
      toothGroup.position.y = Math.sin(t * 0.8) * 0.3;
    }

    // Camera mouse coordinate follow calculations
    targetX = mouseX * 1.5;
    targetY = -mouseY * 1.0;

    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  
  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  // Expose refs for GSAP ScrollTrigger
  window.toothScene = { scene, camera, toothGroup, renderer };

  // ==========================================================================
  // SECONDARY 3D SCENE - Interactive Calculator Molar Preview
  // ==========================================================================
  const calcCanvas = document.getElementById('calc-3d-canvas');
  if (calcCanvas) {
    const calcWidth = calcCanvas.parentElement.clientWidth || 300;
    const calcHeight = calcCanvas.parentElement.clientHeight || 280;

    const calcRenderer = new THREE.WebGLRenderer({ canvas: calcCanvas, alpha: true, antialias: true });
    calcRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    calcRenderer.setSize(calcWidth, calcHeight);

    const calcScene = new THREE.Scene();

    const calcCamera = new THREE.PerspectiveCamera(45, calcWidth / calcHeight, 0.1, 100);
    calcCamera.position.set(0, 0, 7.5);

    const calcAmbient = new THREE.AmbientLight(0xffffff, 0.7);
    calcScene.add(calcAmbient);

    const calcDirLight = new THREE.DirectionalLight(0x00b4d8, 3.0);
    calcDirLight.position.set(5, 5, 5);
    calcScene.add(calcDirLight);

    const calcDirLight2 = new THREE.DirectionalLight(0x0077b6, 2.0);
    calcDirLight2.position.set(-5, -5, 3);
    calcScene.add(calcDirLight2);

    const calcToothGroup = new THREE.Group();
    calcScene.add(calcToothGroup);

    // Physical Glassy Translucent Material
    const calcToothMat = new THREE.MeshPhysicalMaterial({
      color: 0x90e0ef, // Soft cyan glass matching calculator theme
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.9,
      ior: 1.5,
      transparent: true,
      opacity: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });

    const calcCrownBaseGeo = new THREE.CylinderGeometry(1.2, 0.95, 1.2, 32);
    const calcCrownBase = new THREE.Mesh(calcCrownBaseGeo, calcToothMat);
    calcCrownBase.position.y = 0.1;
    calcToothGroup.add(calcCrownBase);

    const calcCuspGeo = new THREE.SphereGeometry(0.46, 24, 24);
    const cuspFL = new THREE.Mesh(calcCuspGeo, calcToothMat);
    cuspFL.position.set(-0.4, 0.6, -0.4);
    cuspFL.scale.set(1, 1.2, 1);
    calcToothGroup.add(cuspFL);

    const cuspFR = new THREE.Mesh(calcCuspGeo, calcToothMat);
    cuspFR.position.set(0.4, 0.6, -0.4);
    cuspFR.scale.set(1, 1.2, 1);
    calcToothGroup.add(cuspFR);

    const cuspBL = new THREE.Mesh(calcCuspGeo, calcToothMat);
    cuspBL.position.set(-0.4, 0.6, 0.4);
    cuspBL.scale.set(1, 1.2, 1);
    calcToothGroup.add(cuspBL);

    const cuspBR = new THREE.Mesh(calcCuspGeo, calcToothMat);
    cuspBR.position.set(0.4, 0.6, 0.4);
    cuspBR.scale.set(1, 1.2, 1);
    calcToothGroup.add(cuspBR);

    const calcRootGeo = new THREE.ConeGeometry(0.4, 1.6, 16);
    const rootL = new THREE.Mesh(calcRootGeo, calcToothMat);
    rootL.position.set(-0.4, -1.0, 0);
    rootL.rotation.z = 0.15;
    calcToothGroup.add(rootL);

    const rootR = new THREE.Mesh(calcRootGeo, calcToothMat);
    rootR.position.set(0.4, -1.0, 0);
    rootR.rotation.z = -0.15;
    calcToothGroup.add(rootR);

    // Interactive Drag Mechanics
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let autoRotationSpeed = 0.015;

    calcCanvas.addEventListener('mousedown', e => {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    calcCanvas.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      const deltaY = e.clientY - previousMouseY;

      calcToothGroup.rotation.y += deltaX * 0.01;
      calcToothGroup.rotation.x += deltaY * 0.01;

      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
      autoRotationSpeed = 0; // stop auto rotating once user drags
    });

    // Touch support for mobile
    calcCanvas.addEventListener('touchstart', e => {
      isDragging = true;
      previousMouseX = e.touches[0].clientX;
      previousMouseY = e.touches[0].clientY;
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    calcCanvas.addEventListener('touchmove', e => {
      if (!isDragging) return;
      const deltaX = e.touches[0].clientX - previousMouseX;
      const deltaY = e.touches[0].clientY - previousMouseY;

      calcToothGroup.rotation.y += deltaX * 0.01;
      calcToothGroup.rotation.x += deltaY * 0.01;

      previousMouseX = e.touches[0].clientX;
      previousMouseY = e.touches[0].clientY;
      autoRotationSpeed = 0;
    });

    function calcAnimate() {
      requestAnimationFrame(calcAnimate);
      
      // Auto rotate if not dragged
      if (!isDragging && autoRotationSpeed > 0) {
        calcToothGroup.rotation.y += autoRotationSpeed;
        calcToothGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
      }
      
      calcRenderer.render(calcScene, calcCamera);
    }
    calcAnimate();

    // Resize handler for calculator canvas
    window.addEventListener('resize', () => {
      const w = calcCanvas.parentElement.clientWidth || 300;
      const h = calcCanvas.parentElement.clientHeight || 280;
      calcRenderer.setSize(w, h);
      calcCamera.aspect = w / h;
      calcCamera.updateProjectionMatrix();
    });
  }
})();
