import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Room.css";

export default function Room() {
  const [roomCode, setRoomCode] = useState("");
  const [created, setCreated] = useState(false);
  const navigate = useNavigate();

  const handleCreate = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
    setCreated(true);
  };

  const handleJoin = () => {
    if (!roomCode.trim()) {
      alert("Enter room code");
      return;
    }
    navigate(`/game/${roomCode}`);
  };

  const goToGame = () => {
    navigate(`/game/${roomCode}`);
  };

  return (
    <div className="room">
      <div className="room-card">
        <h2 className="room-title">Create or Join Game</h2>

        {!created ? (
          <>
            <button className="btn primary" onClick={handleCreate}>
              Create New Game
            </button>

            <div className="divider">OR</div>

            <input
              className="room-input"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) =>
                setRoomCode(e.target.value.toUpperCase())
              }
            />

            <button className="btn secondary" onClick={handleJoin}>
              Join Game
            </button>
          </>
        ) : (
          <>
            <p className="label">Room Code</p>

            <div className="code-box">
              {roomCode}
            </div>

            <p className="waiting">
              Waiting for opponent to join…
            </p>

            <button className="btn primary pulse" onClick={goToGame}>
              Go to Game
            </button>
          </>
        )}
      </div>
    </div>
  );
}
