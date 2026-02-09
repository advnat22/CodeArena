import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../socket";
import "./WaitingRoom.css";

const playerName = localStorage.getItem("username");

export default function WaitingRoom() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [justJoined, setJustJoined] = useState(null);

  useEffect(() => {
    socket.emit("join-room", { roomCode, playerName });

    socket.on("room-update", ({ players, creator }) => {
      setPlayers((prev) => {
        if (players.length > prev.length) {
          const newPlayer = players.find(p => !prev.includes(p));
          setJustJoined(newPlayer);
          setTimeout(() => setJustJoined(null), 800);
        }
        return players;
      });

      setIsCreator(creator === playerName);
    });

    socket.on("game-started", () => {
      navigate(`/game/${roomCode}`);
    });

    return () => {
      socket.off("room-update");
      socket.off("game-started");
    };
  }, [roomCode, navigate]);

  const startGame = () => {
    socket.emit("start-game", roomCode);
  };

  return (
    <div className="waiting">
      <div className="waiting-card">
        <h1 className="waiting-title">Waiting Room</h1>

        <p className="room-code">
          Room Code <span>{roomCode}</span>
        </p>

        <div className="players">
          {players.map((p) => (
            <div
              key={p}
              className={`player
                ${p === playerName ? "you" : ""}
                ${p === justJoined ? "joined" : ""}
              `}
            >
              {p}
              {p === playerName && (
                <span className="you-tag">YOU</span>
              )}
            </div>
          ))}
        </div>

        {players.length < 2 && (
          <p className="waiting-text">Waiting for opponent…</p>
        )}

        {isCreator && players.length === 2 && (
          <button className="btn primary pulse" onClick={startGame}>
            ▶ Start Game
          </button>
        )}
      </div>
    </div>
  );
}
