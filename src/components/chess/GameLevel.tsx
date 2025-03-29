import React, { Suspense } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useChess } from "@/contexts/chess-context";
import { WhiteKing, WhiteKnight, WhitePawn } from "../models/ChessPieces";
import { Canvas } from "@react-three/fiber";
import CanvasLoader from "../CanvasLoader";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

function GameLevel() {
    const { skillLevel, setSkillLevel } = useChess();

    return (
        <ScrollArea>
            <div className="flex justify-center gap-6 p-6 w-auto -ml-4">
                <Button
                    className={cn(
                        "flex flex-col items-center justify-center ring-2",
                        "relative w-28 h-32 rounded-lg overflow-hidden cursor-pointer hover:bg-transparent",
                        "bg-gradient-to-br from-white/5 to-white/20",
                        "hover:from-white/5 hover:to-white/20",
                        skillLevel === "beginner"
                            ? "ring-white"
                            : "ring-white/20",
                    )}
                    onClick={() => setSkillLevel("beginner")}
                >
                    <Canvas
                        className="w-full h-full"
                        camera={{ position: [0, 0, 5], fov: 50 }}
                    >
                        <Suspense fallback={<CanvasLoader />}>
                            <ambientLight intensity={0.5} />
                            <spotLight
                                position={[10, 10, 10]}
                                angle={0.15}
                                penumbra={1}
                            />
                            <pointLight position={[-10, -10, -10]} />

                            <WhitePawn
                                position={[0, -1, 0]}
                                scale={0.65}
                                rotation={[-Math.PI / 2, 0, -Math.PI]}
                            />

                            <OrbitControls
                                enableZoom={false}
                                enablePan={false}
                                rotateSpeed={0.5}
                            />
                        </Suspense>
                        <Environment preset="city" />
                    </Canvas>
                    <h3 className="absolute bottom-1 mx-auto font-semibold text-primary-foreground text-sm">
                        Beginner
                    </h3>
                </Button>

                <Button
                    className={cn(
                        "flex flex-col items-center justify-center ring-2",
                        "relative w-28 h-32 rounded-lg overflow-hidden cursor-pointer hover:bg-transparent",
                        "bg-gradient-to-br from-white/5 to-white/20",
                        "hover:from-white/5 hover:to-white/20",
                        skillLevel === "intermediate"
                            ? "ring-white"
                            : "ring-white/20",
                    )}
                    onClick={() => setSkillLevel("intermediate")}
                >
                    <Canvas
                        className="w-full h-full"
                        camera={{ position: [0, 0, 5], fov: 50 }}
                    >
                        <Suspense fallback={<CanvasLoader />}>
                            <ambientLight intensity={0.5} />
                            <spotLight
                                position={[10, 10, 10]}
                                angle={0.15}
                                penumbra={1}
                            />
                            <pointLight position={[-10, -10, -10]} />

                            <WhiteKnight
                                position={[0, -1.2, 0]}
                                scale={0.5}
                                rotation={[-Math.PI / 2, 0, -Math.PI]}
                            />

                            <OrbitControls
                                enableZoom={false}
                                enablePan={false}
                                rotateSpeed={0.5}
                            />
                        </Suspense>
                        <Environment preset="city" />
                    </Canvas>
                    <h3 className="absolute bottom-1 mx-auto  font-semibold text-primary-foreground text-sm">
                        Intermediate
                    </h3>
                </Button>

                <Button
                    className={cn(
                        "flex flex-col items-center justify-center ring-2",
                        "relative w-28 h-32 rounded-lg overflow-hidden cursor-pointer hover:bg-transparent",
                        "bg-gradient-to-br from-white/5 to-white/20",
                        "hover:from-white/5 hover:to-white/20",
                        skillLevel === "advanced"
                            ? "ring-white"
                            : "ring-white/20",
                    )}
                    onClick={() => setSkillLevel("advanced")}
                >
                    <Canvas
                        className="w-full h-full"
                        camera={{ position: [0, 0, 5], fov: 50 }}
                    >
                        <Suspense fallback={<CanvasLoader />}>
                            <ambientLight intensity={0.5} />
                            <spotLight
                                position={[10, 10, 10]}
                                angle={0.15}
                                penumbra={1}
                            />
                            <pointLight position={[-10, -10, -10]} />

                            <WhiteKing
                                position={[0, -1.2, 0]}
                                scale={0.38}
                                rotation={[-Math.PI / 2, 0, -Math.PI]}
                            />

                            <OrbitControls
                                enableZoom={false}
                                enablePan={false}
                                rotateSpeed={0.5}
                            />
                        </Suspense>
                        <Environment preset="city" />
                    </Canvas>
                    <h3 className="absolute bottom-1 mx-auto  font-semibold text-primary-foreground text-sm">
                        Advanced
                    </h3>
                </Button>
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}

export default GameLevel;
