import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");   // 👈 NEW
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("username");
    if (saved) setUsername(saved);
  }, []);

  const createGame = () => {
    if (!username.trim()) {
      setError("Please enter a display name");
      return;
    }

    localStorage.setItem("username", username);
    setError("");

    const code = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    navigate(`/wait/${code}`);
  };

  const joinGame = () => {
    if (!username.trim()) {
      setError("Please enter a display name");
      return;
    }

    if (!roomCode.trim()) {
      setError("Please enter a room code");
      return;
    }

    localStorage.setItem("username", username);
    setError("");

    navigate(`/wait/${roomCode.trim().toUpperCase()}`);
  };

  return (
    <div className="home">
      <div className="home-card">
        <h1 className="home-title">Code Arena</h1>
        <p className="home-subtitle">1v1 Competitive Coding</p>

        <input
          className="home-input"
          placeholder="Enter display name"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError(""); // 👈 clear error on typing
          }}
        />

        <input
          className="home-input"
          placeholder="Enter room code"
          value={roomCode}
          onChange={(e) => {
            setRoomCode(e.target.value);
            setError("");
          }}
        />

        {/* INLINE ERROR */}
        {error && (
          <div className="home-error">
            ⚠️ {error}
          </div>
        )}

        <div className="home-buttons">
          <button className="btn primary" onClick={createGame}>
            Create Game
          </button>

          <button className="btn secondary" onClick={joinGame}>
            Join Game
          </button>
        </div>
      </div>
    </div>
  );
}
