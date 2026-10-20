import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Head, Lights, usePointer } from './AvatarModel';

// The whole body is shown: the camera looks at the middle of the model (CENTER_Y) from CAMERA_Z away.
// Lower CAMERA_Z = closer (bigger, but feet / hair may get cut off).
const CENTER_Y = 0;
const CAMERA_Z = 4.3;

export default function Avatar3D({ alt, still }: { alt: string; still: boolean }) {
  const pointer = usePointer(still);
  return (
    <div style={{ height: 'clamp(20rem, 50vh, 34rem)', aspectRatio: '0.7' }}>
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, CAMERA_Z], fov: 30 }} gl={{ alpha: true, antialias: true }} dpr={[1, 2]} aria-label={alt}>
          <Lights />
          <Head pointer={pointer} still={still} centerY={CENTER_Y} yawGain={0.6} pitchGain={0.45} />
        </Canvas>
      </Suspense>
    </div>
  );
}
