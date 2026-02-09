import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../socket";
import { problem } from "../problems/lcp";
import "./Game.css";

const playerName = localStorage.getItem("username");

export default function Game() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [code, setCode] = useState(
`class Solution:
    def longestCommonPrefix(self, strs):
        `
  );

  const [winner, setWinner] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [testFeedback, setTestFeedback] = useState(null);

  const timerRef = useRef(null);

  /* JOIN ROOM */
  useEffect(() => {
    setWinner(null);
    setTimeLeft(null);
    setTestFeedback(null);

    socket.emit("join-room", { roomCode, playerName });
    socket.emit("get-game-state", roomCode);
  }, [roomCode]);

  /* TIMER */
  useEffect(() => {
    socket.on("game-started", ({ startTime, duration }) => {
      setTimeLeft(duration - (Date.now() - startTime));
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        const remaining = duration - (Date.now() - startTime);
        setTimeLeft(Math.max(0, remaining));
      }, 1000);
    });

    return () => socket.off("game-started");
  }, []);

  /* WINNER */
  useEffect(() => {
    socket.on("winner", ({ winnerName }) => {
      setWinner(winnerName);
      if (timerRef.current) clearInterval(timerRef.current);
    });

    return () => socket.off("winner");
  }, []);

  /* RESULT */
  useEffect(() => {
    socket.on("result", ({ correct, details }) => {
      if (!correct && details) {
        const match = details.match(/FAIL (\d+) expected=(.*) got=(.*)/);
        if (match) {
          setTestFeedback({
            index: match[1],
            expected: match[2],
            got: match[3],
          });
        } else {
          setTestFeedback({ error: details });
        }
      }
    });

    return () => socket.off("result");
  }, []);

  const submitCode = () => {
    setTestFeedback(null);
    socket.emit("submit-code", { roomCode, code });
  };

  const formatTime = () => {
    if (timeLeft === null) return "WAITING";
    const m = Math.floor(timeLeft / 60000);
    const s = Math.floor((timeLeft % 60000) / 1000);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="topbar">
        <div className={`info-box timer-box ${timeLeft < 60000 ? "danger" : ""}`}>
          ⏱ {formatTime()}
        </div>

        <div className="info-box room-box">
          ROOM <span>{roomCode}</span>
        </div>

        <button className="home-btn" onClick={() => navigate("/")}>
          ⬅ HOME
        </button>
      </div>

      {/* MAIN */}
      <div className="game">
        <div className="problem">
          <h2>{problem.title}</h2>
          <pre>{problem.description}</pre>
        </div>

        <div className="editor">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={!!winner || timeLeft === 0}
          />

          <button
            className={`submit-btn ${winner ? "disabled" : ""}`}
            onClick={submitCode}
            disabled={!!winner || timeLeft === 0}
          >
            {winner ? "GAME OVER" : "SUBMIT SOLUTION"}
          </button>

          {testFeedback && (
            <div className="testcase">
              {testFeedback.error ? (
                <p>{testFeedback.error}</p>
              ) : (
                <>
                  <p><strong>❌ FAILED TEST #{testFeedback.index}</strong></p>
                  <p><strong>EXPECTED:</strong> {testFeedback.expected}</p>
                  <p><strong>GOT:</strong> {testFeedback.got}</p>
                </>
              )}
            </div>
          )}

          {winner && (
<div className="winner">
  <div className="winner-text">
    👑 {winner} WINS
  </div>

  <button onClick={() => navigate("/")}>
    RETURN HOME
  </button>
</div>

          )}
        </div>
      </div>
    </>
  );
}
