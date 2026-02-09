const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const GAME_DURATION = 15 * 60 * 1000; // 15 minutes

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.get("/", (req, res) => {
  res.redirect("https://codearena-tdxq.onrender.com");
});

/*
roomCode -> {
  players: Map(socketId -> playerName),
  creator: socketId
}
*/
const rooms = new Map();

/*
roomCode -> socketId (winner)
*/
const roomWinners = new Map();

/*
roomCode -> startTime
*/
const roomTimers = new Map();

/* ---------- TEST CASES ---------- */
const testCases = [
  { input: ["flower", "flow", "flight"], output: "fl" },
  { input: ["dog", "racecar", "car"], output: "" },
];

/* ---------- PYTHON JUDGE ---------- */
function runPythonCode(userCode, callback) {
  const fileId = uuidv4();
  const filePath = path.join(__dirname, `${fileId}.py`);

  const wrappedCode = `
from typing import List

${userCode}

def run_tests():
    sol = Solution()
    tests = ${JSON.stringify(testCases)}
    for idx, t in enumerate(tests):
        result = sol.longestCommonPrefix(t["input"])
        if result != t["output"]:
            print(f"FAIL {idx} expected={t['output']} got={result}")
            return
    print("PASS")

run_tests()
`;

  fs.writeFileSync(filePath, wrappedCode);

  exec(`python "${filePath}"`, { timeout: 3000 }, (err, stdout) => {
    fs.unlinkSync(filePath);

    if (err) {
      callback({ correct: false, details: "Runtime Error" });
      return;
    }

    const output = stdout.trim();

    if (output.startsWith("FAIL")) {
      callback({ correct: false, details: output });
    } else if (output === "PASS") {
      callback({ correct: true });
    } else {
      callback({ correct: false, details: "Unknown Error" });
    }
  });
}

/* ---------- SOCKET LOGIC ---------- */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  /* JOIN WAITING ROOM */
  /* GAME STATE QUERY (for late joiners / page reloads) */
socket.on("get-game-state", (roomCode) => {
  const startTime = roomTimers.get(roomCode);

  if (startTime) {
    socket.emit("game-started", {
      startTime,
      duration: GAME_DURATION,
    });
  }
});

  socket.on("join-room", ({ roomCode, playerName }) => {
    socket.join(roomCode);

    if (!rooms.has(roomCode)) {
      rooms.set(roomCode, {
        players: new Map(),
        creator: socket.id, // first joiner = creator
      });
      roomWinners.delete(roomCode);
      roomTimers.delete(roomCode);
    }

    const room = rooms.get(roomCode);
    room.players.set(socket.id, playerName);

    // notify waiting room
    io.in(roomCode).emit("room-update", {
      players: Array.from(room.players.values()),
      creator: room.players.get(room.creator),
    });
  });

  /* CREATOR STARTS GAME */
  socket.on("start-game", (roomCode) => {
    const room = rooms.get(roomCode);
    if (!room) return;

    // only creator can start
    if (socket.id !== room.creator) return;

    if (room.players.size < 2) return;

    const startTime = Date.now();
    roomTimers.set(roomCode, startTime);

    io.in(roomCode).emit("game-started", {
      startTime,
      duration: GAME_DURATION,
    });

    console.log(`Game started in room ${roomCode}`);
  });

  /* SUBMIT CODE */
  socket.on("submit-code", ({ roomCode, code }) => {
    const startTime = roomTimers.get(roomCode);

    if (!startTime || Date.now() - startTime > GAME_DURATION) {
      socket.emit("result", {
        correct: false,
        details: "⏰ Time is up!",
      });
      return;
    }

    if (roomWinners.has(roomCode)) return;

    runPythonCode(code, (result) => {
      if (!result.correct) {
        socket.emit("result", result);
        return;
      }

      roomWinners.set(roomCode, socket.id);

      const winnerName = rooms
        .get(roomCode)
        ?.players.get(socket.id);

      io.in(roomCode).emit("winner", { winnerName });

      console.log(`Winner in ${roomCode}: ${winnerName}`);
    });
  });

  /* DISCONNECT */
  socket.on("disconnect", () => {
    for (const [roomCode, room] of rooms.entries()) {
      if (room.players.has(socket.id)) {
        room.players.delete(socket.id);

        if (room.players.size === 0) {
          rooms.delete(roomCode);
          roomWinners.delete(roomCode);
          roomTimers.delete(roomCode);
        } else {
          io.in(roomCode).emit("room-update", {
            players: Array.from(room.players.values()),
            creator: room.players.get(room.creator),
          });
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
