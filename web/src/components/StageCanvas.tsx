import {
  OrbitControls,
  ContactShadows,
  Environment,
  Lightformer,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { PALETTES, type FinishId } from "../lib/palettes";

useGLTF.preload("/models/sidekick.glb");

function Model({
  finish,
  onLoaded,
  reduce,
}: {
  finish: FinishId;
  onLoaded: () => void;
  reduce: boolean;
}) {
  const { scene } = useGLTF("/models/sidekick.glb");
  const group = useRef<THREE.Group>(null);
  const started = useRef<number | null>(null);
  const initialFinish = useRef(finish);
  const buckets = useRef<Record<string, THREE.MeshStandardMaterial[]>>({});
  const targets = useRef<
    Record<string, { color?: THREE.Color; emissive?: THREE.Color }>
  >({});

  useEffect(() => {
    const bucket: Record<string, THREE.MeshStandardMaterial[]> = {};
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];
      materials.forEach((material) => {
        if (!(material instanceof THREE.MeshStandardMaterial)) return;
        const isScreen =
          material.name.startsWith("ui_") ||
          material.name === "screen_base" ||
          material.name === "screen_glass";
        object.castShadow = !isScreen;
        object.receiveShadow = !isScreen;
        let dirty = false;
        material.envMapIntensity = 1.05;
        if (
          material.name === "ui_cream" ||
          material.name === "ui_dim" ||
          material.name === "ui_orange"
        ) {
          material.toneMapped = false;
          dirty = true;
        }
        if (material.name === "ui_chip") {
          material.emissiveIntensity = 1.2;
        }
        if (material.name === "screen_glass") {
          material.roughness = 0.24;
          material.metalness = 0.1;
          material.envMapIntensity = 1.0;
        }
        if (dirty) material.needsUpdate = true;

        const list = bucket[material.name] ?? [];
        list.push(material);
        bucket[material.name] = list;
      });
    });
    buckets.current = bucket;

    const palette = PALETTES[initialFinish.current];
    const apply = (name: string, color?: string, emissive?: string) => {
      bucket[name]?.forEach((material) => {
        if (color) material.color.set(color);
        if (emissive) material.emissive.set(emissive);
      });
    };
    apply("bone_PC", palette.shell);
    apply("charcoal_bezel", palette.frame);
    apply("key_cream", palette.keys);
    apply("TE_orange", palette.accent);
    apply("safety_red", palette.power);
    apply("seam", palette.seam);
    apply("grip_dark", palette.grip);
    apply("back_ink", palette.backInk);
    apply("back_faint", palette.backFaint);
    apply("ui_chip", palette.chip, palette.chipEmissive);
    apply("ui_orange", undefined, palette.accentEmissive);
    onLoaded();
  }, [scene, onLoaded]);

  useEffect(() => {
    const palette = PALETTES[finish];
    targets.current = {
      bone_PC: { color: new THREE.Color(palette.shell) },
      charcoal_bezel: { color: new THREE.Color(palette.frame) },
      key_cream: { color: new THREE.Color(palette.keys) },
      TE_orange: { color: new THREE.Color(palette.accent) },
      safety_red: { color: new THREE.Color(palette.power) },
      seam: { color: new THREE.Color(palette.seam) },
      grip_dark: { color: new THREE.Color(palette.grip) },
      back_ink: { color: new THREE.Color(palette.backInk) },
      back_faint: { color: new THREE.Color(palette.backFaint) },
      ui_chip: {
        color: new THREE.Color(palette.chip),
        emissive: new THREE.Color(palette.chipEmissive),
      },
      ui_orange: { emissive: new THREE.Color(palette.accentEmissive) },
    };
  }, [finish]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const clock = state.clock.elapsedTime;
    if (started.current === null) started.current = clock;
    const progress = reduce
      ? 1
      : Math.min(1, Math.max(0, (clock - started.current) / 1.5));
    const eased = 1 - Math.pow(1 - progress, 3);

    group.current.rotation.y = Math.PI + (1 - eased) * 0.8;
    group.current.rotation.x = (1 - eased) * 0.05;
    group.current.rotation.z = Math.sin(clock * 0.36) * 0.004;
    group.current.position.y =
      -0.004 + Math.sin(clock * 0.52) * 0.0011 + (1 - eased) * -0.009;
    group.current.scale.setScalar(0.95 + eased * 0.05);

    const blend = 1 - Math.exp(-delta * 7);
    const map = targets.current;
    for (const name in map) {
      const target = map[name];
      const list = buckets.current[name];
      if (!list) continue;
      for (const material of list) {
        if (target.color) material.color.lerp(target.color, blend);
        if (target.emissive) material.emissive.lerp(target.emissive, blend);
      }
    }
  });

  return (
    <group ref={group} rotation={[0, Math.PI, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function Scene({
  finish,
  onLoaded,
  reduce,
}: {
  finish: FinishId;
  onLoaded: () => void;
  reduce: boolean;
}) {
  const [autoRotate, setAutoRotate] = useState(!reduce);

  return (
    <>
      <ambientLight intensity={0.38} />
      <directionalLight
        position={[0.32, 0.72, 0.58]}
        intensity={1.35}
        color="#ffe9cf"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
        shadow-camera-left={-0.12}
        shadow-camera-right={0.12}
        shadow-camera-top={0.15}
        shadow-camera-bottom={-0.15}
        shadow-camera-near={0.1}
        shadow-camera-far={2}
      />
      <directionalLight
        position={[-0.55, 0.18, 0.42]}
        intensity={0.45}
        color="#dbe6f4"
      />
      <directionalLight
        position={[0.18, 0.22, -0.7]}
        intensity={0.05}
        color="#ffb28a"
      />
      <directionalLight
        position={[0, 0.4, -0.9]}
        intensity={2.2}
        color="#eef1f5"
      />
      <directionalLight
        position={[-0.5, 0.2, -0.8]}
        intensity={0.8}
        color="#e8eef5"
      />
      <spotLight
        position={[0, 0.8, -0.45]}
        angle={0.72}
        penumbra={1}
        intensity={1.0}
        color="#ff8a55"
      />

      <Suspense fallback={null}>
        <Model finish={finish} onLoaded={onLoaded} reduce={reduce} />
      </Suspense>

      <ContactShadows
        position={[0, -0.0555, 0]}
        opacity={0.7}
        scale={0.28}
        blur={1.8}
        far={0.06}
        resolution={512}
        color="#2d261c"
      />

      <Environment resolution={256} frames={1}>
        <Lightformer
          intensity={1.3}
          position={[0, 1.5, 1.1]}
          scale={[5, 3, 1]}
          color="#fff6e8"
        />
        <Lightformer
          intensity={0.65}
          position={[-1.6, 0.55, 0.9]}
          scale={[2.2, 3, 1]}
          color="#e6eefb"
        />
        <Lightformer
          intensity={0.95}
          position={[1.7, 0.2, 0.35]}
          scale={[1.2, 3.2, 1]}
          color="#ffe0c9"
        />
        <Lightformer
          intensity={0.08}
          position={[0, 0.15, -1.7]}
          scale={[4, 2, 1]}
          color="#ffb08a"
        />
        <Lightformer
          intensity={2.0}
          position={[1.9, 0.6, 1.0]}
          scale={[0.35, 1.8, 1]}
          color="#fff2df"
        />
      </Environment>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        autoRotate={autoRotate && !reduce}
        autoRotateSpeed={0.55}
        rotateSpeed={0.5}
        enableDamping
        dampingFactor={0.075}
        minPolarAngle={Math.PI * 0.3}
        maxPolarAngle={Math.PI * 0.7}
        onStart={() => setAutoRotate(false)}
      />
    </>
  );
}

export default function StageCanvas({
  finish,
  onLoaded,
  reduce,
  inView,
}: {
  finish: FinishId;
  onLoaded: () => void;
  reduce: boolean;
  inView: boolean;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.7]}
      camera={{ position: [-0.122, 0.012, 0.218], fov: 30, near: 0.01, far: 10 }}
      frameloop={inView ? "always" : "never"}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.78;
      }}
    >
      <Scene finish={finish} onLoaded={onLoaded} reduce={reduce} />
    </Canvas>
  );
}
