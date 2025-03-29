"use client";

import { PieceColor, PieceType } from "@/types/chess";
import { ThreeElements, useFrame, useThree } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";
import {
    BlackBishop,
    BlackKing,
    BlackKnight,
    BlackPawn,
    BlackQueen,
    BlackRook,
    WhiteBishop,
    WhiteKing,
    WhiteKnight,
    WhitePawn,
    WhiteQueen,
    WhiteRook,
} from "./ChessPieces";
import { useChess } from "@/contexts/chess-context";
import { fileLabels, rankLabels } from "@/constants/chess";
import { Text } from "@react-three/drei";

// Component to highlight squares
const HighlightSquare = (
    { position, size, color, opacity = 0.5 }: {
        position: THREE.Vector3Tuple;
        size: number;
        color: string;
        opacity?: number;
    },
) => {
    return (
        <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[size, size]} />
            <meshBasicMaterial
                color={color}
                transparent
                opacity={opacity}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

// Chess piece component
const ChessPiece = (
    { type, color, position }: {
        type: PieceType;
        color: PieceColor;
        position: [number, number, number];
    },
) => {
    // Map chess.js piece types to the components
    const pieceSymbols = {
        k: {
            w: <WhiteKing />,
            b: <BlackKing />,
        },
        q: {
            w: <WhiteQueen />,
            b: <BlackQueen />,
        },
        r: {
            w: <WhiteRook />,
            b: <BlackRook />,
        },
        b: {
            w: <WhiteBishop />,
            b: <BlackBishop />,
        },
        n: {
            w: <WhiteKnight />,
            b: <BlackKnight />,
        },
        p: {
            w: <WhitePawn />,
            b: <BlackPawn />,
        },
    };

    const PieceComponent = pieceSymbols[type][color];

    return (
        <group position={position}>
            {React.cloneElement(PieceComponent, {
                scale: 0.196,
                rotation: [
                    -Math.PI / 2,
                    0,
                    (color === "w" ? -Math.PI : Math.PI) / 2,
                ],
                position: [0, 0, 0],
            })}
        </group>
    );
};

// Internal board component that uses the context
const ChessBoard = (
    props: ThreeElements["group"],
) => {
    const {
        totalSize,
        halfSize,
        squareSize,
        userColor,
        squares,
        pieces,
        selectedSquare,
        possibleMoves,
        highlightPos,
        setHighlightPos,
        squareToPosition,
        handleSquareClick,
    } = useChess();

    // Board rotation based on user color
    const boardRotation = userColor === "b" ? Math.PI : 0;

    const fileLabelZ = userColor === "w" ? halfSize + 0.3 : -halfSize - 0.3;
    const rankLabelX = userColor === "w" ? -halfSize - 0.3 : halfSize + 0.3;

    const squareRefs = useRef<Record<string, THREE.Mesh>>({});
    const { raycaster, camera, mouse, gl } = useThree();

    // Ray-casting for hover effects
    useFrame(() => {
        // Update the raycaster with the current mouse position
        raycaster.setFromCamera(mouse, camera);

        // Check for intersections with all square meshes
        const squareMeshes = Object.values(squareRefs.current);
        const intersects = raycaster.intersectObjects(squareMeshes, false);

        if (intersects.length > 0) {
            // Get the intersected object's position
            const position = intersects[0].object.position.clone();
            // Adjust y position for the highlight to be slightly above the board
            position.y = 0.01;
            // Set highlight position
            setHighlightPos(position.toArray() as [number, number, number]);
        } else {
            setHighlightPos(null);
        }
    });

    // Handle click events
    React.useEffect(() => {
        const handleClick = () => {
            // Update the raycaster with the current mouse position
            raycaster.setFromCamera(mouse, camera);

            // Check for intersections with all square meshes
            const squareMeshes = Object.values(squareRefs.current);
            const intersects = raycaster.intersectObjects(squareMeshes, false);

            if (intersects.length > 0) {
                // Get the intersected object's position
                const position = intersects[0].object.position.clone();
                handleSquareClick(position);
            }
        };

        // Add click event listener to the canvas
        const canvas = gl.domElement;
        canvas.addEventListener("click", handleClick);

        // Cleanup
        return () => {
            canvas.removeEventListener("click", handleClick);
        };
    }, [gl, raycaster, mouse, camera, handleSquareClick]);

    return (
        <group
            {...props}
            rotation={[0, boardRotation, 0]}
        >
            {/* Chess squares */}
            {squares.map((square) => (
                <mesh
                    key={square.id}
                    position={square.position}
                    rotation={[-Math.PI / 2, 0, 0]}
                    ref={(el) => {
                        if (el) squareRefs.current[square.id] = el;
                    }}
                >
                    <planeGeometry args={[squareSize, squareSize]} />
                    <meshStandardMaterial
                        color={square.isWhite ? "#ffffff" : "#000000"}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}

            {/* File (column) labels */}
            {fileLabels.map((label, i) => (
                <Text
                    key={`file-${i}`}
                    position={[
                        (i * squareSize) - halfSize + (squareSize / 2),
                        0,
                        fileLabelZ,
                    ]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontSize={0.3}
                    color="#000000"
                    anchorX="center"
                    anchorY="middle"
                    font={"https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"}
                    castShadow
                >
                    {userColor === "b" ? fileLabels[7 - i] : label}
                </Text>
            ))}

            {/* Rank (row) labels */}
            {rankLabels.map((label, i) => (
                <Text
                    key={`rank-${i}`}
                    position={[
                        rankLabelX,
                        0,
                        (i * squareSize) - halfSize + (squareSize / 2),
                    ]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontSize={0.3}
                    color="#000000"
                    anchorX="center"
                    anchorY="middle"
                >
                    {userColor === "b" ? rankLabels[7 - i] : label}
                </Text>
            ))}

            {/* Chess pieces */}
            {pieces.map((piece) => (
                <ChessPiece
                    key={piece.id}
                    type={piece.type}
                    color={piece.color}
                    position={piece.position}
                />
            ))}

            {/* Border around the chess board */}
            <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <boxGeometry args={[totalSize + 1, totalSize + 1, 0.1]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>

            {/* Hover Highlight */}
            {highlightPos && (
                <HighlightSquare
                    position={highlightPos}
                    size={squareSize}
                    color="#FFFF00"
                    opacity={0.3}
                />
            )}

            {/* Selected Square Highlight */}
            {selectedSquare && (
                <HighlightSquare
                    position={squareToPosition(selectedSquare)}
                    size={squareSize}
                    color="#0000FF"
                    opacity={0.5}
                />
            )}

            {/* Possible Moves Highlights */}
            {possibleMoves.map((moveSquare, index) => {
                // Check if the target square has a piece (capture)
                const isCapture = pieces.some((p) => p.square === moveSquare);

                return (
                    <HighlightSquare
                        key={`move-${index}`}
                        position={squareToPosition(moveSquare)}
                        size={squareSize}
                        color={isCapture ? "#FF0000" : "#00FF00"}
                        opacity={0.4}
                    />
                );
            })}
        </group>
    );
};

export default ChessBoard;
