import {
  Board,
  CheckerGameState,
  Move,
  Piece,
  PieceColor,
  Position,
  Square,
} from "./checkerTypes";

export function createInitialBoard(): Board {
  const board: Board = [];

  for (let row = 0; row < 8; row++) {
    const currentRow: Square[] = [];

    for (let col = 0; col < 8; col++) {
      const isDark = (row + col) % 2 === 1;
      let piece: Piece | null = null;

      if (isDark && row < 3) {
        piece = { color: "black", king: false };
      } else if (isDark && row > 4) {
        piece = { color: "red", king: false };
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

export function createNewGameState(): CheckerGameState {
  return {
    board: createInitialBoard(),
    currentPlayer: "red",
    elapsedSeconds: 0,
    winner: null,
  };
}

export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function isInsideBoard(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

export function getPieceDirections(piece: Piece): number[] {
  if (piece.king) return [-1, 1];
  return piece.color === "red" ? [-1] : [1];
}

export function cloneBoard(board: Board): Board {
  return board.map((row) =>
    row.map((square) => ({
      ...square,
      piece: square.piece ? { ...square.piece } : null,
    })),
  );
}

export function shouldPromote(piece: Piece, targetRow: number): boolean {
  if (piece.king) return false;

  return (
    (piece.color === "red" && targetRow === 0) ||
    (piece.color === "black" && targetRow === 7)
  );
}

function getRegularPieceMoves(board: Board, position: Position): Move[] {
  const square = board[position.row][position.col];
  const piece = square.piece;

  if (!piece) return [];

  const moves: Move[] = [];
  const rowDirections = getPieceDirections(piece);

  for (const rowDir of rowDirections) {
    for (const colDir of [-1, 1]) {
      const nextRow = position.row + rowDir;
      const nextCol = position.col + colDir;

      if (!isInsideBoard(nextRow, nextCol)) continue;

      const nextSquare = board[nextRow][nextCol];

      if (!nextSquare.piece) {
        moves.push({
          row: nextRow,
          col: nextCol,
          isJump: false,
        });
        continue;
      }

      if (nextSquare.piece.color !== piece.color) {
        const jumpRow = position.row + rowDir * 2;
        const jumpCol = position.col + colDir * 2;

        if (!isInsideBoard(jumpRow, jumpCol)) continue;

        const jumpSquare = board[jumpRow][jumpCol];

        if (!jumpSquare.piece) {
          moves.push({
            row: jumpRow,
            col: jumpCol,
            isJump: true,
            jumpedPiece: { row: nextRow, col: nextCol },
          });
        }
      }
    }
  }

  return moves;
}

function getFlyingKingMoves(board: Board, position: Position): Move[] {
  const square = board[position.row][position.col];
  const piece = square.piece;

  if (!piece || !piece.king) return [];

  const moves: Move[] = [];
  const directions = [
    { rowDir: -1, colDir: -1 },
    { rowDir: -1, colDir: 1 },
    { rowDir: 1, colDir: -1 },
    { rowDir: 1, colDir: 1 },
  ];

  for (const { rowDir, colDir } of directions) {
    let row = position.row + rowDir;
    let col = position.col + colDir;
    let foundEnemy: Position | null = null;

    while (isInsideBoard(row, col)) {
      const targetSquare = board[row][col];

      if (!targetSquare.piece) {
        if (!foundEnemy) {
          moves.push({
            row,
            col,
            isJump: false,
          });
        } else {
          moves.push({
            row,
            col,
            isJump: true,
            jumpedPiece: foundEnemy,
          });
        }

        row += rowDir;
        col += colDir;
        continue;
      }

      if (targetSquare.piece.color === piece.color) {
        break;
      }

      if (!foundEnemy) {
        foundEnemy = { row, col };
        row += rowDir;
        col += colDir;
        continue;
      }

      break;
    }
  }

  return moves;
}

export function getValidMoves(board: Board, position: Position): Move[] {
  const square = board[position.row][position.col];
  const piece = square.piece;

  if (!piece) return [];

  if (piece.king) {
    return getFlyingKingMoves(board, position);
  }

  return getRegularPieceMoves(board, position);
}

export function getJumpMoves(board: Board, position: Position): Move[] {
  return getValidMoves(board, position).filter((move) => move.isJump);
}

export function playerHasAnyJump(board: Board, player: PieceColor): boolean {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col].piece;

      if (!piece || piece.color !== player) continue;

      const jumps = getJumpMoves(board, { row, col });
      if (jumps.length > 0) return true;
    }
  }

  return false;
}

export function getAllowedMovesForPiece(
  board: Board,
  position: Position,
  currentPlayer: PieceColor,
): Move[] {
  const square = board[position.row][position.col];
  const piece = square.piece;

  if (!piece || piece.color !== currentPlayer) return [];

  const allMoves = getValidMoves(board, position);
  const playerMustJump = playerHasAnyJump(board, currentPlayer);

  if (playerMustJump) {
    return allMoves.filter((move) => move.isJump);
  }

  return allMoves;
}

export function movePiece(board: Board, from: Position, move: Move): Board {
  const newBoard = cloneBoard(board);
  const movingPiece = newBoard[from.row][from.col].piece;

  if (!movingPiece) return newBoard;

  newBoard[from.row][from.col].piece = null;

  const updatedPiece: Piece = shouldPromote(movingPiece, move.row)
    ? { ...movingPiece, king: true }
    : movingPiece;

  newBoard[move.row][move.col].piece = updatedPiece;

  if (move.isJump && move.jumpedPiece) {
    newBoard[move.jumpedPiece.row][move.jumpedPiece.col].piece = null;
  }

  return newBoard;
}

export function getNextPlayer(currentPlayer: PieceColor): PieceColor {
  return currentPlayer === "red" ? "black" : "red";
}

export function countPieces(board: Board, player: PieceColor): number {
  let count = 0;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col].piece;
      if (piece && piece.color === player) {
        count++;
      }
    }
  }

  return count;
}

export function playerHasAnyLegalMove(board: Board, player: PieceColor): boolean {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col].piece;

      if (!piece || piece.color !== player) continue;

      const moves = getAllowedMovesForPiece(board, { row, col }, player);
      if (moves.length > 0) return true;
    }
  }

  return false;
}

export function getWinner(board: Board): PieceColor | null {
  const redPieces = countPieces(board, "red");
  const blackPieces = countPieces(board, "black");

  if (redPieces === 0) return "black";
  if (blackPieces === 0) return "red";

  const redCanMove = playerHasAnyLegalMove(board, "red");
  const blackCanMove = playerHasAnyLegalMove(board, "black");

  if (!redCanMove) return "black";
  if (!blackCanMove) return "red";

  return null;
}