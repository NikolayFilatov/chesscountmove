import React from "react";
import type { ChessStats } from "../utils/chessAnalysis";

interface DebugInfoProps {
    stats: ChessStats;
    pgn: string;
}

export const DebugInfo: React.FC<DebugInfoProps> = ({ stats, pgn }) => {
    return (
        <div
            style={{
                background: "#f0f0f0",
                padding: "10px",
                marginTop: "10px",
                fontSize: "12px",
                maxHeight: "200px",
                overflow: "auto",
            }}
        >
            <h4>Debug Info:</h4>
            <div>PGN: {pgn.substring(0, 100)}...</div>
            <div>White captures: {stats.whiteCaptures}</div>
            <div>Black captures: {stats.blackCaptures}</div>
            <div>Total capture moves: {stats.captureMoves.length}</div>
            <div>
                Capture details:
                {stats.captureMoves.map((capture, index) => (
                    <div key={index}>
                        {capture.moveNumber}.{" "}
                        {capture.color === "w" ? "White" : "Black"}:
                        {capture.piece} {capture.from}→{capture.to} (captured{" "}
                        {capture.captured})
                    </div>
                ))}
            </div>
        </div>
    );
};
