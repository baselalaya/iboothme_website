import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type Props = {
  src: string; // path to .gltf or .glb in /public
  className?: string;
  autoRotate?: boolean;
};

export default function RobotTaliaViewer({ src, className, autoRotate = true }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [rotating, setRotating] = useState(false);
  const [loading, setLoading] = useState(0); // 0..100
  const [clipNames, setClipNames] = useState<string[]>([]);
  const [activeClip, setActiveClip] = useState<string | null>(null);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const rootRef = useRef<THREE.Object3D | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<Record<string, THREE.AnimationAction>>({});
  const defaultFrame = useMemo(() => ({ pos: new THREE.Vector3(2.2, 1.6, 2.8), target: new THREE.Vector3(0, 1.25, 0) }), []);
  const [idle, setIdle] = useState(true);
  // helpers for camera tween
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const v3lerp = (out: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, t: number) => out.set(lerp(a.x,b.x,t), lerp(a.y,b.y,t), lerp(a.z,b.z,t));
  const easeInOutCubic = (t: number) => (t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2);
  let introRAF = 0; let introActive = false;
  const cancelIntro = () => { if (!introActive) return; introActive = false; cancelAnimationFrame(introRAF); };

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 480;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    Object.assign(renderer.domElement.style, { position: "absolute", inset: "0", zIndex: "0", display: "block" } as CSSStyleDeclaration);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.copy(defaultFrame.pos);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    controls.target.copy(defaultFrame.target);
    // Disable zoom by locking distance bounds and turning off zoom
    controls.enableZoom = false;
    controls.minDistance = camera.position.distanceTo(controls.target);
    controls.maxDistance = controls.minDistance;
    controls.enablePan = true;
    controlsRef.current = controls;
    // cancel intro on user input
    const onUserInteract = () => { cancelIntro(); setIdle(false); };
    renderer.domElement.addEventListener('pointerdown', onUserInteract, { passive: true } as any);
    renderer.domElement.addEventListener('wheel', onUserInteract, { passive: true } as any);
    window.addEventListener('keydown', onUserInteract);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x202020, 1.0);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(5, 10, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x8b5cf6, 0.8);
    rim.position.set(-6, 6, -6);
    scene.add(rim);

    let mixer: THREE.AnimationMixer | undefined;

    const loader = new GLTFLoader();
    loader.load(
      src,
      (gltf) => {
        const root = gltf.scene;
        root.traverse((obj: any) => {
          if (obj.isMesh) {
            obj.castShadow = false;
            obj.receiveShadow = false;
          }
        });
        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());
        root.position.sub(center);
        const scale = 3.2 / size;
        root.scale.setScalar(scale);
        scene.add(root);
        rootRef.current = root;

        // cinematic intro
        const startPos = new THREE.Vector3(defaultFrame.target.x + 3.6, defaultFrame.target.y + 1.0, defaultFrame.target.z + 5.2);
        const endPos = defaultFrame.pos.clone();
        const startTarget = new THREE.Vector3(defaultFrame.target.x, defaultFrame.target.y - 0.2, defaultFrame.target.z);
        const endTarget = defaultFrame.target.clone();
        const duration = 2200; const start = performance.now();
        introActive = true;
        camera.position.copy(startPos);
        controls.target.copy(startTarget);
        controls.update();
        const step = (now: number) => {
          if (!introActive) return;
          const t = Math.min(1, (now - start) / duration);
          const k = easeInOutCubic(t);
          v3lerp(camera.position, startPos, endPos, k);
          const tmp = new THREE.Vector3(); v3lerp(tmp, startTarget, endTarget, k); controls.target.copy(tmp);
          const dir = new THREE.Vector3().subVectors(camera.position, controls.target);
          const r = Math.hypot(dir.x, dir.z); const base = Math.atan2(dir.z, dir.x);
          const ang = base + 0.02 * (1 - Math.cos(k * Math.PI));
          camera.position.set(controls.target.x + Math.cos(ang)*r, camera.position.y, controls.target.z + Math.sin(ang)*r);
          controls.update();
          if (t < 1) introRAF = requestAnimationFrame(step); else introActive = false;
        };
        introRAF = requestAnimationFrame(step);

        if (gltf.animations && gltf.animations.length) {
          mixer = new THREE.AnimationMixer(root);
          mixerRef.current = mixer;
          const names: string[] = [];
          gltf.animations.forEach((clip) => {
            const nm = clip.name || `Clip ${names.length + 1}`;
            names.push(nm);
            const action = mixer!.clipAction(clip);
            action.clampWhenFinished = true;
            action.loop = THREE.LoopRepeat;
            actionsRef.current[nm] = action;
          });
          setClipNames(names);
          const first = names[0] ?? null;
          setActiveClip(first);
          if (first) actionsRef.current[first]?.play();
        }
      },
      (ev) => {
        if (ev.total) setLoading(Math.round((ev.loaded / ev.total) * 100));
      },
      (err) => {
        console.error("Failed to load GLTF:", err);
      }
    );

    let raf = 0;
    const clock = new THREE.Clock();
    const render = () => {
      const dt = clock.getDelta();
      if (mixer) {
        mixer.timeScale = speed;
        mixer.update(dt);
      }
      if (idle && !introActive) { try { controls.rotateLeft(0.0004); } catch {} }
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    render();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || height;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener('pointerdown', onUserInteract as any);
      renderer.domElement.removeEventListener('wheel', onUserInteract as any);
      window.removeEventListener('keydown', onUserInteract as any);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [src, rotating, speed, defaultFrame.pos, defaultFrame.target]);

  const handleReset = () => {
    const cam = cameraRef.current;
    const ctr = controlsRef.current;
    if (!cam || !ctr) return;
    cam.position.copy(defaultFrame.pos);
    ctr.target.copy(defaultFrame.target);
    ctr.update();
  };

  const handleToggleRotate = () => {
    const ctr = controlsRef.current;
    if (!ctr) return;
    const next = !rotating;
    setRotating(next);
    ctr.autoRotate = next;
  };

  const handlePlayPause = () => {
    const mixer = mixerRef.current;
    if (!mixer || !activeClip) return;
    const action = actionsRef.current[activeClip];
    if (!action) return;
    if (playing) {
      action.paused = true;
      setPlaying(false);
    } else {
      action.paused = false;
      setPlaying(true);
    }
  };

  const handleChangeClip = (name: string) => {
    const mixer = mixerRef.current;
    if (!mixer) return;
    Object.entries(actionsRef.current).forEach(([n, a]) => {
      if (n === name) return;
      a.fadeOut(0.25);
      a.stop();
    });
    const target = actionsRef.current[name];
    if (target) {
      target.reset();
      target.paused = !playing;
      target.fadeIn(0.25).play();
      setActiveClip(name);
    }
  };

  return (
    <div ref={containerRef} className={`${className ?? "w-full h-[520px] rounded-2xl overflow-hidden bg-transparent"} relative`}>
      {loading > 0 && loading < 100 && (
        <div className="absolute inset-0 grid place-items-center bg-black/40">
          <div className="w-64">
            <div className="text-center text-xs mb-2">Loading {loading}%</div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-white/70" style={{ width: `${loading}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
