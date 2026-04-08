import { useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { createNewGameState } from "../../utils/checkerLogic";
import { loadCheckerGame, saveCheckerGame } from "../../utils/checkerStorage";

export default function CheckerMenuScreen() {
  const router = useRouter();

  const handleNewGame = async () => {
    const newGame = createNewGameState();
    await saveCheckerGame(newGame);
    router.push("/Checker/checkerGame");
  };

  const handleContinue = async () => {
    const savedGame = await loadCheckerGame();

    if (!savedGame) {
      Alert.alert("No saved game found", "Starting new game.");
      const newGame = createNewGameState();
      await saveCheckerGame(newGame);
    }

    router.push("/Checker/checkerGame");
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const renderPreviewBoard = () => {
    const rows = [];

    for (let row = 0; row < 8; row++) {
      const cols = [];

      for (let col = 0; col < 8; col++) {
        const isDark = (row + col) % 2 === 1;

        let pieceColor: "red" | "black" | null = null;

        if (isDark && row < 3) {
          pieceColor = "black";
        } else if (isDark && row > 4) {
          pieceColor = "red";
        }

        cols.push(
          <View
            key={`${row}-${col}`}
            style={[
              styles.previewSquare,
              isDark ? styles.previewDarkSquare : styles.previewLightSquare,
            ]}
          >
            {pieceColor && (
              <View
                style={[
                  styles.previewPiece,
                  pieceColor === "red"
                    ? styles.previewRedPiece
                    : styles.previewBlackPiece,
                ]}
              />
            )}
          </View>,
        );
      }

      rows.push(
        <View key={row} style={styles.previewRow}>
          {cols}
        </View>,
      );
    }

    return rows;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Checkers</Text>

      <View style={styles.previewBoard}>{renderPreviewBoard()}</View>
      <Text style={styles.subtitle}>Lets play some Canadian Checkers</Text>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleNewGame}>
          <Text style={styles.buttonText}>NEW GAME</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>CONTINUE</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={handleBackToHome}>
          <Text style={styles.buttonText}>BACK TO HOME</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efefef",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: "#333",
    fontWeight: "600",
    marginBottom: 20,
  },
  previewBoard: {
    width: 256,
    height: 256,
    borderWidth: 2,
    borderColor: "black",
    marginBottom: 15,
  },
  previewRow: {
    flex: 1,
    flexDirection: "row",
  },
  previewSquare: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#111",
  },
  previewLightSquare: {
    backgroundColor: "#e7e7e7",
  },
  previewDarkSquare: {
    backgroundColor: "#7d7d7d",
  },
  previewPiece: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  previewRedPiece: {
    backgroundColor: "#d22",
  },
  previewBlackPiece: {
    backgroundColor: "#333",
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    width: 200,
    padding: 12,
    backgroundColor: "#6c8cd5",
    borderRadius: 10,
    marginVertical: 5,
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  subtitle: {
  fontSize: 16,
  fontWeight: "700",
  color: "#111",
  textAlign: "center",
  marginBottom: 4,
  },
});