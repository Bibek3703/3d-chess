"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PointMaterial, Points } from "@react-three/drei";
import { inSphere } from "maath/random";
import type * as THREE from "three";

export default function Stars() {
    const ref = useRef<THREE.Points>(null);

    // Generate sphere points using useMemo to ensure consistent values
    const sphere = useMemo(() => {
        const positions = new Float32Array(5000 * 3);
        const temp = inSphere(new Float32Array(5000 * 3), { radius: 1.5 });

        // Validate the positions to ensure no NaN values
        for (let i = 0; i < temp.length; i++) {
            positions[i] = isNaN(temp[i]) ? 0 : temp[i];
        }

        return positions;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });
    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points
                ref={ref}
                positions={sphere}
                stride={3}
                frustumCulled={false}
            >
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}
