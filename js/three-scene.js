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
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.9,
    ior: 1.5,
    transparent: true,
    opacity: 0.9,
    clearcoat: 1.0
  });

  const crownGeo = new THREE.TorusKnotGeometry(1.6, 0.5, 100, 16, 2, 3);
  const crown = new THREE.Mesh(crownGeo, toothMat);
  toothGroup.add(crown);

  const rootGeo = new THREE.ConeGeometry(0.5, 2.2, 8);
  const rootL = new THREE.Mesh(rootGeo, toothMat);
  rootL.position.set(-0.8, -1.8, 0);
  rootL.rotation.z = 0.22;
  toothGroup.add(rootL);

  const rootR = new THREE.Mesh(rootGeo, toothMat);
  rootR.position.set(0.8, -1.8, 0);
  rootR.rotation.z = -0.22;
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
})();
