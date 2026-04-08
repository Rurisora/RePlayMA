"use client";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { createNewGameState } from "../../utils/chessLogic";
import { saveChessGame } from "../../utils/chessStorage";
import { ChessGameState, Square } from "../../utils/chessTypes";

// Types
type Piece = {
  type: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
  color: "white" | "black";
};

type Position = { row: number; col: number };
type Move = { row: number; col: number };

type GameState = {
  board: Square[][];
  currentPlayer: "white" | "black";
  winner: string | null;
};

const createBoard = (): Square[][] => {
  const board: Square[][] = [];

  for (let r = 0; r < 8; r++) {
    const row: Square[] = [];
    for (let c = 0; c < 8; c++) {
      row.push({
        row: r,
        col: c,
        piece: null,
        isDark: (r + c) % 2 === 1,
      });
    }
    board.push(row);
  }

  const backRow = [
    "rook",
    "knight",
    "bishop",
    "queen",
    "king",
    "bishop",
    "knight",
    "rook",
  ];

  // black
  for (let i = 0; i < 8; i++) {
    board[0][i].piece = { type: backRow[i] as any, color: "black" };
    board[1][i].piece = { type: "pawn", color: "black" };
  }

  // white
  for (let i = 0; i < 8; i++) {
    board[6][i].piece = { type: "pawn", color: "white" };
    board[7][i].piece = { type: backRow[i] as any, color: "white" };
  }

  return board;
};

const getMoves = (board: Square[][], pos: Position): Move[] => {
  const square = board[pos.row][pos.col];
  if (!square.piece) return [];

  const piece = square.piece;
  const moves: Move[] = [];

  const directions = {
    rook: [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ],
    bishop: [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ],
    queen: [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ],
    knight: [
      [2, 1],
      [2, -1],
      [-2, 1],
      [-2, -1],
      [1, 2],
      [1, -2],
      [-1, 2],
      [-1, -2],
    ],
  };

  // pawn
  if (piece.type === "pawn") {
    const dir = piece.color === "white" ? -1 : 1;
    const startRow = piece.color === "white" ? 6 : 1;

    if (!board[pos.row + dir]?.[pos.col]?.piece) {
      moves.push({ row: pos.row + dir, col: pos.col });

      if (pos.row === startRow && !board[pos.row + 2 * dir]?.[pos.col]?.piece) {
        moves.push({ row: pos.row + 2 * dir, col: pos.col });
      }
    }

    [-1, 1].forEach((dc) => {
      const r = pos.row + dir;
      const c = pos.col + dc;
      if (board[r]?.[c]?.piece && board[r][c].piece!.color !== piece.color) {
        moves.push({ row: r, col: c });
      }
    });
  }

  // rook, bishop, queen
  if (
    piece.type === "rook" ||
    piece.type === "bishop" ||
    piece.type === "queen"
  ) {
    const directionsToUse = directions[piece.type];
    for (let [dr, dc] of directionsToUse) {
      let r = pos.row + dr;
      let c = pos.col + dc;

      while (board[r]?.[c]) {
        if (!board[r][c].piece) {
          moves.push({ row: r, col: c });
        } else {
          if (board[r][c].piece!.color !== piece.color) {
            moves.push({ row: r, col: c });
          }
          break;
        }
        r += dr;
        c += dc;
      }
    }
  }

  // knight
  if (piece.type === "knight") {
    for (let [dr, dc] of directions.knight) {
      const r = pos.row + dr;
      const c = pos.col + dc;
      if (!board[r]?.[c]) continue;

      if (!board[r][c].piece || board[r][c].piece!.color !== piece.color) {
        moves.push({ row: r, col: c });
      }
    }
  }

  // king
  if (piece.type === "king") {
    const kingMoves = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];

    for (let [dr, dc] of kingMoves) {
      const r = pos.row + dr;
      const c = pos.col + dc;

      if (!board[r]?.[c]) continue;

      if (!board[r][c].piece || board[r][c].piece!.color !== piece.color) {
        moves.push({ row: r, col: c });
      }
    }
  }

  return moves;
};

const movePiece = (board: Square[][], from: Position, to: Position) => {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

  newBoard[to.row][to.col].piece = newBoard[from.row][from.col].piece;
  newBoard[from.row][from.col].piece = null;

  return newBoard;
};

const getWinner = (board: Square[][]) => {
  let whiteKing = false;
  let blackKing = false;

  for (let row of board) {
    for (let sq of row) {
      if (sq.piece?.type === "king") {
        if (sq.piece.color === "white") whiteKing = true;
        if (sq.piece.color === "black") blackKing = true;
      }
    }
  }

  if (!whiteKing) return "black";
  if (!blackKing) return "white";
  return null;
};

const symbols: any = {
  white: {
    pawn: "♙",
    rook: "♖",
    knight: "♘",
    bishop: "♗",
    queen: "♕",
    king: "♔",
  },
  black: {
    pawn: "♟",
    rook: "♜",
    knight: "♞",
    bishop: "♝",
    queen: "♛",
    king: "♚",
  },
};

