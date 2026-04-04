import { useState } from "react";
import { View } from "react-native";
import { movePiece } from "../../utils/chessLogic";
import { createInitialBoard } from "../constants/board";
import Square from "./square";

export default function ChessBoard() {
  const [board, setBoard] = useState(createInitialBoard());
  const [selected, setSelected] = useState<[number, number] | null>(null);

  const handlePress = (row: number, col: number) => {
    if (selected) {
      const newBoard = movePiece(board, selected, [row, col]);
      setBoard(newBoard);
      setSelected(null);
    } else {
      setSelected([row, col]);
    }
  };

  return (
    <View>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: "row" }}>
          {row.map((piece, colIndex) => (
            <Square
              key={colIndex}
              piece={piece}
              isDark={(rowIndex + colIndex) % 2 === 1}
              onPress={() => handlePress(rowIndex, colIndex)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
