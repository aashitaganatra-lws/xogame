import React, { useState, useEffect } from 'react';
import { BoardState, Player, PlayerProfile, MatchHistory } from './types';
import { PlayerConfig } from './components/PlayerConfig';
import { ScoreBoard } from './components/ScoreBoard';
import { GameBoard } from './components/GameBoard';
import { HistoryList } from './components/HistoryList';
import { RefreshCw, RotateCcw, HelpCircle, Trophy, Sparkles, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

const DEFAULT_PLAYER_X: PlayerProfile = {
  name: 'Player X',
  symbol: 'X',
  color: 'bg-cyan-500',
  accentColor: '#22d3ee'
};

const DEFAULT_PLAYER_O: PlayerProfile = {
  name: 'Player O',
  symbol: 'O',
  color: 'bg-rose-500',
  accentColor: '#fb7185'
};

// Simple helper to generate random particles for celebration
interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
}

export default function App() {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState<Player>('X');
  const [startingPlayer, setStartingPlayer] = useState<Player>('X');
  
  const [playerX, setPlayerX] = useState<PlayerProfile>(DEFAULT_PLAYER_X);
  const [playerO, setPlayerO] = useState<PlayerProfile>(DEFAULT_PLAYER_O);
  
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [round, setRound] = useState(1);
  const [history, setHistory] = useState<MatchHistory[]>([]);
  const [showHowTo, setShowHowTo] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Check state to find winner
  let winner: Player | 'Draw' | null = null;
  let winningLine: number[] | null = null;

  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      winner = board[a] as Player;
      winningLine = combo;
      break;
    }
  }

  const isFull = board.every((cell) => cell !== null);
  if (!winner && isFull) {
    winner = 'Draw';
  }

  // Create particles burst when there's a winner
  useEffect(() => {
    if (winner && winner !== 'Draw') {
      const winnerColors = winner === 'X' 
        ? ['#22d3ee', '#67e8f9', '#06b6d4', '#0891b2'] 
        : ['#fb7185', '#fecdd3', '#f43f5e', '#e11d48'];
        
      const newParticles = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100 - 50, // deviation from center
        y: Math.random() * -100 - 50, // upward force
        color: winnerColors[Math.floor(Math.random() * winnerColors.length)],
        size: Math.random() * 8 + 4,
        delay: Math.random() * 0.2,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [winner]);

  // Handle gameplay move
  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    const nextBoard = [...board];
    nextBoard[index] = currentTurn;
    setBoard(nextBoard);

    // Calculate immediate winner with latest board move
    let roundWinner: Player | 'Draw' | null = null;
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (nextBoard[a] && nextBoard[a] === nextBoard[b] && nextBoard[a] === nextBoard[c]) {
        roundWinner = nextBoard[a] as Player;
        break;
      }
    }

    const nextFull = nextBoard.every((cell) => cell !== null);
    if (!roundWinner && nextFull) {
      roundWinner = 'Draw';
    }

    if (roundWinner) {
      // Game has concluded
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const record: MatchHistory = {
        id: Math.random().toString(36).substr(2, 9),
        round,
        winner: roundWinner,
        winnerName: roundWinner === 'X' ? playerX.name : roundWinner === 'O' ? playerO.name : 'Draw',
        timestamp,
      };

      setHistory((prev) => [record, ...prev]);

      if (roundWinner === 'X') {
        setScores((prev) => ({ ...prev, X: prev.X + 1 }));
      } else if (roundWinner === 'O') {
        setScores((prev) => ({ ...prev, O: prev.O + 1 }));
      } else {
        setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      }
    } else {
      // Toggle Turn
      setCurrentTurn(currentTurn === 'X' ? 'O' : 'X');
    }
  };

  // Next Round / Reset Board
  const restartMatch = () => {
    setBoard(Array(9).fill(null));
    const nextStart = startingPlayer === 'X' ? 'O' : 'X';
    setStartingPlayer(nextStart);
    setCurrentTurn(nextStart);
    setRound((prev) => prev + 1);
  };

  // Completely Reset Scoreboard state
  const resetScores = () => {
    setBoard(Array(9).fill(null));
    setCurrentTurn('X');
    setStartingPlayer('X');
    setScores({ X: 0, O: 0, draws: 0 });
    setRound(1);
  };

  const handleUpdatePlayerX = (name: string) => {
    setPlayerX((prev) => ({ ...prev, name }));
  };

  const handleUpdatePlayerO = (name: string) => {
    setPlayerO((prev) => ({ ...prev, name }));
  };

  return (
    <div id="game-root" className="min-h-screen w-full bg-slate-955 flex items-center justify-center p-4 md:p-8 text-slate-200 selection:bg-cyan-950 selection:text-cyan-400">
      <div 
        id="game-panel"
        className="relative w-full max-w-lg bg-slate-900/60 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] p-5 md:p-8 flex flex-col gap-6"
      >
        {/* Title and Top Header bar */}
        <div className="flex items-center justify-between border-b border-slate-800/50 pb-5">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase flex items-center gap-2">
              <Trophy className="w-5.5 h-5.5 text-cyan-400 stroke-[2.5]" />
              Nexus Grid
            </h1>
            <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px] mt-0.5 font-mono">
              Strategic Binary Conflict
            </p>
          </div>
          
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-full border border-slate-850">
            <button
              id="btn-restart-match"
              onClick={restartMatch}
              className="p-2 px-4 rounded-full bg-white text-slate-950 hover:bg-cyan-400 hover:text-slate-950 font-bold uppercase text-[10px] tracking-widest transition-all duration-200 shadow-[0_0_15px_rgba(255,255,255,0.06)] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center gap-1.5 cursor-pointer focus:ring-2 focus:ring-cyan-500"
              title="Next Round"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black tracking-wider hidden sm:inline">Next Round</span>
            </button>
            <button
              id="btn-reset-scores"
              onClick={resetScores}
              className="p-2 rounded-full bg-slate-850 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 hover:border-rose-800/40 transition-all duration-205 border border-slate-800 cursor-pointer"
              title="Reset All Scores"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Player Name Editors */}
        <PlayerConfig
          playerX={playerX}
          playerO={playerO}
          onUpdatePlayerX={handleUpdatePlayerX}
          onUpdatePlayerO={handleUpdatePlayerO}
        />

        {/* Live Score/Turn Banner */}
        <ScoreBoard
          playerX={playerX}
          playerO={playerO}
          scores={scores}
          currentTurn={currentTurn}
          winner={winner}
        />

        {/* 3x3 Game Board Grid */}
        <div className="relative py-2 flex items-center justify-center">
          <GameBoard
            board={board}
            onCellClick={handleCellClick}
            winningLine={winningLine}
            currentTurn={currentTurn}
            playerX={playerX}
            playerO={playerO}
            winner={winner}
          />

          {/* Celebratory Confetti System */}
          <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none overflow-visible flex items-center justify-center">
            <AnimatePresence>
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 30, scale: 0.5, rotate: 0, opacity: 1 }}
                  animate={{ 
                    x: p.x, 
                    y: p.y, 
                    scale: [0.5, 1.2, 0.8], 
                    rotate: Math.random() * 360 + 180, 
                    opacity: [1, 1, 0] 
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 1.6, 
                    ease: "easeOut",
                    delay: p.delay 
                  }}
                  style={{
                    backgroundColor: p.color,
                    width: p.size,
                    height: p.size,
                    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                    position: 'absolute'
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Display Current Winner Floating Alert block natively in card */}
        <AnimatePresence>
          {winner && (
            <motion.div
              id="match-conclusion-alert"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 ${
                winner === 'Draw'
                  ? 'bg-slate-950 border-slate-800 text-slate-400'
                  : winner === 'X'
                    ? 'bg-cyan-950/25 border-cyan-800/40 text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.12)]'
                    : 'bg-rose-950/25 border-rose-800/40 text-rose-100 shadow-[0_0_30px_rgba(251,113,133,0.12)]'
              }`}
            >
              <div className="flex items-center gap-1 text-xs font-black uppercase tracking-widest font-mono">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>Round #{round} Session Finished</span>
              </div>
              <p className="text-sm font-bold">
                {winner === 'Draw' 
                  ? "Binary balance reached (Systems Match Draw)!" 
                  : `${winner === 'X' ? playerX.name : playerO.name} claimed strategic superiority!`}
              </p>
              <button
                id="btn-alert-next-round"
                onClick={restartMatch}
                className={`mt-2 py-2 px-6 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-200 cursor-pointer active:scale-95 ${
                  winner === 'Draw'
                    ? 'bg-slate-800 text-white hover:bg-slate-700'
                    : winner === 'X'
                      ? 'bg-white text-slate-950 hover:bg-cyan-400 hover:scale-105'
                      : 'bg-white text-slate-950 hover:bg-rose-400 hover:scale-105'
                }`}
              >
                Start Next Round
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Log Panel */}
        <HistoryList
          history={history}
          playerX={playerX}
          playerO={playerO}
          onClearHistory={() => setHistory([])}
        />

        {/* Quick Help Footer Toggle */}
        <div className="flex flex-col gap-2 pt-1 border-t border-slate-800/80">
          <button
            id="btn-toggle-rules"
            onClick={() => setShowHowTo(!showHowTo)}
            className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-500 hover:text-slate-350 transition-colors tracking-widest font-mono cursor-pointer self-start"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHowTo ? 'Hide Protocols' : 'Show Protocol Specifications'}</span>
          </button>

          <AnimatePresence>
            {showHowTo && (
              <motion.div
                id="game-rules-card"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-xl text-[10px] text-slate-400 font-mono leading-relaxed flex flex-col gap-2 mt-1">
                  <p>
                    <strong>Turn-Based System:</strong> Player X (Alpha) and Player O (Omega) alternate moves placing their marks inside the 3x3 grid cells. Either terminal name can be configured at any time.
                  </p>
                  <p>
                    <strong>Balanced Rounds:</strong> In order to maintain absolute balance in binary combat, the player who starts the match alternates with each consecutive round.
                  </p>
                  <p>
                    <strong>Winning Constraint:</strong> Round finishes immediately when any node successfully places 3 continuous marks in any horizontal, vertical, or diagonal line.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
