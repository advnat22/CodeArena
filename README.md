<div align="center">
<h1> CodeArena: </h1>

### Compete. Solve. Dominate.

A real-time 1v1 competitive coding platform where two players battle head-to-head to solve algorithmic problems under time pressure. Built with a synchronized multiplayer architecture, backend code execution sandbox, and live winner locking.

**Live Demo:**
https://codearena-wkgs.onrender.com 
</div>

## **Why Code Arena?**

Most coding practice platforms are:

- bloated 
- no timing feature
- single-player only 
- slow to test locally 
- not built for real-time duels 

**Code Arena** focuses on:
- real-time multiplayer
- competitive pressure
- server-authoritative judging
- synchronized timers
- clean distraction-free UI

## **Features**
**1v1 Competitive Rooms:**
- Private room codes
- Creator-controlled match start
- Live player presence tracking
- Automatic winner locking
- No race conditions

**Real-Time Synchronized Timer:**
- 15-minute match duration
- Server-authoritative start time
- Client-side countdown synced to backend
- Timer freezes instantly when winner is declared
- Visual urgency indicator under 60 seconds

**Backend Code Judge (Python Sandbox):**
- Secure server-side execution using child_process
- Temporary isolated Python files
- Automated test case validation
- PASS / FAIL detection
- Runtime error handling
- Test-case specific failure feedback

**Example failure output:**
```
❌ Failed Test Case #1  
Expected: "fl"  
Your Output: "f"
```

**Instant Feedback System:**
- Per-test-case error breakdown
- No page refresh required
- Unlimited submissions within time
- Clear debugging visibility

**Winner Declaration:**
- First player to pass all test cases wins
- Winner broadcast to both players instantly
- Timer pauses automatically
- Game locks after win

**Clean Competitive UI:**
- Dark mode coding interface
- Focused editor layout
- Real-time room status
- Minimal distractions
- Fast interactions

## Tech Stack:
### Frontend:
- React (Vite)
- React Router
- Socket.io Client
- Vanilla CSS (custom styling)
- LocalStorage (username persistence)

### Backend:
- Node.js
- Express.js
- Socket.io (real-time communication)
- child_process (Python execution)
- UUID (sandbox file isolation)

### Code Execution:
- Python 3 runtime
- Wrapped dynamic test runner
- Controlled execution timeout

## Project Structure
```
CodeArena/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── WaitingRoom.jsx
│   │   │   └── Game.jsx
│   │   │   └── Room.jsx
│   │   │   ├── Home.css
│   │   │   ├── WaitingRoom.css
│   │   │   └── Game.css
│   │   │   └── Room.css
│   │   ├── problems/
│   │   │   └── lcp.js
│   │   ├── socket.js
│   │   └── main.jsx
│   └── index.html
│
├── backend/
│   ├── index.js
│   └── dynamic Python sandbox files
│
└── README.md
```

## Design Philosophy
- Server-authoritative state → prevents cheating and desync
- Event + state hybrid model → reliable multiplayer behavior
- Minimal UI → focus on problem-solving
- No authentication (v1) → zero friction competitive access
- Modular expansion-ready architecture

## Current Gameplay Flow:
- Player enters display name
- Create or join room
- Both players enter waiting room
- Creator starts match
- Timer begins
- Players submit unlimited attempts
- First correct solution wins
- Timer freezes
- Game locks

## Future Enhancements
- Larger Questions Dataset
- Multiple rounds per match
- Scoreboard tracking
- Ranked mode
- Multi-language support (C++ / Java)
- Monaco editor integration
- Docker-based sandbox isolation
- Spectator mode
- Leaderboard system

## Author
**Advaith Natarajan** <br>
Computer Engineering @ NTU, Singapore
