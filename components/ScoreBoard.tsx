import React from 'react';
import { Player, PlayerProfile } from '../types';
import { Award } from 'lucide-react';

interface ScoreBoardProps {
  playerX: PlayerProfile;
  playerO: PlayerProfile;
  scores: { X: number; O: number; draws: number };
  currentTurn: Player;
  winner: Player | 'Draw' | null;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  playerX,
  playerO,
  scores,
  currentTurn,
  winner,
}) => {
  const isXTurn = currentTurn === 'X' && !winner;
  const isOTurn = currentTurn === 'O' && !winner;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Turn Indicator Banner */}
      <div 
        id="turn-banner"
        className="w-full py-3 px-4 rounded-2xl border flex items-center justify-center transition-all bg-slate-900/40 border-slate-800 shadow-2xl"
      >
        {winner ? (
          winner === 'Draw' ? (
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-xs font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500 animate-pulse" />
              Draw Match Protocol
            </div>
          ) : (
            <div className="flex items-center gap-2 font-black uppercase tracking-widest text-xs animate-pulse text-emerald-400">
              <Award className="w-4.5 h-4.5 text-emerald-400" />
              <span>
                {winner === 'X' ? playerX.name : playerO.name} [{winner}] Victory Established
              </span>
            </div>
          )
        ) : (
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest font-mono">
            <span className="text-slate-500">Active Protocol:</span>
            <div className="flex items-center gap-1.5">
              <span
                className={`transition-colors duration-300 font-black ${
                  currentTurn === 'X' ? 'text-cyan-400' : 'text-rose-400'
                }`}
              >
                {currentTurn === 'X' ? playerX.name : playerO.name}
              </span>
              <span 
                className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] rounded font-black border ${
                  currentTurn === 'X' 
                    ? 'bg-cyan-950/40 text-cyan-400 border-cyan-800/40' 
                    : 'bg-rose-950/40 text-rose-400 border-rose-800/40'
                }`}
              >
                {currentTurn}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Grid Score Stats */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {/* Player X Stats */}
        <div
          id="score-card-x"
          className={`flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 ${
            isXTurn
              ? 'bg-slate-900 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.15)] ring-1 ring-cyan-500/30'
              : 'bg-slate-900/30 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[70px] sm:max-w-none">
              {playerX.name}
            </span>
          </div>
          <span className="text-3xl mt-1 font-light text-white tracking-tight font-mono">
            {scores.X}
          </span>
          <span className="text-[9px] text-slate-500 mt-0.5 font-bold uppercase tracking-wider">Score Alpha (X)</span>
          {isXTurn && (
            <span className="text-[8px] text-cyan-400 font-black mt-1 tracking-widest uppercase animate-pulse">
              Active
            </span>
          )}
        </div>

        {/* Tie Stats */}
        <div className="flex flex-col items-center p-3 rounded-2xl bg-slate-900/30 border border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ties</span>
          </div>
          <span className="text-3xl mt-1 font-light text-white tracking-tight font-mono">
            {scores.draws}
          </span>
          <span className="text-[9px] text-slate-500 mt-0.5 font-bold uppercase tracking-wider">Combats</span>
        </div>

        {/* Player O Stats */}
        <div
          id="score-card-o"
          className={`flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 ${
            isOTurn
              ? 'bg-slate-900 border-rose-500/50 shadow-[0_0_15px_rgba(251,113,133,0.15)] ring-1 ring-rose-500/30'
              : 'bg-slate-900/30 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[70px] sm:max-w-none">
              {playerO.name}
            </span>
          </div>
          <span className="text-3xl mt-1 font-light text-white tracking-tight font-mono">
            {scores.O}
          </span>
          <span className="text-[9px] text-slate-500 mt-0.5 font-bold uppercase tracking-wider">Score Omega (O)</span>
          {isOTurn && (
            <span className="text-[8px] text-rose-400 font-black mt-1 tracking-widest uppercase animate-pulse">
              Active
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
