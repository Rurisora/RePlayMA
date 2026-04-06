import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { createNewGameState, movePiece } from "../../utils/chessLogic";
import { loadChessGame, saveChessGame } from "../../utils/chessStorage";
import { ChessGameState, Move, Position } from "../../utils/chessTypes";

const getMoves = (board: any[][], pos: Position): Move[] => {
  const square = board[pos.row]?.[pos.col];
  if (!square || !square.piece) return [];

  const piece = square.piece;
  const moves: Move[] = [];

  const directions = {
    rook: [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
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

  if (piece.type === "pawn") {
    const dir = piece.color === "white" ? -1 : 1;
    const r = pos.row + dir;

    if (board[r]?.[pos.col] && !board[r][pos.col]?.piece) {
      moves.push({ row: r, col: pos.col, isJump: false });
    }

    for (let dc of [-1, 1]) {
      const c = pos.col + dc;
      if (board[r]?.[c]?.piece && board[r][c].piece.color !== piece.color) {
        moves.push({ row: r, col: c, isJump: false });
      }
    }
  }

  if (piece.type === "rook") {
    for (let [dr, dc] of directions.rook) {
      let r = pos.row + dr;
      let c = pos.col + dc;

      while (board[r]?.[c]) {
        if (!board[r][c]?.piece) {
          moves.push({ row: r, col: c, isJump: false });
        } else {
          if (board[r][c].piece.color !== piece.color) {
            moves.push({ row: r, col: c, isJump: false });
          }
          break;
        }
        r += dr;
        c += dc;
      }
    }
  }

  if (piece.type === "knight") {
    for (let [dr, dc] of directions.knight) {
      const r = pos.row + dr;
      const c = pos.col + dc;

      if (!board[r]?.[c]) continue;

      if (!board[r][c]?.piece || board[r][c].piece.color !== piece.color) {
        moves.push({ row: r, col: c, isJump: false });
      }
    }
  }

  return moves;
};

const getWinner = (board: any[][]) => {
  let whiteKing = false;
  let blackKing = false;

  for (let row of board) {
    for (let sq of row) {
      if (sq?.piece?.type === "king") {
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

export default function ChessGameScreen() {
  const router = useRouter();

  const [gameState, setGameState] =
    useState<ChessGameState>(createNewGameState());

  const [loading, setLoading] = useState(true);
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [isProcessingMove, setIsProcessingMove] = useState(false);

  /* LOAD */
  useEffect(() => {
    const loadGame = async () => {
      const saved = await loadChessGame();

      if (saved) setGameState(saved);
      else {
        const newGame = createNewGameState();
        setGameState(newGame);
        await saveChessGame(newGame);
      }

      setLoading(false);
    };

    loadGame();
  }, []);

  /* SAVE */
  useEffect(() => {
    if (!loading) saveChessGame(gameState);
  }, [gameState]);

  /* WIN */
  useEffect(() => {
    if (gameState.winner) setShowWinnerModal(true);
  }, [gameState.winner]);

  const resetSelection = () => {
    setSelectedPiece(null);
    setValidMoves([]);
  };

  const handleSquarePress = (square: any) => {
    if (!square || loading || gameState.winner || isProcessingMove) return;

    const tappedMove = validMoves.find(
      (m) => m.row === square.row && m.col === square.col,
    );

    if (selectedPiece && tappedMove) {
      setIsProcessingMove(true);

      const newBoard = movePiece(
        gameState.board,
        [selectedPiece.row, selectedPiece.col],
        [tappedMove.row, tappedMove.col],
      );

      const winner = getWinner(newBoard);

      const nextPlayer =
        gameState.currentPlayer === "white" ? "black" : "white";

      const updatedState = {
        ...gameState,
        board: newBoard,
        currentPlayer: nextPlayer,
        winner,
      };

      setGameState(updatedState);
      saveChessGame(updatedState);

      resetSelection();

      setTimeout(() => setIsProcessingMove(false), 100);
      return;
    }

    if (!square?.piece) return;
    if (square.piece.color !== gameState.currentPlayer) return;

    const pos = { row: square.row, col: square.col };
    setSelectedPiece(pos);
    setValidMoves(getMoves(gameState.board, pos));
  };

  const handleNewGame = async () => {
    const newGame = createNewGameState();
    setGameState(newGame);
    resetSelection();
    setShowWinnerModal(false);
    await saveChessGame(newGame);
  };

  const handleQuit = async () => {
    await saveChessGame(gameState);
    setShowWinnerModal(false);
    router.back();
  };

  const isSelected = (r: number, c: number) =>
    selectedPiece?.row === r && selectedPiece?.col === c;

  const isValid = (r: number, c: number) =>
    validMoves.some((m) => m.row === r && m.col === c);

  if (loading) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chess Game</Text>

      <Text style={styles.info}>
        {gameState.winner
          ? gameState.winner === "white"
            ? "Player 1 (White) Wins!"
            : "Player 2 (Black) Wins!"
          : gameState.currentPlayer === "white"
            ? "Player 1 (White)'s Turn"
            : "Player 2 (Black)'s Turn"}
      </Text>

      <View style={styles.board}>
        {gameState.board.map((row, r) => (
          <View key={r} style={styles.boardRow}>
            {row.map((sq: any) => (
              <Pressable
                key={`${sq?.row}-${sq?.col}`}
                onPress={() => handleSquarePress(sq)}
                style={[
                  styles.square,
                  sq?.isDark ? styles.dark : styles.light,
                  isSelected(sq?.row, sq?.col) && styles.selected,
                  isValid(sq?.row, sq?.col) && styles.valid,
                ]}
              >
                {sq?.piece && (
                  <Text style={styles.piece}>
                    {symbols[sq.piece.color][sq.piece.type]}
                  </Text>
                )}
              </Pressable>
            ))}
          </View>
        ))}
      </View>

      <Pressable style={styles.blueButton} onPress={handleNewGame}>
        <Text style={styles.buttonText}>NEW GAME</Text>
      </Pressable>

      <Pressable style={styles.redButton} onPress={handleQuit}>
        <Text style={styles.buttonText}>QUIT</Text>
      </Pressable>

      <Modal visible={showWinnerModal} transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Game Over</Text>
            <Text>
              {gameState.winner === "white"
                ? "Player 1 Wins!"
                : "Player 2 Wins!"}
            </Text>

            <Pressable style={styles.blueButton} onPress={handleNewGame}>
              <Text style={styles.buttonText}>NEW GAME</Text>
            </Pressable>

            <Pressable style={styles.redButton} onPress={handleQuit}>
              <Text style={styles.buttonText}>QUIT</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700" },
  info: { marginBottom: 10 },

  board: { width: 320, height: 320, borderWidth: 2 },
  boardRow: { flex: 1, flexDirection: "row" },

  square: { flex: 1, alignItems: "center", justifyContent: "center" },
  light: { backgroundColor: "#eee" },
  dark: { backgroundColor: "#666" },

  selected: { backgroundColor: "#ffd54f" },
  valid: { backgroundColor: "#8bd3ff" },

  piece: { fontSize: 26 },

  blueButton: {
    backgroundColor: "#2ea3ff",
    padding: 10,
    marginTop: 10,
    width: 120,
    alignItems: "center",
  },
  redButton: {
    backgroundColor: "#ff1616",
    padding: 10,
    marginTop: 10,
    width: 120,
    alignItems: "center",
  },

  buttonText: { color: "#fff" },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000088",
  },

  modalCard: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },

  modalTitle: { fontSize: 22, fontWeight: "700" },
});
