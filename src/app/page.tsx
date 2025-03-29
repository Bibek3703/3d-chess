"use client";

import Chess from "@/components/Chess";
import Background from "@/components/chess/Background";
import Commentry from "@/components/chess/Commentry";
import GameControls from "@/components/chess/GameControls";
import GameLevel from "@/components/chess/GameLevel";
import GameStatus from "@/components/chess/GameStatus";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import ChessProvider from "@/contexts/chess-context";

export default function Home() {
  return (
    <ChessProvider>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full h-screen bg-black p-6 md:p-12">
        <div className="col-span-1 sm:col-span-3">
          <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 p-6 shadow-[0px_0px_27px_0px_#2D2D2D] md:p-6 border border-[#2D2D2D]">
              <div className="absolute top-0 right-0 w-full h-full">
                <Background />
              </div>
              <div className="absolute top-2 right-4">
                <GameStatus />
              </div>
              <Chess />
            </div>
          </div>
        </div>
        <div className="col-span-1 sm:col-span-2">
          <div className="relative flex flex-col gap-4 md:gap-8 w-full h-full rounded-2xl border p-2 md:rounded-3xl md:p-3 lg:p-8">
            <GameControls />
            <GameLevel />
            <Commentry />
          </div>
        </div>
      </div>
    </ChessProvider>
  );
}
