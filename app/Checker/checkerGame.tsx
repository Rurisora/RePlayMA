import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import {
  createNewGameState,
  formatTime,
  getAllowedMovesForPiece,
  getJumpMoves,
  getNextPlayer,
  getWinner,
  movePiece,
} from "../../utils/checkerLogic";
import { loadCheckerGame, saveCheckerGame } from "../../utils/checkerStorage";
import { CheckerGameState, Move, Position, Square } from "../../utils/checkerTypes";

export default function CheckerGameScreen() {
  const router = useRouter();
  const [gameState, setGameState] = useState<CheckerGameState>(createNewGameState());
  const [loading, setLoading] = useState(true);
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [mustContinueJump, setMustContinueJump] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  useEffect(() => {
    const loadGame = async () => {
      const savedGame = await loadCheckerGame();

      if (savedGame) {
        setGameState(savedGame);
      } else {
        const newGame = createNewGameState();
        setGameState(newGame);
        await saveCheckerGame(newGame);
      }

      setLoading(false);
    };

    loadGame();
  }, []);

  useEffect(() => {
    if (loading || gameState.winner) return;

    const timer = setInterval(() => {
      setGameState((prev) => ({
        ...prev,
        elapsedSeconds: prev.elapsedSeconds + 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, gameState.winner]);

  useEffect(() => {
    if (loading) return;
    saveCheckerGame(gameState);
  }, [gameState, loading]);

  useEffect(() => {
    if (gameState.winner) {
      setShowWinnerModal(true);
    }
  }, [gameState.winner]);

  const resetSelection = () => {
    setSelectedPiece(null);
    setValidMoves([]);
    setMustContinueJump(false);
  };

  const handleSquarePress = (square: Square) => {
    if (loading || gameState.winner) return;

    const tappedMove = validMoves.find(
      (move) => move.row === square.row && move.col === square.col,
    );

    if (selectedPiece && tappedMove) {
      const updatedBoard = movePiece(gameState.board, selectedPiece, tappedMove);

      if (tappedMove.isJump) {
        const nextPosition = { row: tappedMove.row, col: tappedMove.col };
        const nextJumpMoves = getJumpMoves(updatedBoard, nextPosition);

        if (nextJumpMoves.length > 0) {
          setGameState((prev) => {
            const winner = getWinner(updatedBoard);

            return {
              ...prev,
              board: updatedBoard,
              winner,
            };
          });

          setSelectedPiece(nextPosition);
          setValidMoves(nextJumpMoves);
          setMustContinueJump(true);
          return;
        }
      }

      setGameState((prev) => {
        const nextPlayer = getNextPlayer(prev.currentPlayer);
        const winner = getWinner(updatedBoard);

        return {
          ...prev,
          board: updatedBoard,
          currentPlayer: nextPlayer,
          winner,
        };
      });

      resetSelection();
      return;
    }

    if (mustContinueJump) {
      return;
    }

    if (square.piece && square.piece.color === gameState.currentPlayer) {
      const piecePosition = { row: square.row, col: square.col };
      const allowedMoves = getAllowedMovesForPiece(
        gameState.board,
        piecePosition,
        gameState.currentPlayer,
      );

      setSelectedPiece(piecePosition);
      setValidMoves(allowedMoves);
      return;
    }

    resetSelection();
  };

  const handleNewGame = async () => {
    const newGame = createNewGameState();
    setGameState(newGame);
    resetSelection();
    setShowWinnerModal(false);
    await saveCheckerGame(newGame);
  };

  const handleQuit = async () => {
    await saveCheckerGame(gameState);
    setShowWinnerModal(false);
    router.back();
  };

  const isSelected = (row: number, col: number) =>
    selectedPiece?.row === row && selectedPiece?.col === col;

  const isValidMoveSquare = (row: number, col: number) =>
    validMoves.some((move) => move.row === row && move.col === col);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading game...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkers Game</Text>
      <Text style={styles.infoText}>
        {gameState.winner
          ? `Winner: ${gameState.winner.toUpperCase()}`
          : `Turn: ${gameState.currentPlayer.toUpperCase()}`}
      </Text>
      <Text style={styles.infoText}>Time: {formatTime(gameState.elapsedSeconds)}</Text>

      {mustContinueJump && !gameState.winner && (
        <Text style={styles.warningText}>You must continue jumping.</Text>
      )}

      <View style={styles.board}>
        {gameState.board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.boardRow}>
            {row.map((square) => (
              <Pressable
                key={`${square.row}-${square.col}`}
                style={[
                  styles.square,
                  square.isDark ? styles.darkSquare : styles.lightSquare,
                  isSelected(square.row, square.col) && styles.selectedSquare,
                  isValidMoveSquare(square.row, square.col) && styles.validMoveSquare,
                ]}
                onPress={() => handleSquarePress(square)}
              >
                {square.piece && (
                  <View
                    style={[
                      styles.piece,
                      square.piece.color === "red"
                        ? styles.redPiece
                        : styles.blackPiece,
                    ]}
                  >
                    {square.piece.king && <Text style={styles.kingText}>K</Text>}
                  </View>
                )}

                {!square.piece && isValidMoveSquare(square.row, square.col) && (
                  <View style={styles.moveDot} />
                )}
              </Pressable>
            ))}
          </View>
        ))}
      </View>

      <Pressable style={styles.button} onPress={handleNewGame}>
        <Text style={styles.buttonText}>NEW GAME</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handleQuit}>
        <Text style={styles.buttonText}>QUIT</Text>
      </Pressable>

      <Modal
        visible={showWinnerModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWinnerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={handleNewGame}>
              <Text style={styles.buttonText}>New Game</Text>
            </Pressable>

            <Pressable style={[styles.button, styles.button]} onPress={handleQuit}>
              <Text style={styles.buttonText}>Quit</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efefef",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 16,
    color: "#222",
    marginBottom: 2,
  },
  warningText: {
    fontSize: 14,
    color: "#b00020",
    fontWeight: "600",
    marginBottom: 8,
  },
  board: {
    width: 320,
    height: 320,
    borderWidth: 2,
    borderColor: "black",
    marginTop: 10,
    marginBottom: 20,
  },
  boardRow: {
    flex: 1,
    flexDirection: "row",
  },
  square: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "#111",
  },
  lightSquare: {
    backgroundColor: "#e7e7e7",
  },
  darkSquare: {
    backgroundColor: "#7d7d7d",
  },
  selectedSquare: {
    backgroundColor: "#ffd54f",
  },
  validMoveSquare: {
    backgroundColor: "#bde7ff",
  },
  moveDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1d8fff",
  },
  piece: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  redPiece: {
    backgroundColor: "#d22",
  },
  blackPiece: {
    backgroundColor: "#333",
  },
  kingText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
  },
  buttonContainer: {
  marginTop: 20,
  },
  button: {
    width: 200,
    padding: 12,
    backgroundColor: "#6c8cd5",
    borderRadius: 10,
    marginVertical: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: 280,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#222",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    color: "#222",
    marginBottom: 20,
  },
  modalBlueButton: {
    backgroundColor: "#2ea3ff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 140,
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 2,
  },
  modalRedButton: {
    backgroundColor: "#ff1616",
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 140,
    alignItems: "center",
    borderRadius: 2,
  },
});