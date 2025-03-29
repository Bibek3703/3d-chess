"use client";

import * as THREE from "three";
import React from "react";
import { ThreeElements } from "@react-three/fiber";
import { GLTF } from "three-stdlib";
import { useGLTF } from "@react-three/drei";

type GLTFResult = GLTF & {
    nodes: {
        knight_Material002_0: THREE.Mesh;
        queen_Material002_0: THREE.Mesh;
        pawn_Material002_0: THREE.Mesh;
        rook_2_Material002_0: THREE.Mesh;
        bishop_Material002_0: THREE.Mesh;
        rook_Material002_0: THREE.Mesh;
        knight_2_Material002_0: THREE.Mesh;
        bishop_2_Material002_0: THREE.Mesh;
        pawn_2_Material002_0: THREE.Mesh;
        pawn_3_Material002_0: THREE.Mesh;
        pawn_4_Material002_0: THREE.Mesh;
        pawn_5_Material002_0: THREE.Mesh;
        pawn_6_Material002_0: THREE.Mesh;
        pawn_7_Material002_0: THREE.Mesh;
        pawn_8_Material002_0: THREE.Mesh;
        queen_2_Material003_0: THREE.Mesh;
        king_2_Material003_0: THREE.Mesh;
        pawn_08_Material003_0: THREE.Mesh;
        bishop_4_Material003_0: THREE.Mesh;
        rook_3_Material003_0: THREE.Mesh;
        rook_4_Material003_0: THREE.Mesh;
        knight_3_Material003_0: THREE.Mesh;
        bishop_3_Material003_0: THREE.Mesh;
        pawn_01_Material003_0: THREE.Mesh;
        pawn_02_Material003_0: THREE.Mesh;
        pawn_03_Material003_0: THREE.Mesh;
        pawn_04_Material003_0: THREE.Mesh;
        pawn_05_Material003_0: THREE.Mesh;
        pawn_06_Material003_0: THREE.Mesh;
        pawn_07_Material003_0: THREE.Mesh;
        knight_3001_Material003_0: THREE.Mesh;
        king_2001_Material002_0: THREE.Mesh;
    };
    materials: {
        ["Material.002"]: THREE.MeshPhysicalMaterial;
        ["Material.003"]: THREE.MeshStandardMaterial;
        ["Material.004"]: THREE.MeshStandardMaterial;
        ["Material.001"]: THREE.MeshStandardMaterial;
    };
};

export function BlackKing(props: ThreeElements["mesh"]) {
    const { nodes, materials } = useGLTF(
        "/models/chess/chess-pieces.gltf",
    ) as unknown as GLTFResult;
    return (
        <mesh
            geometry={nodes.king_2001_Material002_0.geometry}
            material={materials["Material.002"]}
            {...props}
        />
    );
}

export function BlackQueen(props: ThreeElements["mesh"]) {
    const { nodes, materials } = useGLTF(
        "/models/chess/chess-pieces.gltf",
    ) as unknown as GLTFResult;
    return (
        <mesh
            geometry={nodes.queen_Material002_0.geometry}
            material={materials["Material.002"]}
            {...props}
        />
    );
}

export function BlackBishop(props: ThreeElements["mesh"]) {
    const { nodes, materials } = useGLTF(
        "/models/chess/chess-pieces.gltf",
    ) as unknown as GLTFResult;
    return (
        <mesh
            geometry={nodes.bishop_Material002_0.geometry}
            material={materials["Material.002"]}
            {...props}
        />
    );
}

export function BlackKnight(props: ThreeElements["mesh"]) {
    const { nodes, materials } = useGLTF(
        "/models/chess/chess-pieces.gltf",
    ) as unknown as GLTFResult;
    return (
        <mesh
            geometry={nodes.knight_Material002_0.geometry}
            material={materials["Material.002"]}
            {...props}
        />
    );
}

export function BlackRook(props: ThreeElements["mesh"]) {
    const { nodes, materials } = useGLTF(
        "/models/chess/chess-pieces.gltf",
    ) as unknown as GLTFResult;
    return (
        <mesh
            geometry={nodes.rook_Material002_0.geometry}
            material={materials["Material.002"]}
            {...props}
        />
    );
}

export function BlackPawn(props: ThreeElements["mesh"]) {
    const { nodes, materials } = useGLTF(
        "/models/chess/chess-pieces.gltf",
    ) as unknown as GLTFResult;
    return (
        <mesh
            geometry={nodes.pawn_Material002_0.geometry}
            material={materials["Material.002"]}
            {...props}
        />
    );
}

export function WhiteKing(props: ThreeElements["mesh"]) {
    const { nodes, materials } = useGLTF(
        "/models/chess/chess-pieces.gltf",
    ) as unknown as GLTFResult;
    return (
        <mesh
            geometry={nodes.king_2_Material003_0.geometry}
            material={materials["Material.003"]}
            {...props}
        />
    );
}

export function WhiteQueen(props: ThreeElements["mesh"]) {
    const { nodes, materials } = useGLTF(
        "/models/chess/chess-pieces.gltf",
    ) as unknown as GLTFResult;
    return (
        <mesh
            geometry={nodes.queen_2_Material003_0.geometry}
            material={materials["Material.003"]}
            {...props}
        />
    );
}

export function WhiteBishop(props: ThreeElements["mesh"]) {
    const { nodes, materials } = useGLTF(
        "/models/chess/chess-pieces.gltf",
    ) as unknown as GLTFResult;
    return (
        <mesh
            geometry={nodes.bishop_3_Material003_0.geometry}
            material={materials["Material.003"]}
            {...props}
        />
    );
}

export function WhiteKnight(props: ThreeElements["mesh"]) {
    const { nodes, materials } = useGLTF(
        "/models/chess/chess-pieces.gltf",
    ) as unknown as GLTFResult;
    return (
        <mesh
            geometry={nodes.knight_3_Material003_0.geometry}
            material={materials["Material.003"]}
            {...props}
        />
    );
}

export function WhiteRook(props: ThreeElements["mesh"]) {
    const { nodes, materials } = useGLTF(
        "/models/chess/chess-pieces.gltf",
    ) as unknown as GLTFResult;
    return (
        <mesh
            geometry={nodes.rook_3_Material003_0.geometry}
            material={materials["Material.003"]}
            {...props}
        />
    );
}

export function WhitePawn(props: ThreeElements["mesh"]) {
    const { nodes, materials } = useGLTF(
        "/models/chess/chess-pieces.gltf",
    ) as unknown as GLTFResult;
    return (
        <mesh
            geometry={nodes.pawn_08_Material003_0.geometry}
            material={materials["Material.003"]}
            {...props}
        />
    );
}
