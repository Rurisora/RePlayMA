import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../utils/colors";
import AppButton from "../components/appButton";
import ChessBoard from "../components/chessBoard";

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chess for Thinker</Text>
      <Text style={styles.subtitle}>Enjoy your games</Text>

      <ChessBoard />

      <AppButton title="New Game" onPress={() => navigation.navigate("Game")} />
      <AppButton title="Continue Game" onPress={() => {}} />
      <AppButton title="Difficulty: Normal" onPress={() => {}} />

      <Text style={styles.other}>Other Games</Text>

      <View style={styles.gamesRow}>
        <View style={styles.gameCard}>
          <Text>Checker</Text>
        </View>
        <View style={styles.gameCard}>
          <Text>Sudoku</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.bg,
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
  },
  subtitle: {
    color: COLORS.lightText,
    marginBottom: 10,
  },
  other: {
    marginTop: 20,
    fontWeight: "600",
  },
  gamesRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  gameCard: {
    width: 120,
    height: 120,
    backgroundColor: "#ddd",
    margin: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
