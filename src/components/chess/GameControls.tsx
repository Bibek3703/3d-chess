import { useChess } from "@/contexts/chess-context";
import { Power } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

// UI Controls component
const GameControls = () => {
    const {
        resetGame,
        gameStatus,
        startGame,
    } = useChess();

    return (
        <div className="flex items-center justify-between w-full mb-4">
            <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-primary-foreground">
                    {gameStatus === "idle" || gameStatus === "paused"
                        ? "Start Game"
                        : "Reset Game"}
                </p>
            </div>
            <Button
                size="icon"
                onClick={() =>
                    gameStatus === "idle" || gameStatus === "paused"
                        ? startGame()
                        : resetGame()}
                className={cn(
                    "w-auto h-auto p-1.5",
                    gameStatus === "idle" || gameStatus === "paused"
                        ? "text-green-500"
                        : "text-destructive",
                )}
            >
                <Power />
            </Button>
        </div>
    );
};

export default GameControls;
