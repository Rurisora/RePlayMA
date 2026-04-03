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
  winner: PieceColor | null;
};

export type Position = {
  row: number;
  col: number;
};

export type Move = {
  row: number;
  col: number;
  isJump: boolean;
  jumpedPiece?: Position;
};