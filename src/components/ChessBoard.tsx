import React, { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessground } from "chessground";
import type { ChessStats } from "../utils/chessAnalysis";
import { analyzePosition } from "../utils/chessAnalysis";
import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";

interface ChessBoardProps {
    pgn?: string;
    fen?: string;
    onPositionChange?: (stats: ChessStats) => void;
}

const ChessBoard: React.FC<ChessBoardProps> = ({
    pgn,
    fen,
    onPositionChange,
}) => {
    const boardRef = useRef<HTMLDivElement>(null);
    const [cg, setCg] = useState<any>(null);
    const [currentGame, setCurrentGame] = useState<Chess>(new Chess());

    useEffect(() => {
        if (boardRef.current && !cg) {
            const chessground = Chessground(boardRef.current, {
                fen: currentGame.fen(),
                orientation: "white",
                movable: false,
                highlight: {
                    lastMove: true,
                },
            });
            setCg(chessground);
        }

        return () => {
            if (cg) {
                cg.destroy();
            }
        };
    }, []);

    useEffect(() => {
        const game = new Chess();
        let loaded = false;

        try {
            if (pgn) {
                game.loadPgn(pgn);
                loaded = true;
            } else if (fen) {
                if (fen === "start") {
                    game.reset();
                    loaded = true;
                } else {
                    game.load(fen);
                    loaded = true;
                }
            }
        } catch (error) {
            console.error("Error loading position:", error);
            game.reset();
        }

        if (loaded) {
            setCurrentGame(game);
            const stats = analyzePosition(game);
            onPositionChange?.(stats);

            if (cg) {
                cg.set({ fen: game.fen() });

                // Очищаем старые стрелки
                cg.setAutoShapes([]);

                // Добавляем стрелки для возможных взятий
                const autoShapes = stats.captureMoves.map((capture) => ({
                    orig: capture.from,
                    dest: capture.to,
                    brush: capture.color === "w" ? "green" : "red",
                    opacity: 0.6,
                    lineWidth: 8,
                }));

                cg.setAutoShapes(autoShapes);
            }
        }
    }, [pgn, fen, cg, onPositionChange]);

    return (
        <div className="chess-board-wrapper">
            <div ref={boardRef} className="chess-board" />
        </div>
    );
};

export default ChessBoard;
