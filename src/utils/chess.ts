import { fileLabels, rankLabels } from "@/constants/chess";
import { commentaries } from "@/constants/commentries";
import { ChessBoard, ChessPiece, ChessSquare, PieceColor, PieceType } from "@/types/chess";
import { Chess, Color, Move } from "chess.js";

// Helper to convert chess notation to 3D position
export const convertSquareToPosition = (square: string, squareSize: number, halfSize: number): [number, number, number] => {
    const file = fileLabels.indexOf(square.charAt(0));
    const rank = rankLabels.indexOf(square.charAt(1));

    const x = (file * squareSize) - halfSize + (squareSize / 2);
    const z = (rank * squareSize) - halfSize + (squareSize / 2);
    return [x, 0, z];
}

// Helper to convert 3D position to chess notation
export const convertPositionToSquare = (x: number, z: number, squareSize: number, halfSize: number): string => {
    const file = Math.floor((x + halfSize) / squareSize);
    const rank = Math.floor((z + halfSize) / squareSize);
    return `${fileLabels[file]}${rankLabels[rank]}`;
}

// Generate commentary for a move
export const generateMoveCommentary = (move: Move, chess: Chess, moveHistory: string[]) => {
    // Check for special moves
    if (move.flags.includes("c")) {
        return commentaries.capture.replace(
            "{piece}",
            move.captured === "p"
                ? "pawn"
                : move.captured === "n"
                    ? "knight"
                    : move.captured === "b"
                        ? "bishop"
                        : move.captured === "r"
                            ? "rook"
                            : move.captured === "q"
                                ? "queen"
                                : "piece",
        );
    }
    if (move.flags.includes("e")) {
        return commentaries.enPassant;
    }
    if (move.flags.includes("p")) {
        return commentaries.promotion;
    }
    if (move.flags.includes("k") || move.flags.includes("q")) {
        return commentaries.castling;
    }
    if (chess.inCheck()) {
        return commentaries.check;
    }

    // Opening commentary for first few moves
    if (moveHistory.length < 4) {
        const san = move.san;
        if (moveHistory.length === 0 && san.startsWith("e4")) {
            return commentaries.opening.e4;
        }
        if (moveHistory.length === 0 && san.startsWith("d4")) {
            return commentaries.opening.d4;
        }
        if (moveHistory.length === 0 && san.startsWith("Nf3")) {
            return commentaries.opening.Nf3;
        }
        if (moveHistory.length === 0 && san.startsWith("c4")) {
            return commentaries.opening.c4;
        }
    }

    // Random generic commentary
    const genericComments = commentaries.generic;
    return genericComments[
        Math.floor(Math.random() * genericComments.length)
    ];
}



export const getPieces = (board: ChessBoard, squareSize: number, halfSize: number) => {
    const pieces: ChessPiece[] = [];
    for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
        for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
            const piece = board[rankIndex][fileIndex];
            if (piece) {
                const square = `${fileLabels[fileIndex]}${
                    rankLabels[rankIndex]
                }`;
                pieces.push({
                    id: `${piece.color}-${piece.type}-${square}`,
                    type: piece.type as PieceType,
                    color: piece.color as PieceColor,
                    position: convertSquareToPosition(square, squareSize, halfSize),
                    square,
                });
            }
        }
    }
    return pieces
}

export const getSquares = (size: number, squareSize: number, halfSize: number) => {
    const squares: ChessSquare[] = [];
    for (let rankIndex = 0; rankIndex < size; rankIndex++) {
        for (let fileIndex = 0; fileIndex < size; fileIndex++) {
            const isWhite = (fileIndex + rankIndex) % 2 === 1;
            const file = fileLabels[fileIndex];
            const rank = parseInt(rankLabels[rankIndex]);
            const square = `${file}${rank}`;
            const [x, y, z] = convertSquareToPosition(square, squareSize, halfSize);

            squares.push({
                id: square,
                position: [x, y, z],
                isWhite,
                coords: { file, rank },
                opacity: 1,
            });
        }
    }
    return squares
}

export const getSelectedMove = (moves: Move[], chess: Chess) => {
    let selectedMove;
    const captureMoves = moves.filter((move) =>
                                move.flags.includes("c")
                        );
    const checkMoves = moves.filter((move) => {
        const tempChess = new Chess(chess.fen());
        tempChess.move(move);
        return tempChess.inCheck();
    });

    if (captureMoves.length > 0 && Math.random() < 0.7) {
        selectedMove = captureMoves[
            Math.floor(
                Math.random() * captureMoves.length,
            )
        ];
    } else if (
        checkMoves.length > 0 && Math.random() < 0.6
    ) {
        selectedMove = checkMoves[
            Math.floor(
                Math.random() * checkMoves.length,
            )
        ];
    } else {
        selectedMove =
            moves[Math.floor(Math.random() * moves.length)];
    }
    return selectedMove
}

export const evaluateMove = (move: Move, chess:Chess) => {
    if (!move?.captured) return 0;
    let score = 0;

    // Piece values
    const pieceValues: Record<string, number> = {
        p: 1,
        n: 3,
        b: 3,
        r: 5,
        q: 9,
        k: 0,
    };

    // Add points for captures
    if (move.flags.includes("c")) {
        score += pieceValues[move.captured] * 10;
    }

    // Simulate the move to evaluate the position
    const tempChess = new Chess(chess.fen());
    tempChess.move(move);

    // Add points for checks
    if (tempChess.inCheck()) {
        score += 5;
    }

    // Add points for checkmate
    if (tempChess.isCheckmate()) {
        score += 1000;
    }

    // Avoid stalemate unless winning
    if (tempChess.isStalemate()) {
        score -= 50;
    }

    return score;
};

export const evaluatePosition = (position: Chess, depth: number, color: Color): number => {
    if (depth === 0) {
        let score = 0;

        // Piece values
        const pieceValues: Record<string, number> = {
            p: 1,
            n: 3,
            b: 3,
            r: 5,
            q: 9,
            k: 0,
        };

        // Material count
        const board = position.board();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = board[i][j];
                if (piece) {
                    const value = pieceValues[piece.type];
                    score += piece.color === color
                        ? -value
                        : value;
                }
            }
        }

        // Checkmate is the best outcome
        if (position.isCheckmate()) {
            return position.turn() === color
                ? -1000
                : 1000;
        }

        // Stalemate is neutral
        if (position.isStalemate() || position.isDraw()) {
            return 0;
        }

        return score;
    }

    // Get all possible moves
    const possibleMoves = position.moves({ verbose: true });

    if (possibleMoves.length === 0) {
        return 0;
    }

    let bestScore = -Infinity;

    for (const move of possibleMoves) {
        const tempChess = new Chess(position.fen());
        tempChess.move(move);

        const score = - evaluatePosition(
            tempChess,
            depth - 1,
            color
        );

        if (score > bestScore) {
            bestScore = score;
        }
    }

    return bestScore;
};