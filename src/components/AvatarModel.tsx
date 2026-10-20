import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { MathUtils, type Group, type Mesh, type MeshStandardMaterial } from 'three';
import type { MotionValue } from 'framer-motion';

export const AVATAR_URL = asset('/avatar.glb');
export type Pointer = MutableRefObject<{ x: number; y: number }>;

/** Cursor position across the window, -1 … 1. */
export function usePointer(still: boolean): Pointer {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (still) return;
    const move = (e: MouseEvent) => { pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1; pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1; };
    const reset = () => { pointer.current.x = 0; pointer.current.y = 0; };
    window.addEventListener('mousemove', move); document.addEventListener('mouseleave', reset);
    return () => { window.removeEventListener('mousemove', move); document.removeEventListener('mouseleave', reset); };
  }, [still]);
  return pointer;
}

export function Lights() {
  return (
    <>
      <ambientLight intensity={1.3} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <directionalLight position={[-4, 1, -2]} intensity={0.8} color="#ffffff" />
    </>
  );
}

interface HeadProps {
  pointer: Pointer; still: boolean;
  centerY: number;                // height of the head centre in the model; the head turns around this point
  yawGain?: number; pitchGain?: number;
  bias?: number;                  // constant turn (radians), e.g. to look towards the content
  focus?: MotionValue<number>;    // gives a small nod between experiences
  yaw?: MotionValue<number>; pitch?: MotionValue<number>; // report the current turn
}

// The body and the head turn towards the cursor at different speeds. Between NECK_LOW and NECK_HIGH the model is
// twisted smoothly (done on the graphics card), so there is no gap at the neck.
const NECK_LOW = 0.38;     // below this height the model follows the "body" turn
const NECK_HIGH = 0.52;    // above this height the model follows the "head" turn
const BODY_SPEED = 2.4;    // higher number = catches the cursor faster
const HEAD_SPEED = 17;     // the head is a bit faster than the body
const NECK_Y = 0.46;       // the head nods up/down around this height

export function Head({ pointer, still, centerY, yawGain = 0.65, pitchGain = 0.3, bias = 0, focus, yaw, pitch }: HeadProps) {
  const { scene } = useGLTF(AVATAR_URL);
  const uniforms = useMemo(() => ({ uBodyYaw: { value: 0 }, uHeadYaw: { value: 0 }, uHeadPitch: { value: 0 } }), []);
  const model = useMemo(() => {
    const m = scene.clone(true);
    m.traverse((o) => {
      const mesh = o as Mesh; if (!mesh.isMesh) return;
      const mat = (mesh.material as MeshStandardMaterial).clone();
      mat.onBeforeCompile = (sh) => {
        sh.uniforms.uBodyYaw = uniforms.uBodyYaw; sh.uniforms.uHeadYaw = uniforms.uHeadYaw; sh.uniforms.uHeadPitch = uniforms.uHeadPitch;
        sh.vertexShader = `uniform float uBodyYaw;
uniform float uHeadYaw;
uniform float uHeadPitch;
vec3 yawRot(vec3 v, float a) { float c = cos(a), s = sin(a); return vec3(c * v.x + s * v.z, v.y, -s * v.x + c * v.z); }
vec3 pitchRot(vec3 v, float a) { float c = cos(a), s = sin(a); return vec3(v.x, c * v.y - s * v.z, s * v.y + c * v.z); }
` + sh.vertexShader
          .replace('#include <beginnormal_vertex>', `float headW = smoothstep(${NECK_LOW.toFixed(3)}, ${NECK_HIGH.toFixed(3)}, position.y);
float yawA = mix(uBodyYaw, uHeadYaw, headW);
float pitchA = uHeadPitch * headW;
vec3 objectNormal = pitchRot(yawRot(normal, yawA), pitchA);`)
          .replace('#include <begin_vertex>', `vec3 hp = yawRot(position, yawA);
hp.y -= ${NECK_Y.toFixed(3)};
hp = pitchRot(hp, pitchA);
hp.y += ${NECK_Y.toFixed(3)};
vec3 transformed = hp;`);
      };
      mat.customProgramCacheKey = () => 'neck-twist';
      mesh.material = mat;
    });
    return m;
  }, [scene, uniforms]);
  const group = useRef<Group>(null);
  const turn = useRef({ body: 0, head: 0, pitch: 0 });
  useFrame((_, dt) => {
    if (!group.current) return;
    const f = focus ? focus.get() : 0; const frac = f - Math.floor(f);
    const ty = still ? 0 : bias + pointer.current.x * yawGain;
    const tx = still ? 0 : pointer.current.y * pitchGain + (focus ? Math.sin(frac * Math.PI) * 0.07 : 0);
    turn.current.body = MathUtils.damp(turn.current.body, ty, BODY_SPEED, dt);
    turn.current.head = MathUtils.damp(turn.current.head, ty, HEAD_SPEED, dt);
    uniforms.uBodyYaw.value = turn.current.body; uniforms.uHeadYaw.value = turn.current.head;
    turn.current.pitch = MathUtils.damp(turn.current.pitch, tx, HEAD_SPEED, dt);
    uniforms.uHeadPitch.value = turn.current.pitch;
    yaw?.set(turn.current.head); pitch?.set(turn.current.pitch);
  });
  return <group ref={group}><primitive object={model} position={[0, -centerY, 0]} /></group>;
}
useGLTF.preload(AVATAR_URL);
