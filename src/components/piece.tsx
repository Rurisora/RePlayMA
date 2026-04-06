import React from "react";
import { Text } from "react-native";
import { Piece } from "../../utils/chessTypes";

const symbols: any = {
  white: {
    king: "♔",
    queen: "♕",
    rook: "♖",
    bishop: "♗",
    knight: "♘",
    pawn: "♙",
  },
  black: {
    king: "♚",
    queen: "♛",
    rook: "♜",
    bishop: "♝",
    knight: "♞",
    pawn: "♟",
  },
};

export default function PieceComponent({ piece }: { piece: Piece }) {
  return React.createElement(
    Text,
    { style: { fontSize: 28 } },
    symbols[piece.color][piece.type],
  );
}
