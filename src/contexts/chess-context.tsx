"use client";

import {
    ChessPiece,
    ChessSquare,
    GameStatus,
    PieceColor,
    SkillLevel,
} from "@/types/chess";
import {
    convertPositionToSquare,
    convertSquareToPosition,
    evaluateMove,
    evaluatePosition,
    generateMoveCommentary,
    getPieces,
    getSelectedMove,
    getSquares,
} from "@/utils/chess";
import { Chess, Move, Square } from "chess.js";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

export interface ChessContextProps {
    size: number;
    squareSize: number;
    totalSize: number;
    halfSize: number;
    chess: Chess;
    squares: ChessSquare[];
    pieces: ChessPiece[];
    selectedSquare: string | null;
    possibleMoves: string[];
    gameStatus: GameStatus;
    userColor: PieceColor;
    timers: { w: number; b: number };
    skillLevel: SkillLevel;
    highlightPos: [number, number, number] | null;
    lastMove: { from: string; to: string } | null;
    commentary: string;
    historyIndex: number;
    moveHistory: string[];
    setHighlightPos: (pos: [number, number, number] | null) => void;
    squareToPosition: (square: string) => [number, number, number];
    positionToSquare: (x: number, z: number) => string;
    handleSquareClick: (position: { x: number; y: number; z: number }) => void;
    resetGame: () => void;
    startGame: () => void;
    setUserColor: (color: PieceColor) => void;
    setSkillLevel: (level: SkillLevel) => void;
    togglePause: () => void;
    undoMove: () => void;
}

const ChessContext = createContext<ChessContextProps | undefined>(undefined);

export const useChess = () => {
    const context = useContext(ChessContext);
    if (!context) {
        throw new Error("useChessContext must be used within a ChessProvider");
    }
    return context;
};

interface ChessProviderProps {
    children: React.ReactNode;
    size?: number;
    squareSize?: number;
}

