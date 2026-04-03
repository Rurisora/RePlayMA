import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
    loadCheckerGame,
    saveCheckerGame
} from "../../utils/checkerStorage";
import { createNewGameState, formatTime } from "./checkerLogic";
import { CheckerGameState, Square } from "./checkerTypes";

export default function CheckerGameScreen() {
  const router = useRouter();
  const [gameState, setGameState] = useState<CheckerGameState>(createNewGameState());
  const [loading, setLoading] = useState(true);

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
    if (loading) return;

    const timer = setInterval(() => {
      setGameState((prev) => ({
        ...prev,
        elapsedSeconds: prev.elapsedSeconds + 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    if (loading) return;
    saveCheckerGame(gameState);
  }, [gameState, loading]);

  const handleSquarePress = (square: Square) => {
    console.log("Pressed:", square.row, square.col, square.piece);
  };

  const handleNewGame = async () => {
    const newGame = createNewGameState();
    setGameState(newGame);
    await saveCheckerGame(newGame);
  };

  const handleQuit = async () => {
    await saveCheckerGame(gameState);
    router.back();
  };

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
      <Text style={styles.infoText}>Turn: {gameState.currentPlayer.toUpperCase()}</Text>
      <Text style={styles.infoText}>Time: {formatTime(gameState.elapsedSeconds)}</Text>

      <View style={styles.board}>
        {gameState.board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.boardRow}>
            {row.map((square) => (
              <Pressable
                key={`${square.row}-${square.col}`}
                style={[
                  styles.square,
                  square.isDark ? styles.darkSquare : styles.lightSquare,
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
  blueButton: {
    backgroundColor: "#2ea3ff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 140,
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 2,
    elevation: 3,
  },
  redButton: {
    backgroundColor: "#ff1616",
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 140,
    alignItems: "center",
    borderRadius: 2,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});