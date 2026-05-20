import React, { useState } from 'react';
import { PlayerProfile } from '../types';
import { Edit2, Check, User } from 'lucide-react';
import { motion } from 'motion/react';

interface PlayerConfigProps {
  playerX: PlayerProfile;
  playerO: PlayerProfile;
  onUpdatePlayerX: (name: string) => void;
  onUpdatePlayerO: (name: string) => void;
}

export const PlayerConfig: React.FC<PlayerConfigProps> = ({
  playerX,
  playerO,
  onUpdatePlayerX,
  onUpdatePlayerO,
}) => {
  const [editingX, setEditingX] = useState(false);
  const [editingO, setEditingO] = useState(false);
  const [nameX, setNameX] = useState(playerX.name);
  const [nameO, setNameO] = useState(playerO.name);

  const saveX = () => {
    if (nameX.trim()) {
      onUpdatePlayerX(nameX.trim());
    } else {
      setNameX(playerX.name);
    }
    setEditingX(false);
  };

  const saveO = () => {
    if (nameO.trim()) {
      onUpdatePlayerO(nameO.trim());
    } else {
      setNameO(playerO.name);
    }
    setEditingO(false);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      {/* Player X Config */}
      <div 
        id="player-config-x"
        className="flex items-center justify-between p-3.5 bg-slate-900/40 border border-slate-800 rounded-2xl shadow-xl hover:border-slate-700/80 transition-colors"
      >
        <div className="flex items-center gap-3 w-full mr-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-950/40 text-cyan-400 font-black text-sm border border-cyan-800/40 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
            X
          </div>
          <div className="flex-1 min-w-0">
            {editingX ? (
              <input
                id="input-player-x"
                type="text"
                maxLength={14}
                value={nameX}
                onChange={(e) => setNameX(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveX()}
                className="w-full text-sm font-semibold text-slate-100 bg-slate-950 border border-slate-700 rounded px-2 py-1 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                autoFocus
              />
            ) : (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-100 truncate">
                  {playerX.name}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider font-mono">Player Alpha</span>
              </div>
            )}
          </div>
        </div>
        
        <button
          id="btn-edit-player-x"
          onClick={editingX ? saveX : () => setEditingX(true)}
          className={`p-1.5 rounded-md hover:bg-slate-800 transition-colors cursor-pointer ${
            editingX ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-400 hover:text-slate-200'
          }`}
          title={editingX ? 'Save Name' : 'Edit Name'}
        >
          {editingX ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Player O Config */}
      <div 
        id="player-config-o"
        className="flex items-center justify-between p-3.5 bg-slate-900/40 border border-slate-800 rounded-2xl shadow-xl hover:border-slate-700/80 transition-colors"
      >
        <div className="flex items-center gap-3 w-full mr-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-rose-950/40 text-rose-400 font-black text-sm border border-rose-800/40 shadow-[0_0_10px_rgba(251,113,133,0.1)]">
            O
          </div>
          <div className="flex-1 min-w-0">
            {editingO ? (
              <input
                id="input-player-o"
                type="text"
                maxLength={14}
                value={nameO}
                onChange={(e) => setNameO(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveO()}
                className="w-full text-sm font-semibold text-slate-100 bg-slate-950 border border-slate-700 rounded px-2 py-1 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                autoFocus
              />
            ) : (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-100 truncate">
                  {playerO.name}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider font-mono">Player Omega</span>
              </div>
            )}
          </div>
        </div>

        <button
          id="btn-edit-player-o"
          onClick={editingO ? saveO : () => setEditingO(true)}
          className={`p-1.5 rounded-md hover:bg-slate-800 transition-colors cursor-pointer ${
            editingO ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-400 hover:text-slate-200'
          }`}
          title={editingO ? 'Save Name' : 'Edit Name'}
        >
          {editingO ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
