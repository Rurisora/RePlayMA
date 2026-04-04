import { Piece } from "../src/types/chess";

export const movePiece = (
  board: (Piece | null)[][],
  from: [number, number],
  to: [number, number],
) => {
  const newBoard = board.map((row) => [...row]);

  const piece = newBoard[from[0]][from[1]];
  newBoard[to[0]][to[1]] = piece;
  newBoard[from[0]][from[1]] = null;

  return newBoard;
};
