"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

interface ModelViewerProps {
    modelUrl?: string; // For future use
}

function WireframeGeometry(props: any) {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state, delta) => {
        meshRef.current.rotation.x += delta * 0.2;
        meshRef.current.rotation.y += delta * 0.2;
    });

    return (
        <mesh ref={meshRef} {...props}>
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color="#39ff14" wireframe />
        </mesh>
    );
}

export default function ModelViewer({ modelUrl }: ModelViewerProps) {
    return (
        <div className="w-full h-full relative">
            {/* Placeholder label until real model is loaded */}
            <div className="absolute top-2 left-2 z-10 text-[10px] font-mono text-neon-green/50 pointer-events-none">
            /// R3F_CANVAS_INIT ///
            </div>

            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 3]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />

                <WireframeGeometry position={[0, 0, 0]} scale={[1.5, 1.5, 1.5]} />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={2}
                />
            </Canvas>
        </div>
    );
}
