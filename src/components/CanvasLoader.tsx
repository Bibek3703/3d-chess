import { Html, useProgress } from "@react-three/drei";
import React, { useEffect, useState } from "react";
import { Progress } from "./ui/progress";

export default function CanvasLoader() {
    const [value, setValue] = useState(0);
    const { progress } = useProgress();

    useEffect(() => {
        setValue(progress);
    }, [progress]);
    return (
        <Html center>
            <div className="flex flex-col items-center gap-2 w-60">
                <span className="text-primary-foreground text-sm font-normal">
                    Loading...
                </span>
                <Progress value={value} className="h-1.5" />
            </div>
        </Html>
    );
}
