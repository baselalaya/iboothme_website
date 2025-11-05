import * as THREE from 'three';
import React, { useRef, useEffect } from 'react';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

// Infinity symbol curve (lemniscate-like)
class InfinityCurve extends THREE.Curve<THREE.Vector3> {
  scale: number;
  constructor(scale = 8) {
    super();
    this.scale = scale;
  }
  getPoint(t: number) {
    const angle = t * Math.PI * 2;
    const denom = 1 + Math.cos(angle) * Math.cos(angle);
    const x = (this.scale * Math.sin(angle)) / denom;
    const y = (this.scale * Math.sin(angle) * Math.cos(angle)) / denom;
    return new THREE.Vector3(x, y, 0);
  }
}

export default function ThreeDShape() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width <= 768 || window.matchMedia('(pointer:coarse)').matches;

    const getResponsiveConfig = (w: number) => {
      if (w <= 420) return { scale: 0.58, baseZ: 25, dolly: 4.5 };
      if (w <= 640) return { scale: 0.62, baseZ: 24.5, dolly: 4.7 };
      if (w <= 980) return { scale: 0.7, baseZ: 23.5, dolly: 5.2 };
      if (w <= 1440) return { scale: 0.98, baseZ: 22.3, dolly: 5.8 };
      if (w <= 1920) return { scale: 1.12, baseZ: 21.6, dolly: 6.1 }; 
      return { scale: 1.28, baseZ: 20.6, dolly: 6.5 };
    };
    let responsiveConfig = getResponsiveConfig(width);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(isMobile ? 60 : 55, width / height, 0.1, 1000);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: isMobile ? 'low-power' : 'high-performance' });
    renderer.setSize(width, height);
    // Adaptive pixel ratio: balance clarity and performance
    const dpr = window.devicePixelRatio || 1;
    // Heuristic: lower cap on mobile/low-power, higher on desktop
    const maxCap = isMobile ? 2 : 3;
    // If GPU is likely weak (coarse pointer or low-power preference), be conservative
    const perfCap = (navigator as any).hardwareConcurrency && (navigator as any).hardwareConcurrency < 6 ? Math.min(maxCap, 2) : maxCap;
    renderer.setPixelRatio(Math.min(dpr, perfCap));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Postprocessing (Bloom)
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    // Reintroduce a very faint bloom for depth without visible blur
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.25, 0.6, 0.95);
    bloomPass.threshold = 0.92; // only brightest points
    bloomPass.strength = isMobile ? 0.025 : 0.045; // very low glow
    bloomPass.radius = isMobile ? 0.06 : 0.09; // small radius
    // Keep subtle to avoid softness
    composer.addPass(bloomPass);

    // Configurable look
    const DENSITY = isMobile ? 0.45 : 0.8; // density scale (lower on mobile for performance)
    const POINT_SIZE = isMobile ? 1.6 : 2.0; // slightly larger points for sharper appearance
    const COLOR_A = new THREE.Color('#7042d2');
    const COLOR_B = new THREE.Color('#7042d2');

    // Futuristic nebula backdrop (procedural shader plane)
    const nebulaGeom = new THREE.PlaneGeometry(2, 2);
    const nebulaMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uColor1: { value: new THREE.Color('#FFD9D1') },
        uColor2: { value: new THREE.Color('#7042d2') },
        uAccentA: { value: COLOR_A.clone().multiplyScalar(0.6) },
        uAccentB: { value: COLOR_B.clone().multiplyScalar(0.6) },
        uPointer: { value: new THREE.Vector2(-10, -10) },
        uPointerStrength: { value: 0.0 },
        uPulse: { value: 0.0 },
        uPanSpeed: { value: new THREE.Vector2(0.006, 0.004) },
        uSpotStrength: { value: 0.2 },
        uSpotWidth: { value: 0.6 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: `
        varying vec2 vUv; uniform float uTime; uniform vec2 uResolution;
        uniform vec3 uColor1, uColor2, uAccentA, uAccentB; 
        uniform vec2 uPointer; uniform float uPointerStrength; uniform float uPulse;
        uniform vec2 uPanSpeed; uniform float uSpotStrength; uniform float uSpotWidth;
        vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
        vec2 mod289(vec2 x){ return x - floor(x*(1.0/289.0))*289.0; }
        vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
        float snoise(vec2 v){
          const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
          vec2 i = floor(v + dot(v, C.yy)); vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
          vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1; i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m; m = m*m; vec3 x = 2.0*fract(p* C.www) - 1.0; vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5); vec3 a0 = x - ox; m *= 1.7928429 - 0.8537347*(a0*a0 + h*h);
          vec3 g; g.x = a0.x*x0.x + h.x*x0.y; g.yz = a0.yz*x12.xz + h.yz*x12.yw; return 130.0*dot(m,g);
        }
        float fbm(vec2 p){ float v=0.0; float a=0.5; for(int i=0;i<5;i++){ v += a*snoise(p); p*=2.02; a*=0.5; } return v; }
        void main(){
          vec2 uv = vUv;
          // slow pan
          uv += uPanSpeed * uTime;
          // subtle pointer warp
          float pd = distance(uv, uPointer);
          float warp = uPointerStrength * smoothstep(0.4, 0.0, pd) * 0.02;
          uv += normalize(uv - uPointer) * warp;
          float vig = smoothstep(0.95, 0.25, length(uv-0.5));
          vec3 base = mix(uColor1, uColor2, uv.y);
          float n = fbm(uv*3.0 + vec2(uTime*0.02, uTime*0.015));
          float m = fbm(uv*6.0 - vec2(uTime*0.01, uTime*0.02));
          float cloud = clamp(n*0.6 + m*0.4, 0.0, 1.0);
          vec3 accent = mix(uAccentA, uAccentB, uv.x + 0.1*sin(uTime*0.1));
          vec3 color = base + accent * cloud * 0.45;
          // pointer glow + click ripple
          float glow = uPointerStrength * smoothstep(0.35, 0.0, pd);
          float ring = uPulse * smoothstep(0.02, 0.0, abs(pd - (0.15 + 0.1*sin(uTime*0.8))));
          color += (accent * 0.6 + vec3(0.1,0.15,0.25)) * (glow * 0.35 + ring * 0.25);
          // studio spotlight sweep (ellipse path)
          vec2 spotCenter = vec2(0.5 + 0.35 * cos(uTime * 0.08), 0.5 + 0.25 * sin(uTime * 0.08));
          float sd = distance(vUv, spotCenter);
          float spot = smoothstep(uSpotWidth, 0.0, sd) * uSpotStrength;
          color += vec3(0.12, 0.12, 0.14) * spot;
          color *= vig;
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      depthWrite: false,
      depthTest: false,
    });
    // Background removed for clarity

    // Galaxy particle infinity symbol
    const group = new THREE.Group();
    // Responsive vertical offset to avoid overlapping hero content on laptops
    const getGroupOffsetY = (w: number) => {
      if (w >= 980 && w <= 1600) return 1.35; // laptop range: tiny bit more up
      if (w < 980) return 0.75;               // tablets/phones: tiny bit more up
      return 0.45;                             // large desktops: slight extra lift
    };
    group.position.y = getGroupOffsetY(window.innerWidth);
    scene.add(group);

    const baseParticles = (window.devicePixelRatio || 1) > 1.2 ? 2600 : 2000;
    const particleCount = Math.floor(baseParticles * DENSITY);
    const aU = new Float32Array(particleCount);      // parameter along curve [0, 2PI)
    const aTheta = new Float32Array(particleCount);  // angle around tube
    const aRadius = new Float32Array(particleCount); // tube radius jitter
    const aSeed = new Float32Array(particleCount);   // per-point seed
    const aMix = new Float32Array(particleCount);    // color mix factor
    for (let i = 0; i < particleCount; i++) {
      aU[i] = Math.random() * Math.PI * 2;
      aTheta[i] = Math.random() * Math.PI * 2;
      aRadius[i] = 0.18 + Math.random() * 0.35;
      aSeed[i] = Math.random() * 6.28318;
      aMix[i] = Math.random();
    }

    const pGeom = new THREE.BufferGeometry();
    // Dummy positions; computed in shader from attributes
    const positions = new Float32Array(particleCount * 3);
    pGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeom.setAttribute('aU', new THREE.BufferAttribute(aU, 1));
    pGeom.setAttribute('aTheta', new THREE.BufferAttribute(aTheta, 1));
    pGeom.setAttribute('aRadius', new THREE.BufferAttribute(aRadius, 1));
    pGeom.setAttribute('aSeed', new THREE.BufferAttribute(aSeed, 1));
    pGeom.setAttribute('aMix', new THREE.BufferAttribute(aMix, 1));
    // Intro origin positions (explode -> assemble)
    const aOrigin = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // random sphere
      const r = 8 + Math.random() * 8;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      aOrigin[i3] = r * Math.sin(ph) * Math.cos(th);
      aOrigin[i3 + 1] = r * Math.sin(ph) * Math.sin(th);
      aOrigin[i3 + 2] = r * Math.cos(ph);
    }
    pGeom.setAttribute('aOrigin', new THREE.BufferAttribute(aOrigin, 3));

    const pMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 6.0 },
        uSpeed: { value: 0.25 },
        uSize: { value: POINT_SIZE },
        uColorA: { value: COLOR_A },
        uColorB: { value: COLOR_B },
        uIntro: { value: 0.0 },
        uAssemble: { value: 0.0 },
        uPointer: { value: new THREE.Vector3(9999, 9999, 0) },
        uPointerStrength: { value: 0.0 },
        uPulse: { value: 0.0 },
        uMaskCenter: { value: new THREE.Vector2(0.5, 0.5) },
        uMaskRadius: { value: 0.28 },
      },
      vertexShader: `
        attribute float aU;  // base parameter along infinity curve
        attribute float aTheta; // angular offset around tube
        attribute float aRadius; // tube radius
        attribute float aSeed; // noise seed
        attribute float aMix;  // color mix
        attribute vec3 aOrigin; // intro origin
        uniform float uTime; 
        uniform float uScale;
        uniform float uSpeed;
        uniform float uSize;
        uniform float uIntro;
        uniform float uAssemble;
        uniform vec3 uPointer;
        uniform float uPointerStrength;
        uniform float uPulse;
        varying float vMix;
        varying float vAlpha;
        varying float vBoost;
        varying vec2 vNDC;
        
        vec3 infinityPos(float u, float s){
          float c = cos(u);
          float si = sin(u);
          float denom = 1.0 + c*c;
          float x = (s * si) / denom;
          float y = (s * si * c) / denom;
          return vec3(x, y, 0.0);
        }

        void main(){
          float u = aU + uTime * uSpeed; // flow along the curve
          // base point and tangent for frame
          float eps = 0.01;
          vec3 p0 = infinityPos(u, uScale);
          vec3 p1 = infinityPos(u + eps, uScale);
          vec3 T = normalize(p1 - p0);
          vec3 B = normalize(cross(T, vec3(0.0,0.0,1.0)));
          vec3 N = normalize(cross(B, T));

          // small radial pulse and noise drift
          float pulse = 0.85 + 0.15 * sin(uTime * 1.5 + aSeed);
          float r = aRadius * pulse;
          float th = aTheta + uTime * (0.3 + 0.2 * sin(aSeed));
          vec3 offset = (N * cos(th) + B * sin(th)) * r;
          vec3 target = p0 + offset;
          // assemble from origin
          float assemble = smoothstep(0.0, 1.0, uAssemble);
          vec3 pos = mix(aOrigin, target, assemble);

          // mild depth drift
          pos.z += 0.2 * sin(uTime * 0.8 + aSeed);

          vMix = aMix;
          // size attenuation + pointer interaction in world space
          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          float d = distance(worldPos.xyz, uPointer);
          float influence = smoothstep(2.5, 0.0, d); // near pointer -> 1
          float boost = uPointerStrength * influence * (1.0 + uPulse * 1.5);
          vec4 mv = viewMatrix * worldPos;
          float introSize = mix(0.4, 1.0, smoothstep(0.0, 1.0, uIntro));
          gl_PointSize = uSize * (300.0 / -mv.z) * (1.0 + 0.5 * boost) * introSize;
          vAlpha = 0.8 * pow(clamp(uIntro, 0.0, 1.0), 1.2) * assemble;
          vBoost = boost;
          vec4 clip = projectionMatrix * mv;
          vNDC = (clip.xy / clip.w) * 0.5 + 0.5;
          gl_Position = clip;
        }
      `,
      fragmentShader: `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform float uIntro;
        uniform vec2 uMaskCenter;
        uniform float uMaskRadius;
        varying float vMix;
        varying float vAlpha;
        varying float vBoost;
        varying vec2 vNDC;
        void main(){
          vec2 d = gl_PointCoord - vec2(0.5);
          float dist = length(d);
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, dist) * vAlpha * (0.40 + vBoost * 0.25) * smoothstep(0.0, 1.0, uIntro);
          // central UI-safe hole to avoid overlapping hero text/CTAs
          float ndcDist = distance(vNDC, uMaskCenter);
          float hole = smoothstep(0.0, uMaskRadius, ndcDist);
          alpha *= hole;
          vec3 color = mix(uColorA, uColorB, clamp(vMix + vBoost * 0.15, 0.0, 1.0));
          // slight center emphasis for perceived sharpness
          float core = smoothstep(0.5, 0.0, dist);
          color += 0.04 * core;
          gl_FragColor = vec4(color, alpha);
        }
      `,
    });

    const particles = new THREE.Points(pGeom, pMat);
    group.add(particles);
    // No solid mesh; particles-only visual

    // 3D-attached headline rendered as a shader-driven plane (cinematic)
    const makeHeadlineTexture = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const baseW = 2048, baseH = 640;
      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(baseW * dpr);
      canvas.height = Math.floor(baseH * dpr);
      const ctx = canvas.getContext('2d')!;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, baseW, baseH);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Gradient brand palette
      const grad = ctx.createLinearGradient(0, 0, baseW, 0);
      grad.addColorStop(0.0, '#A78BFA');
      grad.addColorStop(0.5, '#7042d2');
      grad.addColorStop(1.0, '#FDE68A');
      const centerX = baseW / 2;
      // Lines and sizes
      const line1 = 'Get your';
      const line2 = 'BRAND';
      const line3 = 'Noticed';
      // Utility: draw with tracking
      const drawTextWithTracking = (
        text: string,
        x: number,
        y: number,
        letterSpacing: number,
        mode: 'fill' | 'stroke' | 'both' = 'fill'
      ) => {
        // Center by computing total width with spacing
        let total = 0;
        for (let i = 0; i < text.length; i++) {
          total += ctx.measureText(text[i]).width;
          if (i < text.length - 1) total += letterSpacing;
        }
        let curX = x - total / 2;
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (mode === 'fill' || mode === 'both') ctx.fillText(ch, curX + ctx.measureText(ch).width / 2, y);
          if (mode === 'stroke' || mode === 'both') ctx.strokeText(ch, curX + ctx.measureText(ch).width / 2, y);
          curX += ctx.measureText(ch).width + (i < text.length - 1 ? letterSpacing : 0);
        }
      };
      // Top line (small caps) — stronger contrast with outline + glow
      ctx.font = '800 184px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif';
      // dark outline pass
      ctx.lineWidth = 12;
      ctx.strokeStyle = 'rgba(0,0,0,0.65)';
      drawTextWithTracking(line1, centerX, baseH / 2 - 170, 6, 'stroke');
      // subtle brand glow
      ctx.shadowColor = 'rgba(112,66,210,0.5)';
      ctx.shadowBlur = 10;
      // bright fill
      ctx.fillStyle = 'rgba(255,255,255,0.99)';
      drawTextWithTracking(line1, centerX, baseH / 2 - 170, 6, 'fill');
      // Middle line with gradient fill + stroke accent
      ctx.font = '1000 310px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif';
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;
      // Outer white stroke
      ctx.lineWidth = 16;
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      drawTextWithTracking(line2, centerX, baseH / 2 + 0, 14, 'stroke');
      // Inner brand stroke
      ctx.lineWidth = 7;
      ctx.strokeStyle = '#7042d2';
      drawTextWithTracking(line2, centerX, baseH / 2 + 0, 14, 'stroke');
      ctx.fillStyle = grad;
      drawTextWithTracking(line2, centerX, baseH / 2 + 0, 14, 'fill');
      // Removed underline per request
      // Bottom line — match contrast treatment
      ctx.font = '800 184px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif';
      ctx.lineWidth = 12;
      ctx.strokeStyle = 'rgba(0,0,0,0.65)';
      drawTextWithTracking(line3, centerX, baseH / 2 + 230, 6, 'stroke');
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 24;
      ctx.fillStyle = 'rgba(255,255,255,0.99)';
      drawTextWithTracking(line3, centerX, baseH / 2 + 230, 6, 'fill');
      // Build texture
      const tex = new THREE.CanvasTexture(canvas);
      tex.anisotropy = Math.min(16, (renderer.capabilities as any).getMaxAnisotropy?.() || 1);
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
      return tex;
    };
    const headlineTex = makeHeadlineTexture();
    const aspect = (headlineTex.image as HTMLCanvasElement).width / (headlineTex.image as HTMLCanvasElement).height;
    const desiredWidth = 10.5;
    const headlineGeom = new THREE.PlaneGeometry(desiredWidth, desiredWidth / aspect);
    const headlineMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uMap: { value: headlineTex },
        uTime: { value: 0 },
        uIntro: { value: 0 },
        uShineSpeed: { value: 0.18 },
        uVignette: { value: 0.35 },
        uNoiseScale: { value: new THREE.Vector2(3.5, 2.0) },
        uNoiseSpeed: { value: 0.4 },
        uNoiseThreshold: { value: 0.35 },
        uBend: { value: 0.6 },
        uTexSize: { value: new THREE.Vector2((headlineTex.image as HTMLCanvasElement).width, (headlineTex.image as HTMLCanvasElement).height) },
      },
      vertexShader: `
        uniform float uTime; uniform float uIntro; uniform float uBend;
        varying vec2 vUv;
        void main(){
          vUv = uv;
          // subtle perspective wobble
          vec3 pos = position;
          pos.y += 0.02 * sin(uTime * 0.8 + pos.x * 2.0);
          pos.x += 0.015 * cos(uTime * 0.9 + pos.y * 3.0);
          // intro tilt
          float tilt = (1.0 - uIntro) * 0.25;
          pos.yz = mat2(cos(tilt), -sin(tilt), sin(tilt), cos(tilt)) * pos.yz;
          // gentle 3D bend across X (curvature towards camera)
          float theta = (pos.x) * uBend; // radians across width
          pos.z += sin(theta) * 0.25;
          pos.y += (1.0 - cos(theta)) * 0.05;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uMap; uniform float uTime; uniform float uIntro; uniform float uShineSpeed; uniform float uVignette;
        uniform vec2 uNoiseScale; uniform float uNoiseSpeed; uniform float uNoiseThreshold; uniform vec2 uTexSize;
        varying vec2 vUv;
        // simple hash-based noise
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
        float noise(in vec2 p){
          vec2 i = floor(p);
          vec2 f = fract(p);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          vec2 u = f*f*(3.0-2.0*f);
          return mix(a, b, u.x) + (c - a)*u.y*(1.0 - u.x) + (d - b)*u.x*u.y;
        }
        float fbm(vec2 p){
          float v = 0.0;
          float a = 0.5;
          for(int i=0;i<5;i++){
            v += a * noise(p);
            p *= 2.02;
            a *= 0.5;
          }
          return v;
        }
        void main(){
          vec4 tex = texture2D(uMap, vUv);
          // procedural noise reveal mask
          float n = fbm(vUv * uNoiseScale + vec2(uTime * uNoiseSpeed));
          float reveal = smoothstep(uNoiseThreshold, 1.0, n + uIntro * 0.9);
          float alpha = tex.a * reveal;
          if (alpha < 0.01) discard;
          vec3 col = tex.rgb;
          // moving shine
          float shineX = 0.2 + 0.6 * fract(uTime * uShineSpeed);
          float shine = smoothstep(0.15, 0.0, abs(vUv.x - shineX)) * 0.35;
          // vignette across the plane
          float d = distance(vUv, vec2(0.5));
          float vig = 1.0 - smoothstep(uVignette, 0.75, d);
          float flicker = 0.97 + 0.03 * abs(sin(uTime * 3.2));
          vec3 outCol = col * (0.85 + 0.15 * vig) + vec3(1.0) * shine;
          gl_FragColor = vec4(outCol * flicker, alpha);
        }
      `,
    });
    const headline = new THREE.Mesh(headlineGeom, headlineMat);
    // Center the headline with the group
    headline.position.set(0, 0.0, 0.8);
    group.add(headline);
    // soft additive glow plane behind text
    const glowMat = new THREE.MeshBasicMaterial({ map: headlineTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.18, color: 0xffffff });
    const glow = new THREE.Mesh(headlineGeom.clone(), glowMat);
    glow.position.copy(headline.position);
    glow.scale.set(1.12, 1.12, 1);
    group.add(glow);

    // Lighting
    const hemi = new THREE.HemisphereLight(0x6f35ff, 0x1a0a2a, 0.8);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0x7042d2, 0.8);
    dir.position.set(-5, 8, 10);
    scene.add(dir);

    // Animation
    let raf = 0;
    let startMs: number | null = null;
    let running = true;
    let lastRender = 0;
    const animate = (t: number) => {
      if (startMs === null) startMs = t;
      const elapsedMs = t - startMs;
      if (!running || (t - lastRender < 20)) { raf = requestAnimationFrame(animate); return; }
      lastRender = t;
      const time = t * 0.001;
      const introDur = 3000.0; // ms
      const rawIntro = Math.min(1, Math.max(0, elapsedMs / introDur));
      // easeOutCubic
      const intro = 1.0 - Math.pow(1.0 - rawIntro, 3.0);
      // assemble curve (easeInOut for nicer build)
      const assemble = rawIntro < 0.5
        ? 2.0 * rawIntro * rawIntro
        : -1.0 + (4.0 - 2.0 * rawIntro) * rawIntro;
      // Subtle hover for the particle infinity
      group.rotation.x = Math.sin(time * 0.14) * 0.025;
      group.rotation.y = Math.cos(time * 0.12) * 0.025;
      const baseScale = 0.86 + 0.14 * intro; // dolly-in scaling
      const scalePulse = baseScale * (1 + Math.sin(time * 0.7) * 0.01);
      const scaleFactor = responsiveConfig.scale;
      group.scale.set(scalePulse * scaleFactor, scalePulse * scaleFactor, scalePulse * scaleFactor);
      // keep responsive vertical offset each frame
      group.position.y = getGroupOffsetY(window.innerWidth);
      (pMat.uniforms.uTime as any).value = time;
      // update headline uniforms
      (headline.material as THREE.ShaderMaterial).uniforms.uTime.value = time;
      (headline.material as THREE.ShaderMaterial).uniforms.uIntro.value = intro;
      glow.material.opacity = 0.1 * intro;
      (pMat.uniforms.uIntro as any).value = intro;
      (pMat.uniforms.uAssemble as any).value = assemble;
      // ramp speed from slow to normal during intro
      const baseSpeed = isMobile ? 0.06 : 0.08;
      const speedRange = isMobile ? 0.12 : 0.17;
      (pMat.uniforms.uSpeed as any).value = baseSpeed + speedRange * intro;
      // camera dolly-in
      camera.position.z = responsiveConfig.baseZ - responsiveConfig.dolly * intro;
      camera.lookAt(0, 0, 0);
      // bloom ramp down
      (bloomPass as any).strength = (isMobile ? 0.22 : 0.5) - (isMobile ? 0.14 : 0.3) * intro; // soften bloom for mobile
      // kick a gentle pulse mid-intro
      if (rawIntro > 0.55 && rawIntro < 0.58) {
        (pMat.uniforms.uPulse as any).value = 0.8;
      }
      // adjust UI-safe hole center for typical hero positioning (slightly above center)
      (pMat.uniforms.uMaskCenter as any).value.set(0.5, 0.46);
      // decay click pulse
      const curPulse = ((pMat.uniforms as any).uPulse ? (pMat.uniforms.uPulse.value as number) : 0);
      if (curPulse > 0.001) {
        (pMat.uniforms.uPulse as any).value = curPulse * 0.93;
      }
      // no background pulse
      
      composer.render();
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      // Re-evaluate DPR on resize (e.g., zoom changes)
      const ndpr = window.devicePixelRatio || 1;
      const nCap = w <= 768 ? 2 : perfCap;
      renderer.setPixelRatio(Math.min(ndpr, nCap));
      composer.setSize(w, h);
      // keep responsive vertical offset on resize
      group.position.y = getGroupOffsetY(w);
      responsiveConfig = getResponsiveConfig(w);
    };
    window.addEventListener('resize', handleResize);

    // Pause when tab hidden or scrolled far away (saves CPU/GPU)
    // 'running' and 'lastRender' are declared above in animate section
    const onVisibility = () => { running = document.visibilityState === 'visible'; };
    document.addEventListener('visibilitychange', onVisibility);
    const onScroll = () => {
      const nearTop = window.scrollY < window.innerHeight * 1.5;
      running = document.visibilityState === 'visible' && nearTop;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Cinematic parallax + interactive pointer influence
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // world z=0 plane
    const pointerNDC = new THREE.Vector2();
    const hit = new THREE.Vector3();
    const enablePointer = !isMobile && window.matchMedia('(pointer:fine)').matches;
    let onPointerMove: ((e: MouseEvent) => void) | null = null;
    let onPointerLeave: (() => void) | null = null;
    let onClick: (() => void) | null = null;
    if (enablePointer) {
      onPointerMove = (e: MouseEvent) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = -(e.clientY / window.innerHeight) * 2 + 1; // fix Y inversion (top = +1)
        camera.position.x = nx * 1.0;
        camera.position.y = -ny * 0.6;
        camera.lookAt(0, 0, 0);
        pointerNDC.set(nx, ny);
        raycaster.setFromCamera(pointerNDC, camera);
        if (raycaster.ray.intersectPlane(plane, hit)) {
          (pMat.uniforms.uPointer as any).value.copy(hit);
          (pMat.uniforms.uPointerStrength as any).value = 0.9;
        }
      };
      onPointerLeave = () => {
        (pMat.uniforms.uPointerStrength as any).value = 0.0;
      };
      onClick = () => {
        (pMat.uniforms.uPulse as any).value = 1.0;
      };
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerleave', onPointerLeave);
      window.addEventListener('click', onClick);
    }

    // No scroll-based morph

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // particles-only cleanup
      if (enablePointer) {
        onPointerMove && window.removeEventListener('pointermove', onPointerMove);
        onPointerLeave && window.removeEventListener('pointerleave', onPointerLeave);
        onClick && window.removeEventListener('click', onClick);
      }
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('scroll', onScroll);
      // renderer/composer cleanup is sufficient; loaded geometries will be GC'd when group removed
      headlineGeom.dispose();
      headlineTex.dispose();
      (headline.material as THREE.ShaderMaterial).dispose();
      glow.geometry.dispose();
      glowMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
