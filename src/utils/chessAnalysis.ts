import { Chess } from "chess.js";
import type { Square } from "chess.js";

export interface ChessStats {
    whiteCaptures: number;
    blackCaptures: number;
    whiteChecks: number;
    blackChecks: number;
    captureMoves: Array<{
        from: string;
        to: string;
        color: "w" | "b";
        piece: string;
        captured: string;
    }>;
    checkMoves: Array<{
        from: string;
        to: string;
        color: "w" | "b";
        piece: string;
    }>;
}

export const analyzePosition = (game: Chess): ChessStats => {
    let whiteCaptures = 0;
    let blackCaptures = 0;
    let whiteChecks = 0;
    let blackChecks = 0;

    const captureMoves: ChessStats["captureMoves"] = [];
    const checkMoves: ChessStats["checkMoves"] = [];

    try {
        // Получаем все возможные ходы в текущей позиции
        const moves = game.moves({ verbose: true });

        console.log("Total possible moves:", moves.length);

        // Анализируем каждый возможный ход
        moves.forEach((move) => {
            const piece = game.get(move.from as Square);

            if (!piece) return;

            // Создаем временную копию игры для проверки
            const tempGame = new Chess(game.fen());

            try {
                const result = tempGame.move(move);

                // Проверяем взятие
                if (result.captured) {
                    captureMoves.push({
                        from: move.from,
                        to: move.to,
                        color: piece.color,
                        piece: piece.type,
                        captured: result.captured,
                    });

                    if (piece.color === "w") {
                        whiteCaptures++;
                    } else {
                        blackCaptures++;
                    }
                }

                // Проверяем шах
                if (tempGame.isCheck()) {
                    checkMoves.push({
                        from: move.from,
                        to: move.to,
                        color: piece.color,
                        piece: piece.type,
                    });

                    if (piece.color === "w") {
                        whiteChecks++;
                    } else {
                        blackChecks++;
                    }
                }
            } catch (error) {
                console.error("Error analyzing move:", move, error);
            }
        });
    } catch (error) {
        console.error("Error in analyzePosition:", error);
    }

    console.log("Captures:", { whiteCaptures, blackCaptures });
    console.log("Checks:", { whiteChecks, blackChecks });

    return {
        whiteCaptures,
        blackCaptures,
        whiteChecks,
        blackChecks,
        captureMoves,
        checkMoves,
    };
};

export const analyzeFromPgn = (pgn: string): ChessStats => {
    const game = new Chess();

    try {
        game.loadPgn(pgn);
        return analyzePosition(game);
    } catch (error) {
        console.error("Error loading PGN:", error);
        return {
            whiteCaptures: 0,
            blackCaptures: 0,
            whiteChecks: 0,
            blackChecks: 0,
            captureMoves: [],
            checkMoves: [],
        };
    }
};

export const analyzeFromFen = (fen: string): ChessStats => {
    const game = new Chess();

    try {
        if (fen === "start") {
            game.reset();
        } else {
            game.load(fen);
        }
        return analyzePosition(game);
    } catch (error) {
        console.error("Error loading FEN:", error);
        return {
            whiteCaptures: 0,
            blackCaptures: 0,
            whiteChecks: 0,
            blackChecks: 0,
            captureMoves: [],
            checkMoves: [],
        };
    }
};
