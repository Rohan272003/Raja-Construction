'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
    // Fall back to window size if container size is not yet computed (0)
    let width = containerRef.current.clientWidth || window.innerWidth;
    let height = containerRef.current.clientHeight || Math.round(window.innerHeight * 0.86);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x061d15, 0.015);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 5, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Responsive canvas styling
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.pointerEvents = 'none';

    containerRef.current.appendChild(renderer.domElement);

    // --- Create 3D Objects ---

    // 1. Blueprint Grid Mesh (Waving wireframe plane)
    const gridWidth = 60;
    const gridHeight = 60;
    const gridSegments = 30;
    const planeGeom = new THREE.PlaneGeometry(gridWidth, gridHeight, gridSegments, gridSegments);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x064e3b, // Deep green grid lines
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const terrainGrid = new THREE.Mesh(planeGeom, planeMat);
    terrainGrid.rotation.x = -Math.PI / 2; // Flat on the floor
    terrainGrid.position.y = -4; // Shift down
    scene.add(terrainGrid);

    // 2. Blueprint Vertex Points (Glowing nodes on the grid)
    const pointsCount = planeGeom.attributes.position.count;
    const pointsGeom = new THREE.BufferGeometry();
    // Copy positions from the plane geometry
    pointsGeom.setAttribute('position', planeGeom.attributes.position.clone());

    // Create a circular glowing texture
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(16,185,129,0.8)'); // Emerald outer glow
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const pointsMat = new THREE.PointsMaterial({
      size: 0.35,
      transparent: true,
      opacity: 0.8,
      map: particleTexture,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const terrainPoints = new THREE.Points(pointsGeom, pointsMat);
    terrainPoints.rotation.x = -Math.PI / 2;
    terrainPoints.position.y = -4;
    scene.add(terrainPoints);

    // 3. Floating Ambient Particles (Stars)
    const starCount = 120;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 40;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 20 + 2;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.15,
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      map: particleTexture,
      depthWrite: false,
    });
    const starPoints = new THREE.Points(starGeometry, starMaterial);
    scene.add(starPoints);

    // 4. Central Architectural Wireframe Shape (Rotating Polyhedrons)
    const archGroup = new THREE.Group();
    archGroup.position.set(7, 1, -4); // Position on the right side of the screen
    scene.add(archGroup);

    // Outer Octahedron
    const outerGeom = new THREE.OctahedronGeometry(3.5, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x10b981, // Vibrant emerald green
      wireframe: true,
      transparent: true,
      opacity: 0.35, // High visibility
    });
    const outerMesh = new THREE.Mesh(outerGeom, outerMat);
    archGroup.add(outerMesh);

    // Inner Icosahedron
    const innerGeom = new THREE.IcosahedronGeometry(2.2, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xef4444, // Vibrant ruby red
      wireframe: true,
      transparent: true,
      opacity: 0.5, // High visibility
    });
    const innerMesh = new THREE.Mesh(innerGeom, innerMat);
    archGroup.add(innerMesh);

    // Glowing Core Sphere
    const coreGeom = new THREE.SphereGeometry(0.5, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff, // Bright white glowing core
      transparent: true,
      opacity: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    archGroup.add(coreMesh);

    // Add actual point light inside
    const coreLight = new THREE.PointLight(0x10b981, 3, 20);
    coreLight.position.set(0, 0, 0);
    archGroup.add(coreLight);

    // --- Interactive Mouse Movement ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // --- Animation Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // 1. Animate Waving Terrain Grid
      const posAttr = planeGeom.attributes.position;
      const ptsPosAttr = pointsGeom.attributes.position;

      if (posAttr && ptsPosAttr) {
        const arr = posAttr.array as Float32Array;
        const ptsArr = ptsPosAttr.array as Float32Array;

        for (let i = 0; i < posAttr.count; i++) {
          const x = arr[i * 3];
          const y = arr[i * 3 + 1]; // Local y is plane layout coordinate

          // Wave equation
          const heightValue =
            Math.sin(x * 0.12 + time * 0.8) * Math.cos(y * 0.12 + time * 0.8) * 1.6 +
            Math.sin((x + y) * 0.06 + time * 0.4) * 0.8;

          // Local z coordinate represents plane displacement
          arr[i * 3 + 2] = heightValue;
          ptsArr[i * 3 + 2] = heightValue;
        }
        posAttr.needsUpdate = true;
        ptsPosAttr.needsUpdate = true;
      }

      // 2. Slow Rotations
      terrainGrid.rotation.z = time * 0.02;
      terrainPoints.rotation.z = time * 0.02;
      starPoints.rotation.y = -time * 0.01;

      outerMesh.rotation.y = time * 0.07;
      outerMesh.rotation.x = time * 0.04;
      innerMesh.rotation.y = -time * 0.1;
      innerMesh.rotation.x = -time * 0.06;

      // Pulse the core sphere size slightly
      const pulse = 1 + Math.sin(time * 3) * 0.15;
      coreMesh.scale.set(pulse, pulse, pulse);

      // 3. Mouse Parallax Easing
      targetX = mouseX * 2.5;
      targetY = mouseY * 1.5;

      archGroup.rotation.y += (targetX - archGroup.rotation.y) * 0.04;
      archGroup.rotation.x += (targetY - archGroup.rotation.x) * 0.04;

      camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.03;
      camera.position.y += (mouseY * 1.2 + 5 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // --- Resize Handler ---
    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth || window.innerWidth;
      height = containerRef.current.clientHeight || Math.round(window.innerHeight * 0.86);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      planeGeom.dispose();
      planeMat.dispose();
      pointsGeom.dispose();
      pointsMat.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      outerGeom.dispose();
      outerMat.dispose();
      innerGeom.dispose();
      innerMat.dispose();
      coreGeom.dispose();
      coreMat.dispose();
      particleTexture.dispose();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      style={{ minHeight: '100%' }}
    />
  );
}
