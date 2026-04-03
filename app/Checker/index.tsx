import { useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { loadCheckerGame, saveCheckerGame } from "../../utils/checkerStorage";
import { createNewGameState } from "./checkerLogic";

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checker Game Screen</Text>

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
    backgroundColor: "#2ea3ff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 140,
    alignItems: "center",
    marginVertical: 6,
    borderRadius: 2,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});