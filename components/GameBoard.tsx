import React from 'react';
import { BoardState, Player, PlayerProfile } from '../types';
import { X, Circle } from 'lucide-react';
import { motion } from 'motion/react';

interface GameBoardProps {
  board: BoardState;
  onCellClick: (index: number) => void;
  winningLine: number[] | null;
  currentTurn: Player;
  playerX: PlayerProfile;
  playerO: PlayerProfile;
  winner: Player | 'Draw' | null;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onCellClick,
  winningLine,
  currentTurn,
  playerX,
  playerO,
  winner,
}) => {
  return (
    <div className="relative w-full flex flex-col items-center">
      <div 
        id="game-board-container"
        className="w-full max-w-[340px] sm:max-w-[400px] aspect-square p-4 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl"
      >
        <div className="grid grid-cols-3 grid-rows-3 gap-3 w-full h-full">
          {board.map((cell, index) => {
            const isWinningCell = winningLine?.includes(index);
            const isEmpty = cell === null;

            return (
              <button
                id={`grid-cell-${index}`}
                key={index}
                onClick={() => onCellClick(index)}
                disabled={!isEmpty || !!winner}
                className={`relative flex items-center justify-center rounded-2xl bg-slate-800/40 transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                  isEmpty && !winner
                    ? 'cursor-pointer hover:bg-slate-700/50 hover:border-slate-500/50 hover:scale-[1.02] active:scale-95 group'
                    : 'cursor-default'
                } ${
                  isWinningCell
                    ? 'winning-cell border-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] bg-white/10'
                    : 'border border-slate-700/30 shadow-sm'
                }`}
              >
                {/* Visual content for cell */}
                {cell === 'X' && (
                  <motion.div
                    id={`cell-marker-x-${index}`}
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="flex items-center justify-center x-piece"
                  >
                    <X className="w-12 h-12 md:w-16 md:h-16 stroke-[2.5]" />
                  </motion.div>
                )}

                {cell === 'O' && (
                  <motion.div
                    id={`cell-marker-o-${index}`}
                    initial={{ scale: 0, rotate: 45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="flex items-center justify-center o-piece"
                  >
                    <Circle className="w-10 h-10 md:w-14 md:h-14 stroke-[2.5]" />
                  </motion.div>
                )}

                {/* Hover suggestion guide for next player */}
                {isEmpty && !winner && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-15 transition-opacity duration-150">
                    {currentTurn === 'X' ? (
                      <X className="w-10 h-10 text-cyan-400 stroke-[2]" />
                    ) : (
                      <Circle className="w-8 h-8 text-rose-400 stroke-[2]" />
                    )}
                  </div>
                )}
                
                {/* Decorative winning splash shimmer */}
                {isWinningCell && (
                  <span className="absolute inset-0 bg-white/5 animate-pulse rounded-2xl" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
