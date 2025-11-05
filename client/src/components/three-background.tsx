import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

interface ThreeBackgroundProps {
  className?: string;
  introOpacity?: number;
  cinematicPhase?: 'blackout' | 'particles' | 'buildup' | 'climax' | 'transition' | 'content';
  targetShape?: 'infinity' | 'questionMark';
  morphProgress?: number;
}

export default function ThreeBackground({ 
  className, 
  introOpacity = 1, 
  cinematicPhase = 'content',
  targetShape = 'infinity',
  morphProgress = 0
}: ThreeBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const sceneRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    particles: THREE.Points | null;
    animationId: number | null;
    composer: EffectComposer | null;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    particles: null,
    animationId: null,
    composer: null
  });

  const [smoothMorphProgress, setSmoothMorphProgress] = useState(0);
  useEffect(() => {
    let animationFrameId: number;
    let morphStartTime: number | null = null;
    const morphDuration = 1500;

    const animateMorph = (time: number) => {
      if (!morphStartTime) morphStartTime = time;
      const elapsed = time - morphStartTime;
      const easedProgress = Math.min(elapsed / morphDuration, 1);
      setSmoothMorphProgress(easedProgress * morphProgress);
      if (elapsed < morphDuration) {
        animationFrameId = requestAnimationFrame(animateMorph);
      }
    };

    animationFrameId = requestAnimationFrame(animateMorph);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [morphProgress]);
  useEffect(() => {
    if (!mountRef.current || prefersReducedMotion) {
      const container = mountRef.current;
      if (!container) return;
      const particleCount = 100;
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-1 h-1 rounded-full opacity-40';
        particle.style.background = '#FFFFFF';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        container.appendChild(particle);
      }
      return () => {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      };
    }

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const dpr = Math.min(window.devicePixelRatio, 2);
    const baseParticleCount = isMobile ? 3000 : 6000;
    const particleCount = Math.floor(baseParticleCount / dpr);

    const container = mountRef.current;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.2,
      0.4,
      0.85
    );
    bloomPass.threshold = 0.3;
    bloomPass.strength = 1.0;
    bloomPass.radius = 1.2;
    composer.addPass(bloomPass);

    sceneRef.current.composer = composer;

    // Geometry setup
    const positions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);

    const scale = 14;
    const thickness = 3;
    const randomness = 0.4;
    const randomnessPower = 1.5;

    const colorInside = new THREE.Color('#FFFFFF').multiplyScalar(0.3);
    const colorOutside = new THREE.Color('#FFFFFF').multiplyScalar(0.15);

    const generateInfinityPositions = (positions: Float32Array) => {
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const t = (i / particleCount) * Math.PI * 4;
        const denominator = 1 + Math.sin(t) * Math.sin(t);
        let x = scale * Math.cos(t) / denominator;
        let y = scale * Math.sin(t) * Math.cos(t) / denominator;
        let z = (Math.random() - 0.5) * thickness;
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
      }
    };

    const generateQuestionMarkPositions = (positions: Float32Array) => {
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const t = (i / particleCount) * Math.PI * 2;
        if (i < particleCount * 0.6) {
          const angle = t * 1.8;
          const radius = scale * 0.8 * (1 - t / (Math.PI * 1.2));
          positions[i3] = Math.cos(angle) * radius - scale * 0.2;
          positions[i3 + 1] = Math.sin(angle) * radius + scale * 0.5;
          positions[i3 + 2] = (Math.random() - 0.5) * thickness;
        } else if (i < particleCount * 0.8) {
          const stemProgress = (i - particleCount * 0.6) / (particleCount * 0.2);
          positions[i3] = -scale * 0.1;
          positions[i3 + 1] = scale * 0.2 - stemProgress * scale * 0.8;
          positions[i3 + 2] = (Math.random() - 0.5) * thickness;
        } else {
          const dotAngle = Math.random() * Math.PI * 2;
          const dotRadius = Math.random() * scale * 0.25;
          positions[i3] = Math.cos(dotAngle) * dotRadius - scale * 0.1;
          positions[i3 + 1] = Math.sin(dotAngle) * dotRadius - scale * 0.8;
          positions[i3 + 2] = (Math.random() - 0.5) * thickness;
        }
      }
    };

    generateInfinityPositions(positions);
    if (targetShape === 'questionMark') {
      generateQuestionMarkPositions(targetPositions);
    } else {
      generateInfinityPositions(targetPositions);
    }

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const normalizedPos = i / particleCount;
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, normalizedPos);
      const speed = 0.5 + Math.random() * 1.5;
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = speed;
      sizes[i] = Math.random() * 1.2 + 0.3;
    }
    for (let i = 0; i < particleCount; i++) {
      phases[i] = Math.random() * 6.28318;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('targetPosition', new THREE.BufferAttribute(targetPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

    const material = new THREE.ShaderMaterial({
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      vertexShader: `
        uniform float uTime;
        uniform float uIntroOpacity;
        uniform float uCinematicIntensity;
        uniform float uMorphProgress;
        attribute float size;
        attribute float phase;
        attribute vec3 targetPosition;
        varying vec3 vColor;
        varying float vIntensity;
        void main() {
          float particleSpeed = color.b;
          float particlePhase = phase;
          float curvePosition = atan(position.y, position.x);
          float cinematicMultiplier = uCinematicIntensity;
          float dynamicTime = uTime * particleSpeed * cinematicMultiplier;
          float flowSpeed = dynamicTime * 1.2 + particlePhase;
          float flow = sin(curvePosition + flowSpeed) * 0.2;
          float intensity = uCinematicIntensity;
          float wave1 = sin(dynamicTime * 2.5 + position.x * 0.6 + particlePhase) * intensity;
          float wave2 = cos(dynamicTime * 1.8 + length(position.xy) * 0.25 + particlePhase * 0.5) * intensity;
          float wave3 = sin(dynamicTime * 4.1 + curvePosition * 3.0 + particlePhase * 2.0) * intensity;
          float wave4 = cos(dynamicTime * 0.9 + position.x * 0.3 + particlePhase * 1.5) * intensity;
          float wave5 = sin(dynamicTime * 3.7 + position.y * 0.5 + particlePhase * 0.8) * intensity;
          float drift = sin(dynamicTime * 0.6 + particlePhase) * 0.15;
          float momentum = cos(dynamicTime * 1.4 + particlePhase * 1.2) * 0.1;
          float breathe = 1.0 + sin(dynamicTime * 0.7 + particlePhase * 0.3) * 0.15;
          float cluster = sin(curvePosition * 4.0 + dynamicTime * 1.6) * 0.1;
          float complexity = (wave1 + wave2 + wave3 + wave4 + wave5) / 5.0;
          float individualPulse = 0.3 + 0.7 * abs(complexity);
          float spiral = sin(dynamicTime * 2.0 + curvePosition * 2.0 + particlePhase) * 0.25;
          float orbit = cos(dynamicTime * 3.5 + particlePhase * 2.0) * 0.15;
          vec3 basePosition = mix(position, targetPosition, uMorphProgress);
          vec3 animatedPosition = basePosition;
          animatedPosition.x += flow + drift + spiral + cluster;
          animatedPosition.y += momentum + orbit + sin(dynamicTime + curvePosition * 2.0 + particlePhase) * 0.2;
          animatedPosition.z += cos(dynamicTime * 2.2 + particlePhase) * 0.1;
          animatedPosition *= breathe * (0.9 + particleSpeed * 0.2);
          vColor = vec3(color.r, color.g, color.r);
          vIntensity = individualPulse;
          vec4 mvPosition = modelViewMatrix * vec4(animatedPosition, 1.0);
          float cinematicScale = 1.0 + (uCinematicIntensity - 1.0) * 0.5;
          float dynamicSize = size * (300.0 / -mvPosition.z) * individualPulse * cinematicScale;
          dynamicSize *= (1.0 + wave3 * 0.5 + sin(dynamicTime * 4.0 + particlePhase) * 0.3 * intensity);
          gl_PointSize = dynamicSize;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uIntroOpacity;
        varying vec3 vColor;
        varying float vIntensity;
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float distanceToCenter = length(center);
          if (distanceToCenter > 0.5) discard;
          float alpha = smoothstep(0.5, 0.1, distanceToCenter);
          float sparkle = 1.0 + sin(distanceToCenter * 20.0) * 0.1;
          float finalAlpha = alpha * vIntensity * sparkle * 0.4;
          finalAlpha *= uIntroOpacity;
          gl_FragColor = vec4(vColor, finalAlpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uIntroOpacity: { value: introOpacity },
        uCinematicIntensity: { value: cinematicPhase === 'climax' ? 2.0 : 1.0 },
        uMorphProgress: { value: smoothMorphProgress }
      }
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const updateTargetPositions = (shape: 'infinity' | 'questionMark') => {
      if (shape === 'questionMark') {
        generateQuestionMarkPositions(targetPositions);
      } else {
        generateInfinityPositions(targetPositions);
      }
      geometry.getAttribute('targetPosition').needsUpdate = true;
    };

    (particles as any).updateTargetPositions = updateTargetPositions;

    sceneRef.current = { scene, camera, renderer, particles, animationId: null, composer };

    const animate = (time: number) => {
      const elapsedTime = time * 0.001;

      camera.position.x = 15 * Math.cos(elapsedTime * 0.1);
      camera.position.z = 15 * Math.sin(elapsedTime * 0.1);
      camera.lookAt(0, 0, 0);

      if (sceneRef.current.particles) {
        const material = sceneRef.current.particles.material as THREE.ShaderMaterial;
        material.uniforms.uTime.value = elapsedTime;
        material.uniforms.uIntroOpacity.value = introOpacity;

        let cinematicIntensity = 1.0;
        switch (cinematicPhase) {
          case 'blackout': cinematicIntensity = 0.0; break;
          case 'particles': cinematicIntensity = 1.2; break;
          case 'buildup': cinematicIntensity = 1.5; break;
          case 'climax': cinematicIntensity = 2.2; break;
          case 'transition': cinematicIntensity = 1.3; break;
          case 'content': cinematicIntensity = 1.0; break;
        }
        material.uniforms.uCinematicIntensity.value = cinematicIntensity;
        material.uniforms.uMorphProgress.value = smoothMorphProgress;
      }

      composer.render();
      sceneRef.current.animationId = requestAnimationFrame(animate);
    };

    sceneRef.current.animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      sceneRef.current = { scene: null, camera: null, renderer: null, particles: null, animationId: null, composer: null };
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (sceneRef.current?.particles && (sceneRef.current.particles as any).updateTargetPositions) {
      (sceneRef.current.particles as any).updateTargetPositions(targetShape);
    }
  }, [targetShape, smoothMorphProgress]);

  return (
    <div 
      ref={mountRef}
      className={
        (className ? className + " " : "") +
        "absolute inset-0 overflow-hidden pointer-events-none"
      }
      data-testid="three-background"
    />
  );
}

