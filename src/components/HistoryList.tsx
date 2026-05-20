import React from 'react';
import { MatchHistory, PlayerProfile } from '../types';
import { Calendar, Trash2, Award } from 'lucide-react';

interface HistoryListProps {
  history: MatchHistory[];
  playerX: PlayerProfile;
  playerO: PlayerProfile;
  onClearHistory: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  playerX,
  playerO,
  onClearHistory,
}) => {
  return (
    <div className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
          System History Protocol log
        </h3>
        {history.length > 0 && (
          <button
            id="btn-clear-history"
            onClick={onClearHistory}
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 transition-colors py-1 px-2.5 rounded-lg hover:bg-rose-950/30 cursor-pointer"
            title="Purge game log"
          >
            <Trash2 className="w-3 h-3" />
            Purge
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="h-24 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl bg-slate-950/40 text-center px-4">
          <p className="text-xs text-slate-500 font-medium">No system match log found</p>
          <p className="text-[10px] text-slate-600 mt-0.5 font-mono">Complete a match sequence to register logs</p>
        </div>
      ) : (
        <div className="max-h-[180px] overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {history.map((match) => {
            const isXWin = match.winner === 'X';
            const isOWin = match.winner === 'O';
            const isDraw = match.winner === 'Draw';

            let badgeBg = 'bg-slate-950/50 text-slate-400 border-slate-800';
            let winnerLabel = 'Draw';

            if (isXWin) {
              badgeBg = 'bg-cyan-950/30 text-cyan-400 border-cyan-800/40';
              winnerLabel = match.winnerName;
            } else if (isOWin) {
              badgeBg = 'bg-rose-950/30 text-rose-400 border-rose-800/40';
              winnerLabel = match.winnerName;
            }

            return (
              <div
                id={`history-item-${match.id}`}
                key={match.id}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800/60 bg-slate-950/40 text-xs hover:bg-slate-900/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[10px] font-bold">
                    #{match.round}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-200">
                      {isDraw ? 'Protocol Draw (Tied)' : `${winnerLabel} won`}
                    </span>
                    <span className="text-[9px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                      <Calendar className="w-2.5 h-2.5" />
                      {match.timestamp}
                    </span>
                  </div>
                </div>

                <div className={`px-2 py-0.5 text-[9px] font-black tracking-wider rounded-md border uppercase ${badgeBg}`}>
                  {isDraw ? 'DRAW' : match.winner}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
