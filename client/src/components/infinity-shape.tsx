import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface InfinityShapeProps {
  className?: string;
  shapeFrom?: "infinity" | "questionMark" | "ring" | "galaxy";
  shapeTo?: "infinity" | "questionMark" | "ring" | "galaxy";
  morphProgress?: number;
}

class InfinityCurve extends THREE.Curve<THREE.Vector3> {
  getPoint(t: number) {
    const scale = 2.5;
    const angle = t * Math.PI * 4;
    const denom = 1 + Math.sin(angle) * Math.sin(angle);
    const x = scale * Math.cos(angle) / denom;
    const y = scale * Math.sin(angle) * Math.cos(angle) / denom;
    return new THREE.Vector3(x, y, 0);
  }
}

export default function InfinityShape({ className, morphProgress = 0 }: InfinityShapeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const sceneRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    mesh: THREE.Mesh | null;
    material: THREE.MeshPhysicalMaterial | null;
    animationId: number | null;
  }>({ scene: null, camera: null, renderer: null, mesh: null, material: null, animationId: null });

  useEffect(() => {
    if (!mountRef.current || prefersReducedMotion) {
      return;
    }

    const container = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3)); // increased max DPR from 2 to 3
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.setClearColor(0x000000, 0);
    renderer.physicallyCorrectLights = true; // enable physically correct lighting

    container.appendChild(renderer.domElement);

    const curve = new InfinityCurve();
    // Increased segments and radius for sharper and bolder geometry
    const geometry = new THREE.TubeGeometry(curve, 600, 0.4, 72, true); // radius 0.4 from 0.3, radialSegments 72 from 48

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xe0e0f0,
      metalness: 0.25,
      roughness: 0.2, // increased roughness from 0.1
      transmission: 0.2, // reduced transmission from 0.8 for less blur
      thickness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.2,
      reflectivity: 0.9,
      opacity: 1.0,
      transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    keyLight.position.set(5, 10, 7);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-5, 5, 5);
    scene.add(fillLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    let theta = 0;
    const animate = () => {
      theta += 0.005;
      mesh.rotation.y = theta;
      renderer.render(scene, camera);
      sceneRef.current.animationId = requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [prefersReducedMotion]);

  return <div ref={mountRef} className={`absolute inset-0 w-full h-full ${className ?? ""}`} data-testid="infinity-shape-liquid-glass" />;
}

