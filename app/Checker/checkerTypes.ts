export type PieceColor = "red" | "black";

export type Piece = {
  color: PieceColor;
  king: boolean;
};

export type Square = {
  row: number;
  col: number;
  isDark: boolean;
  piece: Piece | null;
};

export type Board = Square[][];

export type CheckerGameState = {
  board: Board;
  currentPlayer: PieceColor;
  elapsedSeconds: number;
};