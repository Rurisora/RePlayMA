import React, { useState } from "react";
import { Text, View } from "react-native";
import { createInitialBoard } from "../../utils/board";
import { movePiece } from "../../utils/chessLogic";
import Square from "./square";

export default function ChessBoard() {
  const [board, setBoard] = useState(createInitialBoard());
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">(
    "white",
  );

  const handlePress = (row: number, col: number) => {
    const square = board[row][col];

    if (selected) {
      const [fromRow, fromCol] = selected;
      const selectedPiece = board[fromRow][fromCol];

      if (!selectedPiece) {
        setSelected(null);
        return;
      }

      if (square && square.color === selectedPiece.color) {
        return;
      }

      const newBoard = movePiece(board, selected, [row, col]);
      setBoard(newBoard);

      setCurrentPlayer((prev) => (prev === "white" ? "black" : "white"));

      setSelected(null);
      return;
    }

    if (!square) return;

    if (square.color !== currentPlayer) return;

    setSelected([row, col]);
  };

  return (
    <View>
      {/* Turn Indicator */}
      <View style={{ alignItems: "center", marginBottom: 10 }}>
        <Text>
          {currentPlayer === "white" ? "Player 1 (White)" : "Player 2 (Black)"}
          's Turn
        </Text>
      </View>

      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: "row" }}>
          {row.map((piece, colIndex) => (
            <Square
              key={colIndex}
              piece={piece}
              isDark={(rowIndex + colIndex) % 2 === 1}
              isSelected={
                selected?.[0] === rowIndex && selected?.[1] === colIndex
              }
              onPress={() => handlePress(rowIndex, colIndex)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
