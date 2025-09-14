import { Chess } from "chess.js";
import type { Square } from "chess.js";

export interface ChessStats {
    whiteCaptures: number;
    blackCaptures: number;
    captureMoves: Array<{
        from: string;
        to: string;
        color: "w" | "b";
        piece: string;
        captured: string;
    }>;
}

export const analyzePosition = (game: Chess): ChessStats => {
    let whiteCaptures = 0;
    let blackCaptures = 0;
    const captureMoves: ChessStats["captureMoves"] = [];

    try {
        // Получаем все возможные ходы в текущей позиции
        const moves = game.moves({ verbose: true });

        console.log("Possible moves in position:", moves);
        console.log("Current FEN:", game.fen());
        console.log("Turn:", game.turn());

        // Анализируем каждый возможный ход
        moves.forEach((move) => {
            // Проверяем, является ли ход взятием
            if (move.captured || move.san.includes("x")) {
                const piece = game.get(move.from as Square);

                if (piece) {
                    const captureInfo = {
                        from: move.from,
                        to: move.to,
                        color: piece.color,
                        piece: piece.type,
                        captured: move.captured || "piece", // если captured нет, но есть 'x' в нотации
                    };

                    captureMoves.push(captureInfo);

                    if (piece.color === "w") {
                        whiteCaptures++;
                    } else {
                        blackCaptures++;
                    }

                    console.log("Capture move found:", captureInfo);
                }
            }
        });
    } catch (error) {
        console.error("Error in analyzePosition:", error);
    }

    console.log("Possible captures:", {
        whiteCaptures,
        blackCaptures,
        captureMoves,
    });
    return { whiteCaptures, blackCaptures, captureMoves };
};

export const analyzeFromPgn = (pgn: string): ChessStats => {
    const game = new Chess();

    try {
        game.loadPgn(pgn);
        return analyzePosition(game);
    } catch (error) {
        console.error("Error loading PGN:", error);
        return { whiteCaptures: 0, blackCaptures: 0, captureMoves: [] };
    }
};

export const analyzeFromFen = (fen: string): ChessStats => {
    const game = new Chess();

    try {
        game.load(fen);
        return analyzePosition(game);
    } catch (error) {
        console.error("Error loading FEN:", error);
        return { whiteCaptures: 0, blackCaptures: 0, captureMoves: [] };
    }
};
