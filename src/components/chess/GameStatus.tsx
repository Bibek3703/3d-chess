"use client";

import { useChess } from "@/contexts/chess-context";

// Game Status component
const GameStatus = () => {
    const { chess, gameStatus, timers } = useChess();

    return (
        <div className="flex justify-between items-center gap-3 w-full text-primary-foreground">
            {gameStatus === "ongoing" && (
                <div className="text-xs font-semibold">
                    {`Current Turn: ${
                        chess.turn() === "w" ? "White" : "Black"
                    }`}
                </div>
            )}
            <div className="flex items-center gap-3 ml-auto">
                <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1 text-xs">
                        You
                        <span className="text-xl">👱</span>
                    </div>

                    <p className="text-xs font-semibold">
                        {Math.floor(timers.w / 60)}:
                        {String(timers.w % 60).padStart(2, "0")}
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-2xl">🤖</span>
                    <p className="text-xs font-semibold">
                        {Math.floor(timers.b / 60)}:
                        {String(timers.b % 60).padStart(2, "0")}
                    </p>
                </div>
            </div>
            {chess.isCheck() && (
                <div style={{ color: "#ff5252", fontWeight: "bold" }}>
                    CHECK!
                </div>
            )}
        </div>
    );
};

export default GameStatus;
