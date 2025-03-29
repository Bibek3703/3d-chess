import { Canvas } from "@react-three/fiber";
import React from "react";
import Stars from "../models/Stars";
import { Environment } from "@react-three/drei";

function Background() {
    return (
        <Canvas
            className="w-full h-full"
            camera={{ position: [0, 0, 1] }}
        >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1} />
            <Stars />
            <Environment preset="sunset" />
        </Canvas>
    );
}

export default Background;
