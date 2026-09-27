import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { Layers, Activity, Database, Sparkles, RefreshCw } from 'lucide-react';

interface DataCubeSceneProps {
  className?: string;
}

export const DataCubeScene: React.FC<DataCubeSceneProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [activeDimension, setActiveDimension] = useState<string>('Healthcare Measures');
  const [selectedCellInfo, setSelectedCellInfo] = useState<{
    coord: string;
    metric: string;
    dimension: string;
  }>({
    coord: 'OLAP [T:Q3, M:Patient Exp, L:Kadapa]',
    metric: '98.2% Satisfaction Score',
    dimension: 'Patient Experience Slice'
  });

  const dimensions = [
    { id: 'Healthcare Measures', label: 'Healthcare Measures', icon: Activity },
    { id: 'OLAP Slices', label: 'OLAP Time Series', icon: Layers },
    { id: 'Clinical Workflows', label: 'Clinical Workflows', icon: Database }
  ];

  useEffect(() => {
    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsReducedMotion(true);
      return;
    }

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Theme color palettes
    const isDark = theme === 'dark';
    const primaryColor = isDark ? 0xe11d48 : 0x0284c7; // Crimson vs Ocean Blue
    const secondaryColor = isDark ? 0xbe123c : 0x0369a1;
    const accentCoreColor = isDark ? 0xff4d79 : 0x38bdf8;
    const wireColor = isDark ? 0x881337 : 0x075985;
    const particleColor = isDark ? 0xf43f5e : 0x38bdf8;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for entire OLAP structure
    const olapGroup = new THREE.Group();
    scene.add(olapGroup);

    // Build 3x3x3 OLAP Data Cube
    const cubeSize = 0.55;
    const gap = 0.12;
    const subCubes: THREE.Mesh[] = [];

    const boxGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const isCenter = x === 0 && y === 0 && z === 0;
          const isCorner = Math.abs(x) + Math.abs(y) + Math.abs(z) === 3;

          const material = new THREE.MeshPhysicalMaterial({
            color: isCenter ? accentCoreColor : isCorner ? primaryColor : secondaryColor,
            metalness: 0.2,
            roughness: 0.1,
            transmission: 0.75, // Glass effect
            thickness: 0.5,
            transparent: true,
            opacity: isCenter ? 0.95 : 0.65,
            reflectivity: 0.9
          });

          const cube = new THREE.Mesh(boxGeo, material);
          cube.position.set(
            x * (cubeSize + gap),
            y * (cubeSize + gap),
            z * (cubeSize + gap)
          );

          // Wireframe outline
          const edges = new THREE.EdgesGeometry(boxGeo);
          const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({
              color: isCenter ? accentCoreColor : wireColor,
              transparent: true,
              opacity: 0.75
            })
          );
          cube.add(line);

          cube.userData = {
            coord: `[X:${x}, Y:${y}, Z:${z}]`,
            originalY: cube.position.y
          };

          subCubes.push(cube);
          olapGroup.add(cube);
        }
      }
    }

    // Floating Data Nodes orbiting around the OLAP cube
    const nodeCount = 18;
    const nodeGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const nodeMat = new THREE.MeshBasicMaterial({ color: accentCoreColor });
    const nodesGroup = new THREE.Group();
    const nodeData: { mesh: THREE.Mesh; angle: number; radius: number; speed: number; y: number }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 2.4 + (i % 3) * 0.4;
      const y = (Math.sin(i * 1.5) * 1.2);
      mesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      nodesGroup.add(mesh);

      nodeData.push({
        mesh,
        angle,
        radius,
        speed: 0.003 + (i % 4) * 0.001,
        y
      });
    }
    scene.add(nodesGroup);

    // Background Particle Cloud
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 16;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: particleColor,
      size: 0.05,
      transparent: true,
      opacity: 0.45
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.9 : 1.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(primaryColor, 3, 20);
    pointLight1.position.set(4, 5, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(accentCoreColor, 2, 20);
    pointLight2.position.set(-4, -4, 3);
    scene.add(pointLight2);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0.35;
    let targetRotationY = -0.45;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
      targetRotationY = x * 1.2;
      targetRotationX = -y * 0.8;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Touch interaction
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        const rect = container.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
        targetRotationY = x * 1.0;
        targetRotationX = -y * 0.6;
      }
    };
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Click on cube to trigger slice action
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(subCubes);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        // Animate pulse
        hit.scale.set(1.2, 1.2, 1.2);
        setTimeout(() => hit.scale.set(1, 1, 1), 300);

        const sampleMetrics = [
          { coord: 'OLAP [Time: Q4, Measure: Readmission Rate]', metric: '1.4% Reduced Margin', dimension: 'Inpatient Quality' },
          { coord: 'OLAP [Dim: Clinical Workflows, Dept: Cardiology]', metric: '84.6% Flow Efficiency', dimension: 'Physician Workload' },
          { coord: 'OLAP [Dim: Geographic Region, Zone: South]', metric: '99.1% Reporting Coverage', dimension: 'Hospital Operations' },
          { coord: 'OLAP [Dim: SQL Aggregation, Pipeline: ETL]', metric: '420ms Latency', dimension: 'Data Modeling' }
        ];
        const picked = sampleMetrics[Math.floor(Math.random() * sampleMetrics.length)];
        setSelectedCellInfo(picked);
      }
    };
    container.addEventListener('click', handleClick);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth damp rotation
      olapGroup.rotation.y += (targetRotationY - olapGroup.rotation.y) * 0.05 + 0.002;
      olapGroup.rotation.x += (targetRotationX - olapGroup.rotation.x) * 0.05;

      // Subtle breathing float for OLAP subcubes
      subCubes.forEach((cube, i) => {
        cube.position.y = cube.userData.originalY + Math.sin(time * 1.5 + i * 0.1) * 0.02;
      });

      // Orbit data nodes
      nodeData.forEach(item => {
        item.angle += item.speed;
        item.mesh.position.x = Math.cos(item.angle) * item.radius;
        item.mesh.position.z = Math.sin(item.angle) * item.radius;
        item.mesh.position.y = item.y + Math.sin(time * 2 + item.angle) * 0.15;
      });

      // Subtle particle drift
      particleSystem.rotation.y = time * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [theme, isReducedMotion]);

  return (
    <div className={`relative w-full h-[420px] sm:h-[480px] lg:h-[540px] flex items-center justify-center ${className}`}>
      {/* 3D Canvas Container */}
      {hasWebGL && !isReducedMotion ? (
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      ) : (
        /* Lightweight Fallback for Reduced Motion / Low-power devices */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
          <div className="relative w-44 h-44 border border-rose-500/30 rounded-2xl flex items-center justify-center bg-rose-500/5 backdrop-blur-md">
            <div className="absolute inset-4 border border-rose-500/20 rounded-xl" />
            <div className="grid grid-cols-3 gap-2">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-sm flex items-center justify-center transition-all ${
                    i === 4
                      ? 'bg-rose-500 text-white font-mono text-xs shadow-lg'
                      : 'bg-rose-500/20 text-rose-300 text-[10px]'
                  }`}
                >
                  {i === 4 ? 'OLAP' : `D${i}`}
                </div>
              ))}
            </div>
          </div>
          <p className="mt-4 text-xs font-mono text-slate-400">
            Multidimensional OLAP Data Architecture
          </p>
        </div>
      )}

      {/* Floating Interactive OLAP HUD Overlay */}
      <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 max-w-sm pointer-events-auto">
        <div className="glass-panel p-3.5 rounded-xl shadow-xl transition-all border border-slate-700/40 dark:border-rose-950/40">
          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-700/20">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive 3D OLAP Cube</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              Rotate & Click
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 truncate">
              {selectedCellInfo.coord}
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white">
              <span>{selectedCellInfo.dimension}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                {selectedCellInfo.metric}
              </span>
            </div>
          </div>

          {/* Quick Dimension Selector */}
          <div className="mt-2.5 pt-2 border-t border-slate-700/20 flex items-center gap-1.5">
            {dimensions.map(dim => {
              const Icon = dim.icon;
              const isActive = activeDimension === dim.id;
              return (
                <button
                  key={dim.id}
                  onClick={() => {
                    setActiveDimension(dim.id);
                    setSelectedCellInfo({
                      coord: `OLAP [Dim: ${dim.id}]`,
                      metric: 'Aggregated & Sliced',
                      dimension: dim.label
                    });
                  }}
                  className={`flex items-center gap-1 px-2 py-1 text-[10px] rounded-md transition-all ${
                    isActive
                      ? 'bg-rose-600 dark:bg-rose-500 text-white font-medium shadow-sm'
                      : 'bg-slate-200/50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{dim.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
