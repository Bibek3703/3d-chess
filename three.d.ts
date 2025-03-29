import { ThreeElements } from "@react-three/fiber";
import { JSX } from "react";

declare module "@react-spring/three" {
    export const a:
        & {
            [K in keyof ThreeElements]: React.FC<ThreeElements[K]>;
        }
        & {
            // Add any custom non-Three elements if needed
        };
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            // For Three.js geometries
            planeGeometry: ThreeElements["planeGeometry"];
            sphereGeometry: ThreeElements["sphereGeometry"];
            boxGeometry: ThreeElements["boxGeometry"];

            // For materials
            // meshStandardMaterial: ThreeElements["meshStandardMaterial"];
            orbitControls: ThreeElements["orbitControls"];

            // For other Three.js elements
            mesh: ThreeElements["mesh"];
            group: ThreeElements["group"];
        }
    }
}