const isSquareAttacked = (
  board: Square[][],
  position: Position,
  byColor: "white" | "black",
): boolean => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const sq = board[r][c];
      if (sq.piece && sq.piece.color === byColor) {
        const moves = getMoves(board, { row: r, col: c });
        if (
          moves.some((m) => m.row === position.row && m.col === position.col)
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

const findKing = (
  board: Square[][],
  color: "white" | "black",
): Position | null => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c].piece;
      if (piece?.type === "king" && piece.color === color) {
        return { row: r, col: c };
      }
    }
  }
  return null;
};

const isKingInCheck = (board: Square[][], color: "white" | "black") => {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;

  const opponent = color === "white" ? "black" : "white";
  return isSquareAttacked(board, kingPos, opponent);
};

const getLegalMoves = (
  board: Square[][],
  pos: Position,
  currentPlayer: "white" | "black",
): Move[] => {
  const pseudoMoves = getMoves(board, pos);

  return pseudoMoves.filter((move) => {
    const newBoard = movePiece(board, pos, move);
    return !isKingInCheck(newBoard, currentPlayer);
  });
};
export default function ChessGameScreen() {
  const [gameState, setGameState] = useState<GameState>({
    board: createBoard(),
    currentPlayer: "white",
    winner: null,
  });

  const [selected, setSelected] = useState<Position | null>(null);
  const [moves, setMoves] = useState<Move[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [mustContinueJump, setMustContinueJump] = useState(false);
  const [time, setTime] = useState(0);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  useEffect(() => {
    if (gameState.winner) setShowModal(true);
  }, [gameState.winner]);

  const handlePress = (sq: Square) => {
    if (gameState.winner) return;

    const validMove = moves.find((m) => m.row === sq.row && m.col === sq.col);

    if (selected && validMove) {
      const newBoard = movePiece(gameState.board, selected, validMove);
      const winner = getWinner(newBoard);

      setGameState({
        board: newBoard,
        currentPlayer: gameState.currentPlayer === "white" ? "black" : "white",
        winner,
      });

      setSelected(null);
      setMoves([]);
      return;
    }

    if (!sq.piece || sq.piece.color !== gameState.currentPlayer) return;

    setSelected({ row: sq.row, col: sq.col });
    setMoves(getMoves(gameState.board, { row: sq.row, col: sq.col }));
  };

  const resetGame = () => {
    setGameState({
      board: createBoard(),
      currentPlayer: "white",
      winner: null,
    });
    setSelected(null);
    setMoves([]);
    setShowModal(false);
  };
  const handleQuit = async () => {
    await saveChessGame(gameState);
    setShowWinnerModal(false);

    router.replace("/");
  };

  const handleNewGame = async () => {
    const newGame = createNewGameState() as unknown as ChessGameState;
    await saveChessGame(newGame);
    router.push("/Chess/chessGame");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>♟ Chess for Thinker</Text>

      <Text style={styles.info}>
        {gameState.winner
          ? `${gameState.winner.toUpperCase()} wins!`
          : `${gameState.currentPlayer}'s turn`}
      </Text>
      <Text style={styles.timer}>Time: {formatTime(time)}</Text>

      <View style={styles.board}>
        {gameState.board.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((sq) => (
              <Pressable
                key={`${sq.row}-${sq.col}`}
                onPress={() => handlePress(sq)}
                style={[
                  styles.square,
                  sq.isDark ? styles.dark : styles.light,
                  selected?.row === sq.row &&
                    selected?.col === sq.col &&
                    styles.selected,
                  moves.some((m) => m.row === sq.row && m.col === sq.col) &&
                    styles.valid,
                ]}
              >
                {sq.piece && (
                  <Text style={styles.piece}>
                    {symbols[sq.piece.color][sq.piece.type]}
                  </Text>
                )}
              </Pressable>
            ))}
          </View>
        ))}
      </View>

      <Pressable style={styles.button} onPress={handleNewGame}>
        <Text style={styles.buttonText}>New Game</Text>
      </Pressable>
      <Pressable style={styles.blackButton} onPress={handleQuit}>
        <Text style={styles.buttonText}>QUIT</Text>
      </Pressable>

      <Modal visible={showModal} transparent>
        <View style={styles.modal}>
          <View style={styles.card}>
            <Text style={styles.title}>Game Over</Text>
            <Text>{gameState.winner} wins!</Text>
            <Pressable style={styles.button} onPress={resetGame}>
              <Text style={styles.buttonText}>Restart</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
  info: { marginBottom: 10 },

  board: {
    width: 320,
    height: 320,
    borderWidth: 4,
    borderColor: "#ef1212",
    borderRadius: 8,
    overflow: "hidden",
  },
  row: { flex: 1, flexDirection: "row" },

  square: { flex: 1, alignItems: "center", justifyContent: "center" },
  light: { backgroundColor: "#eee" },
  dark: { backgroundColor: "#666" },

  selected: { backgroundColor: "#ffd54f" },
  valid: { backgroundColor: "#8bd3ff" },

  piece: { fontSize: 26 },

  button: {
    backgroundColor: "#2ea3ff",
    padding: 10,
    marginTop: 15,
    width: 140,
    alignItems: "center",
    borderRadius: 8,
  },

  buttonText: { color: "#fff", fontWeight: "bold" },

  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000088",
  },
  blackButton: {
    backgroundColor: "#ff1616",
    padding: 10,
    marginTop: 15,
    width: 140,
    alignItems: "center",
    borderRadius: 8,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    borderRadius: 10,
  },
  timer: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
});
