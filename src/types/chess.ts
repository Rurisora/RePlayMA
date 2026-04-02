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
export interface Square {
  file: string; // a-h
  rank: number; // 1-8
}
