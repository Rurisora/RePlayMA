import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../utils/colors";
import AppButton from "../components/appButton";
import ChessBoard from "../components/chessBoard";

export default function GameScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chess for Thinker</Text>
      <Text style={styles.subtitle}>Enjoy your games</Text>

      <Text style={styles.info}>Difficulty: Normal</Text>
      <Text style={styles.info}>Time: 1m 32s</Text>

      <ChessBoard />

      <AppButton title="New Game" onPress={() => {}} />
      <AppButton title="Quit" onPress={() => {}} />
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
  },
  subtitle: {
    color: COLORS.lightText,
  },
  info: {
    marginTop: 5,
  },
});
