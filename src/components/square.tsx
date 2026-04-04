import React from "react";
import { TouchableOpacity } from "react-native";
import { Piece } from "../types/chess";
import PieceComponent from "./piece";

interface Props {
  piece: Piece | null;
  isDark: boolean;
  onPress: () => void;
}

export default function Square({ piece, isDark, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 45,
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isDark ? "#769656" : "#eeeed2",
      }}
    >
      {piece && <PieceComponent piece={piece} />}
    </TouchableOpacity>
  );
}
