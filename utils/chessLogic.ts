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

import { StyleSheet } from "react-native";

/* ================= TYPES ================= */

type PieceColor = "white" | "black";
type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";

type Piece = {
  type: PieceType;
  color: PieceColor;
};

type Square = {
  row: number;
  col: number;
  isDark: boolean;
  piece: Piece | null;
};

export function createInitialBoard(): Board {
  const board: Board = [];

  const backRow: Piece["type"][] = [
    "rook",
    "knight",
    "bishop",
    "queen",
    "king",
    "bishop",
    "knight",
    "rook",
  ];

  for (let row = 0; row < 8; row++) {
    const currentRow: Square[] = [];

    for (let col = 0; col < 8; col++) {
      const isDark = (row + col) % 2 === 1;
      let piece: Piece | null = null;

      // 🔵 Black pieces (top)
      if (row === 0) {
        piece = {
          type: backRow[col],
          color: "black",
        };
      } else if (row === 1) {
        piece = {
          type: "pawn",
          color: "black",
        };
      }

      // ⚪ White pieces (bottom)
      else if (row === 6) {
        piece = {
          type: "pawn",
          color: "white",
        };
      } else if (row === 7) {
        piece = {
          type: backRow[col],
          color: "white",
        };
      }

      currentRow.push({
        row,
        col,
        isDark,
        piece,
      });
    }

    board.push(currentRow);
  }

  return board;
}

export function createNewGameState(): ChessGameState {
  return {
    board: createInitialBoard(),
    currentPlayer: "white",
    elapsedSeconds: 0,
    winner: null,
  };
}
type Board = Square[][];

type Position = { row: number; col: number };

type Move = {
  row: number;
  col: number;
  captured?: Position;
};

type ChessGameState = {
  board: Board;
  currentPlayer: PieceColor;
  elapsedSeconds: number;
  winner: PieceColor | null;
};

/* ================= INITIAL BOARD ================= */

function createBoard(): Board {
  const board: Board = [];
  const back = [
    "rook",
    "knight",
    "rook",
    "knight",
    "rook",
    "knight",
    "rook",
    "knight",
  ];

  for (let r = 0; r < 8; r++) {
    const row: Square[] = [];

    for (let c = 0; c < 8; c++) {
      let piece: Piece | null = null;

      if (r === 0) piece = { type: back[c] as any, color: "black" };
      else if (r === 1) piece = { type: "pawn", color: "black" };
      else if (r === 6) piece = { type: "pawn", color: "white" };
      else if (r === 7) piece = { type: back[c] as any, color: "white" };

      row.push({
        row: r,
        col: c,
        isDark: (r + c) % 2 === 1,
        piece,
      });
    }

    board.push(row);
  }

  return board;
}

/* ================= UTIL ================= */

function cloneBoard(board: Board): Board {
  return board.map((row) =>
    row.map((s) => ({
      ...s,
      piece: s.piece ? { ...s.piece } : null,
    })),
  );
}

/* ================= MOVE LOGIC ================= */

function getPawnMoves(board: Board, pos: Position, piece: Piece): Move[] {
  const moves: Move[] = [];
  const dir = piece.color === "white" ? -1 : 1;

  const r = pos.row + dir;

  if (board[r]?.[pos.col] && !board[r][pos.col].piece) {
    moves.push({ row: r, col: pos.col });
  }

  for (let dc of [-1, 1]) {
    const c = pos.col + dc;
    if (board[r]?.[c]?.piece && board[r][c].piece!.color !== piece.color) {
      moves.push({ row: r, col: c, captured: { row: r, col: c } });
    }
  }

  return moves;
}

function getRookMoves(board: Board, pos: Position, piece: Piece): Move[] {
  const moves: Move[] = [];
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  for (let [dr, dc] of dirs) {
    let r = pos.row + dr;
    let c = pos.col + dc;

    while (board[r]?.[c]) {
      if (!board[r][c].piece) {
        moves.push({ row: r, col: c });
      } else {
        if (board[r][c].piece!.color !== piece.color) {
          moves.push({ row: r, col: c, captured: { row: r, col: c } });
        }
        break;
      }
      r += dr;
      c += dc;
    }
  }

  return moves;
}

function getKnightMoves(board: Board, pos: Position, piece: Piece): Move[] {
  const moves: Move[] = [];
  const offsets = [
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2],
  ];

  for (let [dr, dc] of offsets) {
    const r = pos.row + dr;
    const c = pos.col + dc;

    if (!board[r]?.[c]) continue;

    if (!board[r][c].piece || board[r][c].piece!.color !== piece.color) {
      moves.push({
        row: r,
        col: c,
        captured: board[r][c].piece ? { row: r, col: c } : undefined,
      });
    }
  }

  return moves;
}

function getMoves(board: Board, pos: Position): Move[] {
  const piece = board[pos.row][pos.col].piece;
  if (!piece) return [];

  if (piece.type === "pawn") return getPawnMoves(board, pos, piece);
  if (piece.type === "rook") return getRookMoves(board, pos, piece);
  if (piece.type === "knight") return getKnightMoves(board, pos, piece);

  return [];
}

/* ================= UI ================= */

const symbols: any = {
  white: { pawn: "♙", rook: "♖", knight: "♘" },
  black: { pawn: "♟", rook: "♜", knight: "♞" },
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  square: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  piece: {
    fontSize: 28,
  },
});
