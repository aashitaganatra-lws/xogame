export type Player = 'X' | 'O';

export type BoardState = (Player | null)[];

export interface PlayerProfile {
  name: string;
  symbol: Player;
  color: string; // Tailwind color class details
  accentColor: string; // Tailwind hex or utility
}

export interface MatchHistory {
  id: string;
  round: number;
  winner: Player | 'Draw';
  winnerName: string;
  timestamp: string;
}

export interface GameSettings {
  playerX: PlayerProfile;
  playerO: PlayerProfile;
}
