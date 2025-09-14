/* eslint-disable @typescript-eslint/no-explicit-any */
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
    const [currentFen, setCurrentFen] = useState<string>("start");

    // Инициализация Chessground
    useEffect(() => {
        if (boardRef.current && !cg) {
            console.log("Initializing Chessground...");
            const chessground = Chessground(boardRef.current, {
                fen:
                    currentFen === "start"
                        ? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                        : currentFen,
                orientation: "white",
                highlight: {
                    lastMove: true,
                },
                drawable: {
                    visible: true,
                    autoShapes: [],
                    brushes: {
                        green: {
                            key: "g",
                            color: "#28A745",
                            opacity: 1,
                            lineWidth: 10,
                        },
                        red: {
                            key: "r",
                            color: "#DC3545",
                            opacity: 1,
                            lineWidth: 10,
                        },
                        blue: {
                            key: "b",
                            color: "#007BFF",
                            opacity: 1,
                            lineWidth: 8,
                        },
                        orange: {
                            key: "o",
                            color: "#FD7E14",
                            opacity: 1,
                            lineWidth: 8,
                        },
                        yellow: {
                            key: "o",
                            color: "#f2ff03ff",
                            opacity: 1,
                            lineWidth: 8,
                        },
                    },
                },
            });
            setCg(chessground);
            console.log("Chessground initialized");
        }

        return () => {
            if (cg) {
                cg.destroy();
            }
        };
    }, []);

    // Обработка изменений PGN/FEN
    useEffect(() => {
        if (!cg) return;

        const game = new Chess();
        let loaded = false;

        try {
            if (pgn) {
                console.log("Loading PGN:", pgn);
                game.loadPgn(pgn);
                loaded = true;
                setCurrentFen(game.fen());
            } else if (fen) {
                if (fen === "start") {
                    game.reset();
                    loaded = true;
                    setCurrentFen(game.fen());
                } else {
                    game.load(fen);
                    loaded = true;
                    setCurrentFen(fen);
                }
            } else {
                // Если нет входных данных, сбрасываем к начальной позиции
                game.reset();
                loaded = true;
                setCurrentFen(game.fen());
            }
        } catch (error) {
            console.error("Error loading position:", error);
            game.reset();
            loaded = true;
            setCurrentFen(game.fen());
        }

        if (loaded) {
            console.log("Position loaded. FEN:", game.fen());

            // Анализируем позицию
            const stats = analyzePosition(game);
            console.log("Analysis results:", stats);
            onPositionChange?.(stats);

            // Устанавливаем позицию на доске
            cg.set({
                fen: game.fen(),
                check: game.isCheck() ? game.turn() : false,
            });

            // Создаем стрелки для взятий и шахов
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const autoShapes: any[] = [];

            // Взятия
            stats.captureMoves.forEach((capture) => {
                autoShapes.push({
                    orig: capture.from,
                    dest: capture.to,
                    brush: capture.color === "w" ? "green" : "red",
                    opacity: 0.6,
                    lineWidth: 10,
                });
            });

            // Шахи
            stats.checkMoves.forEach((check) => {
                autoShapes.push({
                    orig: check.from,
                    dest: check.to,
                    brush: check.color === "w" ? "blue" : "orange",
                    opacity: 0.7,
                    lineWidth: 8,
                });
            });

            console.log("Setting", autoShapes.length, "auto shapes");
            cg.setAutoShapes(autoShapes);

            // Перерисовываем доску
            setTimeout(() => {
                cg.redrawAll();
            }, 50);
        }
    }, [pgn, fen, cg, onPositionChange]);

    return (
        <div className="chess-board-wrapper">
            <div ref={boardRef} className="chess-board" />
        </div>
    );
};

export default ChessBoard;