export default function ChessProvider(
    { children, size = 8, squareSize = 1 }: ChessProviderProps,
) {
    const [chess] = useState(() => new Chess());
    const [highlightPos, setHighlightPos] = useState<
        [number, number, number] | null
    >(null);
    const [squares, setSquares] = useState<ChessSquare[]>([]);
    const [pieces, setPieces] = useState<ChessPiece[]>([]);
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
    const [gameStatus, setGameStatus] = useState<GameStatus>("idle");
    const [userColor, setUserColor] = useState<PieceColor>("w");
    const [timers, setTimers] = useState({ w: 600, b: 600 });
    const [skillLevel, setSkillLevel] = useState<SkillLevel>("intermediate");
    const [timerRef, setTimerRef] = useState<NodeJS.Timeout | null>(null);
    const [lastMove, setLastMove] = useState<
        { from: string; to: string } | null
    >(null);
    const [commentary, setCommentary] = useState<string>(
        "Game started! White to move.",
    );
    const [moveHistory, setMoveHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(-1);

    // Total board size
    const totalSize = size * squareSize;
    // Half of the total size to center the board
    const halfSize = totalSize / 2;

    // Timer settings based on skill level
    useEffect(() => {
        const timeConfig = {
            beginner: 1800, // 30 minutes
            intermediate: 900, // 15 minutes
            advanced: 300, // 5 minutes
        };

        setTimers({
            w: timeConfig[skillLevel],
            b: timeConfig[skillLevel],
        });
    }, [skillLevel]);

    useEffect(() => {
        if (gameStatus !== "ongoing") return;

        if (timerRef) clearInterval(timerRef);

        const interval = setInterval(() => {
            setTimers((prev) => {
                const currentTurn = chess.turn() as PieceColor;
                const newTime = prev[currentTurn] - 1;

                if (newTime <= 0) {
                    setGameStatus(`timeout-${currentTurn}`);
                    clearInterval(interval);
                    return prev;
                }

                return { ...prev, [currentTurn]: newTime };
            });
        }, 1000);

        setTimerRef(interval);

        return () => {
            clearInterval(interval);
        };
    }, [chess, gameStatus, timerRef]);

    const squareToPosition = useCallback((square: string) => {
        return convertSquareToPosition(square, squareSize, halfSize);
    }, [squareSize, halfSize]);

    // Helper to convert 3D position to chess notation
    const positionToSquare = useCallback((x: number, z: number): string => {
        return convertPositionToSquare(x, z, squareSize, halfSize);
    }, [squareSize, halfSize]);

    const getMoveCommentary = useCallback((move: Move) => {
        return generateMoveCommentary(move, chess, moveHistory);
    }, [chess, moveHistory]);

    // Update pieces based on chess.js board state
    const updatePiecesFromBoard = useCallback(() => {
        const currentBoard = chess.board();
        const newPieces: ChessPiece[] = getPieces(
            currentBoard,
            squareSize,
            halfSize,
        );
        setPieces(newPieces);

        // Check game status
        if (chess.isGameOver()) {
            if (chess.isCheckmate()) {
                const winner = chess.turn() === "w" ? "b" : "w";
                setGameStatus(`checkmate-${winner}`);
                setCommentary(
                    `Checkmate! ${
                        winner === "w" ? "White" : "Black"
                    } wins the game.`,
                );
            } else if (chess.isDraw()) {
                setGameStatus("draw");
                setCommentary("The game ends in a draw.");
            } else if (chess.isStalemate()) {
                setGameStatus("stalemate");
                setCommentary("Stalemate! The game ends in a draw.");
            }
        }
    }, [chess, halfSize, squareSize, squareToPosition]);

    // Create chess board squares
    useEffect(() => {
        const newSquares: ChessSquare[] = getSquares(
            size,
            squareSize,
            halfSize,
        );
        setSquares(newSquares);

        // Update pieces based on chess.js board state
        updatePiecesFromBoard();
    }, [size, squareSize, halfSize, squareToPosition, updatePiecesFromBoard]);

    // Toggle pause/resume of the game
    const togglePause = useCallback(() => {
        if (gameStatus === "ongoing") {
            setGameStatus("paused");
            if (timerRef) {
                clearInterval(timerRef);
                setTimerRef(null);
            }
        } else if (gameStatus === "paused") {
            setGameStatus("ongoing");
        }
    }, [gameStatus, timerRef]);

    // Make computer move with varying difficulty
    const makeComputerMove = useCallback(() => {
        if (gameStatus !== "ongoing") return;

        // Get all possible moves
        const moves = chess.moves({ verbose: true });

        if (moves.length > 0) {
            let selectedMove;

            // Implement different skill levels
            switch (skillLevel) {
                case "beginner":
                    // Beginner: Sometimes makes mistakes, prefers simple moves
                    // 30% chance of making a random move, otherwise prefers captures and checks
                    if (Math.random() < 0.3) {
                        selectedMove =
                            moves[Math.floor(Math.random() * moves.length)];
                    } else {
                        // Prefers captures and checks
                        selectedMove = getSelectedMove(moves, chess);
                    }
                    break;

                case "intermediate":
                    // Evaluate all moves
                    const moveScores = moves.map((move) => ({
                        move,
                        score: evaluateMove(move, chess),
                    }));

                    // Sort by score (descending)
                    moveScores.sort((a, b) => b.score - a.score);

                    // 20% chance of not picking the best move
                    if (Math.random() < 0.2) {
                        const randomIndex = Math.floor(
                            Math.random() * Math.min(3, moveScores.length),
                        );
                        selectedMove = moveScores[randomIndex].move;
                    } else {
                        selectedMove = moveScores[0].move;
                    }
                    break;

                case "advanced":
                    // Simple minimax without too much depth for performance
                    const minimaxDepth = 2;
                    let bestScore = -Infinity;
                    let bestMove = moves[0];

                    for (const move of moves) {
                        const tempChess = new Chess(chess.fen());
                        tempChess.move(move);

                        const score = -evaluatePosition(
                            tempChess,
                            minimaxDepth - 1,
                            userColor,
                        );

                        if (score > bestScore) {
                            bestScore = score;
                            bestMove = move;
                        }
                    }
                    selectedMove = bestMove;
                    break;

                default:
                    // Fallback to random move
                    selectedMove =
                        moves[Math.floor(Math.random() * moves.length)];
            }

            // Make the move
            chess.move(selectedMove);

            // Record the move
            const moveNotation = selectedMove.san;
            setMoveHistory((prev) => [...prev, moveNotation]);
            setHistoryIndex((prev) => prev + 1);

            // Update last move for highlighting
            setLastMove({
                from: selectedMove.from,
                to: selectedMove.to,
            });

            // Generate commentary
            const computerCommentary = getMoveCommentary(selectedMove);
            setCommentary(`${moveNotation}. ${computerCommentary}`);

            // Update the board
            updatePiecesFromBoard();
        }
    }, [
        chess,
        updatePiecesFromBoard,
        userColor,
        skillLevel,
        getMoveCommentary,
        gameStatus,
    ]);

    // Handle click events
    const handleSquareClick = useCallback(
        (position: { x: number; y: number; z: number }) => {
            if (gameStatus !== "ongoing") return;

            // Only allow moves if it's the user's turn
            if (chess.turn() !== userColor) return;

            const square = positionToSquare(position.x, position.z) as Square;

            // If a square is already selected, try to move a piece
            if (selectedSquare) {
                // Check if the clicked square is in the possible moves
                if (possibleMoves.includes(square)) {
                    try {
                        // Make the move using chess.js
                        const move = chess.move({
                            from: selectedSquare,
                            to: square,
                            promotion: "q", // Always promote to queen for simplicity
                        });
                        // Record the move
                        const moveNotation = move.san;
                        setMoveHistory((prev) => [...prev, moveNotation]);
                        setHistoryIndex((prev) => prev + 1);

                        // Set last move for highlighting
                        setLastMove({
                            from: selectedSquare,
                            to: square,
                        });

                        // Update the board
                        updatePiecesFromBoard();

                        // Make computer move if playing against computer
                        setTimeout(() => {
                            if (
                                chess.turn() !== userColor &&
                                gameStatus === "ongoing"
                            ) {
                                makeComputerMove();
                            }
                        }, 500);
                    } catch (error) {
                        console.error("Invalid move:", error);
                    }
                }
                // Clear selection and possible moves
                setSelectedSquare(null);
                setPossibleMoves([]);
            } else {
                // Get piece at the clicked square
                const piece = chess.get(square);
                // Only select piece if it belongs to the current player
                if (piece && piece.color === chess.turn()) {
                    setSelectedSquare(square);

                    // Get possible moves for the selected piece
                    const moves = chess.moves({
                        square,
                        verbose: true,
                    });

                    setPossibleMoves(moves.map((move) => move.to));
                }
            }
        },
        [
            selectedSquare,
            possibleMoves,
            chess,
            positionToSquare,
            gameStatus,
            userColor,
            updatePiecesFromBoard,
            makeComputerMove,
        ],
    );

    // Undo the last move (two moves in computer play - player move and computer move)
    const undoMove = useCallback(() => {
        if (moveHistory.length > 0) {
            // Undo two moves if playing against computer (player's move and computer's move)
            if (chess.turn() === userColor) {
                // We're at the start of the player's turn, so undo two moves
                chess.undo();
                chess.undo();

                // Update move history
                setMoveHistory((prev) => prev.slice(0, -2));
                setHistoryIndex((prev) => prev - 2);
            } else {
                // We're at the computer's turn, so undo one move
                chess.undo();

                // Update move history
                setMoveHistory((prev) => prev.slice(0, -1));
                setHistoryIndex((prev) => prev - 1);
            }

            // Update the board
            updatePiecesFromBoard();
            setCommentary("Move undone.");

            // Clear selection
            setSelectedSquare(null);
            setPossibleMoves([]);
        }
    }, [chess, moveHistory, userColor, updatePiecesFromBoard]);

    // Reset the game
    const resetGame = useCallback(() => {
        chess.reset();
        updatePiecesFromBoard();
        setGameStatus("idle");
        setSelectedSquare(null);
        setPossibleMoves([]);
        setLastMove(null);
        setCommentary("Game reset! White to move.");
        setMoveHistory([]);
        setHistoryIndex(-1);

        // Reset timers based on skill level
        const timeConfig = {
            beginner: 1800, // 30 minutes
            intermediate: 900, // 15 minutes
            advanced: 300, // 5 minutes
        };

        setTimers({
            w: timeConfig[skillLevel],
            b: timeConfig[skillLevel],
        });

        // If user is black, make the first move as white
        if (userColor === "b") {
            setTimeout(() => {
                makeComputerMove();
            }, 500);
        }
    }, [chess, updatePiecesFromBoard, userColor, makeComputerMove, skillLevel]);

    const startGame = useCallback(() => {
        setGameStatus("ongoing");
    }, []);

    const changeUserColor = useCallback((color: PieceColor) => {
        setUserColor(color);
        resetGame();
    }, [resetGame]);

    return (
        <ChessContext.Provider
            value={{
                size,
                squareSize,
                totalSize,
                halfSize,
                chess,
                highlightPos,
                squares,
                pieces,
                selectedSquare,
                possibleMoves,
                gameStatus,
                userColor,
                timers,
                skillLevel,
                lastMove,
                commentary,
                moveHistory,
                historyIndex,
                squareToPosition,
                positionToSquare,
                togglePause,
                handleSquareClick,
                startGame,
                setUserColor: changeUserColor,
                setHighlightPos,
                setSkillLevel,
                resetGame,
                undoMove,
            }}
        >
            {children}
        </ChessContext.Provider>
    );
}
