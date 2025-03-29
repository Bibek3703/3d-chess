"use client";

import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import CanvasLoader from "./CanvasLoader";
import {
    Environment,
    OrbitControls,
    PerspectiveCamera,
} from "@react-three/drei";
import Stars from "./models/Stars";
import ChessBoard from "./models/ChessBoard";

function Chess() {
    return (
        <Canvas
            className="w-full h-full"
            camera={{ position: [0, 0, 1] }}
        >
            <Suspense fallback={<CanvasLoader />}>
                <PerspectiveCamera
                    makeDefault
                    position={[0, 10, 10]}
                />
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 5]} intensity={1} />
                <ChessBoard
                    scale={1.02}
                    position={[0, -1, 0]}
                />
                <OrbitControls />
            </Suspense>
            <Environment preset="sunset" />
        </Canvas>
    );
}

export default Chess;
