import * as THREE from 'three';
import { PROJECTS_DATA } from './galleryData.js';

export class TunnelScene {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x020206);
    this.scene.fog = new THREE.FogExp2(0x020206, 0.015);

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 130);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Animation & Smooth Damping State
    this.targetProgress = 0;
    this.currentProgress = 0;
    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);

    // Interactive elements
    this.artworkMeshes = [];
    this.portalRings = [];
    this.hologramNodes = [];
    this.raycaster = new THREE.Raycaster();
    this.hoveredIndex = -1;

    // Build Ultimate High-Tech Quantum Spatial Tunnel
    this.setupTechLights();
    this.setupTechCorridor();
    this.setupQuantumParticles();
    this.setupFloatingNodes();
    this.setupArtworks();

    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }

  setupTechLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    this.scene.add(ambientLight);

    // Dynamic Color-Shifting Point Lights down the corridor
    this.lightPoint1 = new THREE.PointLight(0x00f2fe, 5, 45);
    this.lightPoint1.position.set(0, 2, 0);
    this.scene.add(this.lightPoint1);

    this.lightPoint2 = new THREE.PointLight(0x8b5cf6, 5, 45);
    this.lightPoint2.position.set(0, -2, -40);
    this.scene.add(this.lightPoint2);

    this.lightPoint3 = new THREE.PointLight(0xff4d38, 5, 45);
    this.lightPoint3.position.set(0, 2, -80);
    this.scene.add(this.lightPoint3);
  }

  createTechCircuitTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#03030a';
    ctx.fillRect(0, 0, 1024, 1024);

    // High-Tech Circuit Grid Lines
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
    ctx.lineWidth = 2;

    for (let i = 0; i <= 1024; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 1024);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(1024, i);
      ctx.stroke();
    }

    // Circuit Traces & Microchips
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    for (let i = 64; i < 1024; i += 256) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, i);
      ctx.lineTo(1024, i);
      ctx.stroke();

      // Microchip nodes
      ctx.fillStyle = '#00f2fe';
      ctx.fillRect(i - 8, i - 8, 16, 16);
    }

    // Glowing Tech Dots
    ctx.fillStyle = '#ff4d38';
    for (let x = 0; x <= 1024; x += 128) {
      for (let y = 0; y <= 1024; y += 128) {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 30);
    return texture;
  }

  setupTechCorridor() {
    const circuitTexture = this.createTechCircuitTexture();
    const tunnelGroup = new THREE.Group();

    // 1. Octagonal Tunnel Cylinder Room
    const tunnelGeo = new THREE.CylinderGeometry(7.5, 7.5, 140, 8, 1, true);
    const tunnelMat = new THREE.MeshBasicMaterial({
      map: circuitTexture,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.95
    });
    const tunnelMesh = new THREE.Mesh(tunnelGeo, tunnelMat);
    tunnelMesh.rotation.x = Math.PI / 2;
    tunnelMesh.position.set(0, 0, -65);
    tunnelGroup.add(tunnelMesh);

    this.scene.add(tunnelGroup);

    // 2. High-Tech Glowing Hexagonal Portal Arches
    for (let z = 10; z > -130; z -= 7) {
      const ringGeo = new THREE.CylinderGeometry(7.6, 7.6, 0.12, 8, 1, true);
      const ringColors = [0x00f2fe, 0x8b5cf6, 0xff4d38, 0x3b82f6];
      const ringColor = ringColors[Math.abs(Math.floor(z / 7)) % ringColors.length];

      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColor,
        wireframe: true,
        transparent: true,
        opacity: 0.85
      });

      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, 0, z);
      this.scene.add(ring);
      this.portalRings.push(ring);
    }
  }

  setupQuantumParticles() {
    const count = 1200;
    this.particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color(0x00f2fe),
      new THREE.Color(0x8b5cf6),
      new THREE.Color(0xff4d38),
      new THREE.Color(0x3b82f6),
      new THREE.Color(0xffffff)
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = -Math.random() * 130;

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    this.particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.9
    });

    this.particlePoints = new THREE.Points(this.particleGeo, particleMat);
    this.scene.add(this.particlePoints);
  }

  setupFloatingNodes() {
    // Floating 3D Holographic Data Nodes in space
    for (let z = 0; z > -120; z -= 15) {
      const isLeft = (Math.abs(z) % 30 === 0);
      const xPos = isLeft ? -3.5 : 3.5;
      const yPos = isLeft ? 2.5 : -2.5;

      const nodeGeo = new THREE.IcosahedronGeometry(0.4, 0);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: isLeft ? 0x00f2fe : 0xff4d38,
        wireframe: true,
        transparent: true,
        opacity: 0.75
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(xPos, yPos, z);
      this.scene.add(nodeMesh);
      this.hologramNodes.push(nodeMesh);
    }
  }

  createArtworkTexture(project) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#04040c';
    ctx.fillRect(0, 0, 1024, 768);

    // Glowing Neon Cyber Border with Corner Accent Reticles
    ctx.strokeStyle = project.color;
    ctx.lineWidth = 10;
    ctx.strokeRect(10, 10, 1004, 748);

    // Tech HUD Header Bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fillRect(10, 10, 1004, 60);

    ctx.fillStyle = '#00f2fe';
    ctx.font = '700 20px Inter, monospace';
    ctx.fillText(`SYS.ID // 00${project.id} — SPATIAL CORE ACTIVE`, 30, 48);

    ctx.fillStyle = project.color;
    ctx.font = '700 20px Inter, monospace';
    ctx.fillText(`LATENCY: <3ms`, 820, 48);

    // Project Color Aura Sphere
    ctx.shadowColor = project.color;
    ctx.shadowBlur = 60;
    ctx.beginPath();
    ctx.arc(820, 260, 170, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = 'bold 36px Syne, sans-serif';
    ctx.fillText(`PROJECT ${project.number}`, 60, 130);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px Syne, sans-serif';
    ctx.fillText(project.title, 60, 210);

    ctx.fillStyle = '#a0a5b5';
    ctx.font = '26px Inter, sans-serif';
    ctx.fillText(project.tagline, 60, 275);

    let tagX = 60;
    project.tags.forEach(tag => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.roundRect(tagX, 330, 160, 46, 23);
      ctx.fill();
      ctx.strokeStyle = project.color;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '18px Inter, sans-serif';
      ctx.fillText(tag, tagX + 18, 359);
      tagX += 175;
    });

    // Code / Metrics HUD Box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(60, 450, 904, 230);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeRect(60, 450, 904, 230);

    let statX = 100;
    Object.entries(project.stats).forEach(([k, v]) => {
      ctx.fillStyle = project.color;
      ctx.font = 'bold 40px Syne, sans-serif';
      ctx.fillText(v, statX, 535);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '20px Inter, sans-serif';
      ctx.fillText(k.toUpperCase(), statX, 585);

      statX += 280;
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  setupArtworks() {
    PROJECTS_DATA.forEach((project, idx) => {
      const zPos = -10 - idx * 16;
      const isLeft = idx % 2 === 0;
      const xPos = isLeft ? -4.5 : 4.5;

      const frameGeo = new THREE.BoxGeometry(0.1, 4.2, 5.8);
      const texture = this.createArtworkTexture(project);

      const materials = [
        new THREE.MeshBasicMaterial({ map: texture }),
        new THREE.MeshBasicMaterial({ map: texture }),
        new THREE.MeshBasicMaterial({ color: 0x050512 }),
        new THREE.MeshBasicMaterial({ color: 0x050512 }),
        new THREE.MeshBasicMaterial({ color: 0x050512 }),
        new THREE.MeshBasicMaterial({ color: 0x050512 })
      ];

      const mesh = new THREE.Mesh(frameGeo, materials);
      mesh.position.set(xPos, 0, zPos);
      mesh.rotation.y = isLeft ? Math.PI / 2.3 : -Math.PI / 2.3;
      mesh.userData = { projectIndex: idx, projectData: project, basePos: mesh.position.clone() };

      const borderGeo = new THREE.BoxGeometry(0.14, 4.4, 6.0);
      const borderMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(project.color),
        transparent: true,
        opacity: 0.85,
        wireframe: true
      });
      const borderMesh = new THREE.Mesh(borderGeo, borderMat);
      mesh.add(borderMesh);

      this.scene.add(mesh);
      this.artworkMeshes.push(mesh);
    });
  }

  onMouseMove(e) {
    this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  updateProgress(targetP) {
    this.targetProgress = Math.max(0, Math.min(1, targetP));
  }

  checkRaycast() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.artworkMeshes);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const idx = hit.userData.projectIndex;
      if (this.hoveredIndex !== idx) {
        this.hoveredIndex = idx;
        document.body.style.cursor = 'pointer';
      }
    } else {
      if (this.hoveredIndex !== -1) {
        this.hoveredIndex = -1;
        document.body.style.cursor = 'default';
      }
    }
  }

  render() {
    // Silky lerp damping (0.04 factor)
    this.currentProgress += (this.targetProgress - this.currentProgress) * 0.04;
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.03;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.03;

    // Camera Z-Drive
    const targetZ = 3 - this.currentProgress * 96;
    this.camera.position.z = targetZ;
    this.camera.position.x = this.mouse.x * 0.35;
    this.camera.position.y = this.mouse.y * 0.35;

    this.camera.lookAt(this.mouse.x * 0.15, this.mouse.y * 0.15, targetZ - 20);

    const time = performance.now() * 0.0015;

    // Rotate Portal Rings & dynamic lights
    this.portalRings.forEach((ring, idx) => {
      ring.rotation.z = time * 0.25 + idx * 0.06;
    });

    // Rotate Floating Holographic Nodes
    this.hologramNodes.forEach((node, idx) => {
      node.rotation.x = time * 0.5 + idx;
      node.rotation.y = time * 0.7 + idx;
    });

    // Animate Quantum Particles
    if (this.particlePoints) {
      const positions = this.particleGeo.attributes.position.array;
      for (let i = 0; i < 1200; i++) {
        positions[i * 3 + 2] += 0.18;
        if (positions[i * 3 + 2] > targetZ + 5) {
          positions[i * 3 + 2] = targetZ - 120;
        }
      }
      this.particleGeo.attributes.position.needsUpdate = true;
    }

    // Animate Artwork Floating
    this.artworkMeshes.forEach((mesh, idx) => {
      const isHovered = (idx === this.hoveredIndex);
      const floatOffset = Math.sin(time * 1.5 + idx) * 0.08;
      mesh.position.y = mesh.userData.basePos.y + floatOffset;

      const targetScale = isHovered ? 1.08 : 1.0;
      mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
    });

    this.checkRaycast();
    this.renderer.render(this.scene, this.camera);
  }
}
