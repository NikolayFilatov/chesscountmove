import { useState, useCallback } from "react";
import ChessBoard from "./components/ChessBoard";
import type { ChessStats } from "./utils/chessAnalysis";
import { analyzeFromPgn, analyzeFromFen } from "./utils/chessAnalysis";
import "./App.css";

function App() {
    const [input, setInput] = useState("");
    const [inputType, setInputType] = useState<"pgn" | "fen">("pgn");
    const [stats, setStats] = useState<ChessStats>({
        whiteCaptures: 0,
        blackCaptures: 0,
        whiteChecks: 0,
        blackChecks: 0,
        captureMoves: [],
        checkMoves: [],
    });

    const handleLoad = () => {
        if (!input.trim()) return;

        try {
            let newStats: ChessStats;

            if (inputType === "pgn") {
                newStats = analyzeFromPgn(input);
            } else {
                newStats = analyzeFromFen(input);
            }

            setStats(newStats);
        } catch (error) {
            console.error("Error analyzing:", error);
        }
    };

    const handlePositionChange = useCallback((newStats: ChessStats) => {
        setStats(newStats);
    }, []);

    return (
        <div className="app">
            <div className="main-container">
                <div className="input-section">
                    <div className="input-type">
                        <label>
                            <input
                                type="radio"
                                value="pgn"
                                checked={inputType === "pgn"}
                                onChange={() => setInputType("pgn")}
                            />
                            PGN
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="fen"
                                checked={inputType === "fen"}
                                onChange={() => setInputType("fen")}
                            />
                            FEN
                        </label>
                    </div>

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={
                            inputType === "pgn"
                                ? "Введите PGN партию"
                                : "Введите FEN позицию (например: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1)"
                        }
                        rows={4}
                    />

                    <button onClick={handleLoad}>Анализировать позицию</button>
                </div>

                <div className="content-section">
                    <div className="board-section">
                        <ChessBoard
                            pgn={inputType === "pgn" ? input : undefined}
                            fen={inputType === "fen" ? input : undefined}
                            onPositionChange={handlePositionChange}
                        />
                    </div>

                    <div className="stats-section">
                        <h2>Анализ позиции</h2>
                        <div className="position-info">
                            <div className="turn-info">
                                Сейчас ход:{" "}
                                {stats.captureMoves.length > 0 ||
                                stats.checkMoves.length > 0
                                    ? stats.captureMoves[0]?.color === "w" ||
                                      stats.checkMoves[0]?.color === "w"
                                        ? "белых"
                                        : "черных"
                                    : "не определен"}
                            </div>
                        </div>

                        <div className="capture-info">
                            <div className="legend-grid">
                                <div className="legend-group">
                                    <h4>Взятия:</h4>
                                    <div className="legend-item">
                                        <div className="arrow green-arrow"></div>
                                        <span>Взятия белых</span>
                                    </div>
                                    <div className="legend-item">
                                        <div className="arrow red-arrow"></div>
                                        <span>Взятия черных</span>
                                    </div>
                                </div>

                                <div className="legend-group">
                                    <h4>Шахи:</h4>
                                    <div className="legend-item">
                                        <div className="arrow blue-arrow"></div>
                                        <span>Шахи белых</span>
                                    </div>
                                    <div className="legend-item">
                                        <div className="arrow orange-arrow"></div>
                                        <span>Шахи черных</span>
                                    </div>
                                </div>
                            </div>

                            <div className="stats-grid">
                                <div className="stat-group white-stats">
                                    <h3>Белые</h3>
                                    <div className="stat-item">
                                        <span className="stat-label">
                                            Взятия:
                                        </span>
                                        <span className="stat-value">
                                            {stats.whiteCaptures}
                                        </span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">
                                            Шахи:
                                        </span>
                                        <span className="stat-value">
                                            {stats.whiteChecks}
                                        </span>
                                    </div>
                                </div>

                                <div className="stat-group black-stats">
                                    <h3>Черные</h3>
                                    <div className="stat-item">
                                        <span className="stat-label">
                                            Взятия:
                                        </span>
                                        <span className="stat-value">
                                            {stats.blackCaptures}
                                        </span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">
                                            Шахи:
                                        </span>
                                        <span className="stat-value">
                                            {stats.blackChecks}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
