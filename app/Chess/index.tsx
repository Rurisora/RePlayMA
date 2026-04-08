import { useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { createNewGameState } from "../../utils/chessLogic";
import { loadChessGame, saveChessGame } from "../../utils/chessStorage";
import type { ChessGameState } from "../../utils/chessTypes";

export default function ChessMenuScreen() {
  const router = useRouter();

  const handleNewGame = async () => {
    const newGame = createNewGameState() as unknown as ChessGameState;
    await saveChessGame(newGame);
    router.push("/Chess/chessGame");
  };

  const handleContinue = async () => {
    const savedGame = await loadChessGame();

    if (!savedGame) {
      Alert.alert("No saved game found", "Starting new game.");
      const newGame = createNewGameState() as unknown as ChessGameState;
      await saveChessGame(newGame);
    }

    router.push("/Chess/chessGame");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chess Game Screen</Text>

      <Pressable style={styles.blueButton} onPress={handleNewGame}>
        <Text style={styles.buttonText}>NEW GAME</Text>
      </Pressable>

      <Pressable style={styles.blueButton} onPress={handleContinue}>
        <Text style={styles.buttonText}>CONTINUE</Text>
      </Pressable>

      <Pressable style={styles.blueButton} onPress={() => router.push("/")}>
        <Text style={styles.buttonText}>BACK TO HOME</Text>
      </Pressable>
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
    fontSize: 18,
    marginBottom: 12,
    color: "#222",
  },
  blueButton: {
    backgroundColor: "#6c8cd5",
    padding: 12,
    width: 200,
    alignItems: "center",
    marginVertical: 6,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
