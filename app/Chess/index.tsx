import React from "react";
import { View } from "react-native";
import ChessBoard from "../../src/components/chessBoard";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ChessBoard />
    </View>
  );
}
