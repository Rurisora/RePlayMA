export type PieceType =
  | "pawn"
  | "knight"
  | "bishop"
  | "rook"
  | "queen"
  | "king";

export type Color = "white" | "black";

export interface Piece {
  type: PieceType;
  color: Color;
}
export type Board = Square[][];

export type ChessGameState = {
  board: Board;
  currentPlayer: Color;
  elapsedSeconds: number;
  winner: Color | null;
};

export interface Square {
  file: string; // a-h
  rank: number; // 1-8
}

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
