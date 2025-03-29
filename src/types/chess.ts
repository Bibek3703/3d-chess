import { Color, PieceSymbol, Square } from "chess.js";

export type PieceType = "k" | "q" | "r" | "b" | "n" | "p";
export type PieceColor = "w" | "b";

// Define the chess piece type
export type ChessPiece = {
    id: string;
    type: PieceType;
    color: PieceColor;
    position: [number, number, number];
    square: string;
};

// Define the square type
export type ChessSquare = {
    id: string;
    position: [number, number, number];
    isWhite: boolean;
    coords: { file: string; rank: number };
    opacity: number;
};

export type SkillLevel = "beginner" | "intermediate" | "advanced";
export type GameStatus = "ongoing" | "draw" | "stalemate" | string;

export type ChessBoard = ({
    square: Square;
    type: PieceSymbol;
    color: Color;
} | null)[][]
