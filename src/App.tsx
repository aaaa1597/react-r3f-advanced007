import React, { useEffect, Suspense} from 'react';
import './App.css';
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, Environment } from '@react-three/drei'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

const FBXModel = () => {
  const fbx = useLoader(FBXLoader, "./assets/Ch09_nonPBR.fbx");

  useEffect(() => {
    fbx.scale.multiplyScalar(0.02)
  }, [])

  return (
    <primitive object={fbx} position={[1, -1, 1]} />
  )
}

const App = () => {
  return (
    <div style={{ width: "100vw", height: "75vh" }}>
      <Canvas camera={{ position: [3, 1, 3] }}>
        <ambientLight intensity={2} />
        <pointLight position={[40, 40, 40]} />
        <Suspense fallback={null}>
          <FBXModel />
        </Suspense>
        <OrbitControls />
        <Environment preset="forest" background />
        <axesHelper args={[5]} />
        <gridHelper />
      </Canvas>
    </div>
  );
}

export default App;
