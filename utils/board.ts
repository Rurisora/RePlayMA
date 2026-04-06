import { Piece } from "./chessTypes";

export const createInitialBoard = (): (Piece | null)[][] => {
  const emptyRow = Array(8).fill(null);

  return [
    // Black pieces
    [
      { type: "rook", color: "black" },
      { type: "knight", color: "black" },
      { type: "bishop", color: "black" },
      { type: "queen", color: "black" },
      { type: "king", color: "black" },
      { type: "bishop", color: "black" },
      { type: "knight", color: "black" },
      { type: "rook", color: "black" },
    ],
    Array(8).fill({ type: "pawn", color: "black" }),

    emptyRow,
    emptyRow,
    emptyRow,
    emptyRow,

    Array(8).fill({ type: "pawn", color: "white" }),

    [
      { type: "rook", color: "white" },
      { type: "knight", color: "white" },
      { type: "bishop", color: "white" },
      { type: "queen", color: "white" },
      { type: "king", color: "white" },
      { type: "bishop", color: "white" },
      { type: "knight", color: "white" },
      { type: "rook", color: "white" },
    ],
  ];
};
