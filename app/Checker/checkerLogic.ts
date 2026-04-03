import { Board, CheckerGameState, Piece, Square } from "./checkerTypes";

export function createInitialBoard(): Board {
  const board: Board = [];

  for (let row = 0; row < 8; row++) {
    const currentRow: Square[] = [];

    for (let col = 0; col < 8; col++) {
      const isDark = (row + col) % 2 === 1;
      let piece: Piece | null = null;

      if (isDark && row < 3) {
        piece = {
          color: "black",
          king: false,
        };
      } else if (isDark && row > 4) {
        piece = {
          color: "red",
          king: false,
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

export function createNewGameState(): CheckerGameState {
  return {
    board: createInitialBoard(),
    currentPlayer: "red",
    elapsedSeconds: 0,
  };
}

export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}