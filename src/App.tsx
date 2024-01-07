import React, { useEffect, Suspense, useRef, useState, useMemo } from 'react';
import './App.css';
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, Environment, useFBX } from '@react-three/drei'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

const FBXModel = (props:{setActionName: React.Dispatch<React.SetStateAction<string>>}) => {
  /* FBXモデル読込み */
  const fbx = useLoader(FBXLoader, "assets/Ch09_nonPBR.fbx");
  /* AnimationClip(s)読込み */
  const animCrips: THREE.AnimationClip[][] = []
  animCrips[0] = useFBX('./assets/BreakdanceEnding2.fbx').animations
  animCrips[1] = useFBX('./assets/BreakdanceUprockVar1.fbx').animations
  animCrips[2] = useFBX('./assets/HipHopDancing.fbx').animations
  animCrips[3] = useFBX('./assets/NorthernSoulSpin.fbx').animations
  animCrips[4] = useFBX('./assets/SwingDancing.fbx').animations
  animCrips[5] = useFBX('./assets/BreakdanceEnding1.fbx').animations
  const animNames = ['BreakdanceEnding2', 'BreakdanceUprockVar1', 'HipHopDancing', 'NorthernSoulSpin', 'SwingDancing', 'BreakdanceEnding1']
  /* 変数定義 */
  const mixer = useRef<THREE.AnimationMixer>();
  const [ animIdx, setAnimIdx ] = useState<number>(0);
  const animActions = useMemo(() => [] as THREE.AnimationAction[], [])

  /* 初期化 */
  useEffect(() => {
    fbx.scale.multiplyScalar(0.02)
    mixer.current = new THREE.AnimationMixer(fbx)
    animCrips.forEach((val: THREE.AnimationClip[], idx: number) => {
      animActions[idx] = mixer.current!.clipAction(val[0])
    })
    new Promise((resolve) => setTimeout((resolve) => {0}, 1000)).then(()=>animActions[0].play())
  }, [])

  /* モーション切替え処理 */
  useEffect(() => {
    const act: THREE.AnimationAction = animActions[animIdx]
    act?.reset().fadeIn(0.3).play()
    props.setActionName(animNames[animIdx] + ' : ' + animIdx)
    return () => {
      act?.fadeOut(0.3)
    }
  }, [animIdx])

  /* FPS処理 */
  useFrame((state, delta) => {
    mixer.current!.update(delta);
    const durationtime: number= animActions[animIdx].getClip().duration
    const currenttime: number = animActions[animIdx].time
    if(currenttime/durationtime > 0.9/*90%を超えたら次のモーションへ*/) {
      const index: number = (animIdx+1) % (animCrips.length)
      setAnimIdx( index )
    }
  });

  return (
    <primitive object={fbx} position={[1, -1, 1]} />
  )
}

const App = () => {
  const [actionName, setActionName] = useState<string>('aaabbb');

  return (
    <div style={{ width: "100vw", height: "75vh" }}>
      <Canvas camera={{ position: [3, 1, 3] }}>
        <ambientLight intensity={2} />
        <pointLight position={[40, 40, 40]} />
        <Suspense fallback={null}>
          <FBXModel setActionName={setActionName}/>
        </Suspense>
        <OrbitControls />
        <Environment preset="forest" background />
        <axesHelper args={[5]} />
        <gridHelper />
      </Canvas>
      <div id="summry">{actionName}</div>
    </div>
  );
}

export default App;
