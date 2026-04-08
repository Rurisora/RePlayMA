// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

// import { createNewGameState, movePiece } from "../../utils/chessLogic";
// import { loadChessGame, saveChessGame } from "../../utils/chessStorage";
// import { ChessGameState, Move, Position } from "../../utils/chessTypes";

// const getMoves = (board: any[][], pos: Position): Move[] => {
//   const square = board[pos.row]?.[pos.col];
//   if (!square || !square.piece) return [];

//   const piece = square.piece;
//   const moves: Move[] = [];

//   const directions = {
//     rook: [
//       [1, 0],
//       [-1, 0],
//       [0, 1],
//       [0, -1],
//     ],
//     knight: [
//       [2, 1],
//       [2, -1],
//       [-2, 1],
//       [-2, -1],
//       [1, 2],
//       [1, -2],
//       [-1, 2],
//       [-1, -2],
//     ],
//   };

//   if (piece.type === "pawn") {
//     const dir = piece.color === "white" ? -1 : 1;
//     const r = pos.row + dir;

//     if (board[r]?.[pos.col] && !board[r][pos.col]?.piece) {
//       moves.push({ row: r, col: pos.col, isJump: false });
//     }

//     for (let dc of [-1, 1]) {
//       const c = pos.col + dc;
//       if (board[r]?.[c]?.piece && board[r][c].piece.color !== piece.color) {
//         moves.push({ row: r, col: c, isJump: false });
//       }
//     }
//   }

//   if (piece.type === "rook") {
//     for (let [dr, dc] of directions.rook) {
//       let r = pos.row + dr;
//       let c = pos.col + dc;

//       while (board[r]?.[c]) {
//         if (!board[r][c]?.piece) {
//           moves.push({ row: r, col: c, isJump: false });
//         } else {
//           if (board[r][c].piece.color !== piece.color) {
//             moves.push({ row: r, col: c, isJump: false });
//           }
//           break;
//         }
//         r += dr;
//         c += dc;
//       }
//     }
//   }

//   if (piece.type === "knight") {
//     for (let [dr, dc] of directions.knight) {
//       const r = pos.row + dr;
//       const c = pos.col + dc;

//       if (!board[r]?.[c]) continue;

//       if (!board[r][c]?.piece || board[r][c].piece.color !== piece.color) {
//         moves.push({ row: r, col: c, isJump: false });
//       }
//     }
//   }

//   return moves;
// };

// const getWinner = (board: any[][]) => {
//   let whiteKing = false;
//   let blackKing = false;

//   for (let row of board) {
//     for (let sq of row) {
//       if (sq?.piece?.type === "king") {
//         if (sq.piece.color === "white") whiteKing = true;
//         if (sq.piece.color === "black") blackKing = true;
//       }
//     }
//   }

//   if (!whiteKing) return "black";
//   if (!blackKing) return "white";
//   return null;
// };

// const symbols: any = {
//   white: {
//     pawn: "♙",
//     rook: "♖",
//     knight: "♘",
//     bishop: "♗",
//     queen: "♕",
//     king: "♔",
//   },
//   black: {
//     pawn: "♟",
//     rook: "♜",
//     knight: "♞",
//     bishop: "♝",
//     queen: "♛",
//     king: "♚",
//   },
// };

// export default function ChessGameScreen() {
//   const router = useRouter();

//   const [gameState, setGameState] =
//     useState<ChessGameState>(createNewGameState());

//   const [loading, setLoading] = useState(true);
//   const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
//   const [validMoves, setValidMoves] = useState<Move[]>([]);
//   const [showWinnerModal, setShowWinnerModal] = useState(false);
//   const [isProcessingMove, setIsProcessingMove] = useState(false);

//   /* LOAD */
//   useEffect(() => {
//     const loadGame = async () => {
//       const saved = await loadChessGame();

//       if (saved) setGameState(saved);
//       else {
//         const newGame = createNewGameState();
//         setGameState(newGame);
//         await saveChessGame(newGame);
//       }

//       setLoading(false);
//     };

//     loadGame();
//   }, []);

//   /* SAVE */
//   useEffect(() => {
//     if (!loading) saveChessGame(gameState);
//   }, [gameState]);

//   /* WIN */
//   useEffect(() => {
//     if (gameState.winner) setShowWinnerModal(true);
//   }, [gameState.winner]);

//   const resetSelection = () => {
//     setSelectedPiece(null);
//     setValidMoves([]);
//   };

//   const handleSquarePress = (square: any) => {
//     if (!square || loading || gameState.winner || isProcessingMove) return;

//     const tappedMove = validMoves.find(
//       (m) => m.row === square.row && m.col === square.col,
//     );

//     if (selectedPiece && tappedMove) {
//       setIsProcessingMove(true);

//       const newBoard = movePiece(
//         gameState.board,
//         [selectedPiece.row, selectedPiece.col],
//         [tappedMove.row, tappedMove.col],
//       );

//       const winner = getWinner(newBoard);

//       const nextPlayer =
//         gameState.currentPlayer === "white" ? "black" : "white";

//       const updatedState = {
//         ...gameState,
//         board: newBoard,
//         currentPlayer: nextPlayer,
//         winner,
//       };

//       setGameState(updatedState);
//       saveChessGame(updatedState);

//       resetSelection();

//       setTimeout(() => setIsProcessingMove(false), 100);
//       return;
//     }

//     if (!square?.piece) return;
//     if (square.piece.color !== gameState.currentPlayer) return;

//     const pos = { row: square.row, col: square.col };
//     setSelectedPiece(pos);
//     setValidMoves(getMoves(gameState.board, pos));
//   };

//   const handleNewGame = async () => {
//     const newGame = createNewGameState();
//     setGameState(newGame);
//     resetSelection();
//     setShowWinnerModal(false);
//     await saveChessGame(newGame);
//   };

//   const handleQuit = async () => {
//     await saveChessGame(gameState);
//     setShowWinnerModal(false);
//     router.back();
//   };

//   const isSelected = (r: number, c: number) =>
//     selectedPiece?.row === r && selectedPiece?.col === c;

//   const isValid = (r: number, c: number) =>
//     validMoves.some((m) => m.row === r && m.col === c);

//   if (loading) return <Text>Loading...</Text>;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Chess Game</Text>

//       <Text style={styles.info}>
//         {gameState.winner
//           ? gameState.winner === "white"
//             ? "Player 1 (White) Wins!"
//             : "Player 2 (Black) Wins!"
//           : gameState.currentPlayer === "white"
//             ? "Player 1 (White)'s Turn"
//             : "Player 2 (Black)'s Turn"}
//       </Text>

//       <View style={styles.board}>
//         {gameState.board.map((row, r) => (
//           <View key={r} style={styles.boardRow}>
//             {row.map((sq: any) => (
//               <Pressable
//                 key={`${sq?.row}-${sq?.col}`}
//                 onPress={() => handleSquarePress(sq)}
//                 style={[
//                   styles.square,
//                   sq?.isDark ? styles.dark : styles.light,
//                   isSelected(sq?.row, sq?.col) && styles.selected,
//                   isValid(sq?.row, sq?.col) && styles.valid,
//                 ]}
//               >
//                 {sq?.piece && (
//                   <Text style={styles.piece}>
//                     {symbols[sq.piece.color][sq.piece.type]}
//                   </Text>
//                 )}
//               </Pressable>
//             ))}
//           </View>
//         ))}
//       </View>

//       <Pressable style={styles.blueButton} onPress={handleNewGame}>
//         <Text style={styles.buttonText}>NEW GAME</Text>
//       </Pressable>

//       <Pressable style={styles.redButton} onPress={handleQuit}>
//         <Text style={styles.buttonText}>QUIT</Text>
//       </Pressable>

//       <Modal visible={showWinnerModal} transparent>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalCard}>
//             <Text style={styles.modalTitle}>Game Over</Text>
//             <Text>
//               {gameState.winner === "white"
//                 ? "Player 1 Wins!"
//                 : "Player 2 Wins!"}
//             </Text>

//             <Pressable style={styles.blueButton} onPress={handleNewGame}>
//               <Text style={styles.buttonText}>NEW GAME</Text>
//             </Pressable>

//             <Pressable style={styles.redButton} onPress={handleQuit}>
//               <Text style={styles.buttonText}>QUIT</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, alignItems: "center", justifyContent: "center" },
//   title: { fontSize: 22, fontWeight: "700" },
//   info: { marginBottom: 10 },

//   board: { width: 320, height: 320, borderWidth: 2 },
//   boardRow: { flex: 1, flexDirection: "row" },

//   square: { flex: 1, alignItems: "center", justifyContent: "center" },
//   light: { backgroundColor: "#eee" },
//   dark: { backgroundColor: "#666" },

//   selected: { backgroundColor: "#ffd54f" },
//   valid: { backgroundColor: "#8bd3ff" },

//   piece: { fontSize: 26 },

//   blueButton: {
//     backgroundColor: "#2ea3ff",
//     padding: 10,
//     marginTop: 10,
//     width: 120,
//     alignItems: "center",
//   },
//   redButton: {
//     backgroundColor: "#ff1616",
//     padding: 10,
//     marginTop: 10,
//     width: 120,
//     alignItems: "center",
//   },

//   buttonText: { color: "#fff" },

//   modalOverlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#00000088",
//   },

//   modalCard: {
//     backgroundColor: "#fff",
//     padding: 20,
//     alignItems: "center",
//   },

//   modalTitle: { fontSize: 22, fontWeight: "700" },
// });

"use client";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { createNewGameState } from "../../utils/chessLogic";
import { saveChessGame } from "../../utils/chessStorage";
import { ChessGameState, Square } from "../../utils/chessTypes";

// Types
type Piece = {
  type: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
  color: "white" | "black";
};

// type Square = {
//   row: number;
//   col: number;
//   piece: Piece | null;
//   isDark: boolean;
// };

type Position = { row: number; col: number };
type Move = { row: number; col: number };

type GameState = {
  board: Square[][];
  currentPlayer: "white" | "black";
  winner: string | null;
};

const createBoard = (): Square[][] => {
  const board: Square[][] = [];

  for (let r = 0; r < 8; r++) {
    const row: Square[] = [];
    for (let c = 0; c < 8; c++) {
      row.push({
        row: r,
        col: c,
        piece: null,
        isDark: (r + c) % 2 === 1,
      });
    }
    board.push(row);
  }

  const backRow = [
    "rook",
    "knight",
    "bishop",
    "queen",
    "king",
    "bishop",
    "knight",
    "rook",
  ];

  // black
  for (let i = 0; i < 8; i++) {
    board[0][i].piece = { type: backRow[i] as any, color: "black" };
    board[1][i].piece = { type: "pawn", color: "black" };
  }

  // white
  for (let i = 0; i < 8; i++) {
    board[6][i].piece = { type: "pawn", color: "white" };
    board[7][i].piece = { type: backRow[i] as any, color: "white" };
  }

  return board;
};

const getMoves = (board: Square[][], pos: Position): Move[] => {
  const square = board[pos.row][pos.col];
  if (!square.piece) return [];

  const piece = square.piece;
  const moves: Move[] = [];

  const directions = {
    rook: [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ],
    bishop: [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ],
    queen: [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ],
    knight: [
      [2, 1],
      [2, -1],
      [-2, 1],
      [-2, -1],
      [1, 2],
      [1, -2],
      [-1, 2],
      [-1, -2],
    ],
  };

  // pawn
  if (piece.type === "pawn") {
    const dir = piece.color === "white" ? -1 : 1;
    const startRow = piece.color === "white" ? 6 : 1;

    if (!board[pos.row + dir]?.[pos.col]?.piece) {
      moves.push({ row: pos.row + dir, col: pos.col });

      if (pos.row === startRow && !board[pos.row + 2 * dir]?.[pos.col]?.piece) {
        moves.push({ row: pos.row + 2 * dir, col: pos.col });
      }
    }

    [-1, 1].forEach((dc) => {
      const r = pos.row + dir;
      const c = pos.col + dc;
      if (board[r]?.[c]?.piece && board[r][c].piece!.color !== piece.color) {
        moves.push({ row: r, col: c });
      }
    });
  }

  // rook, bishop, queen
  if (
    piece.type === "rook" ||
    piece.type === "bishop" ||
    piece.type === "queen"
  ) {
    const directionsToUse = directions[piece.type];
    for (let [dr, dc] of directionsToUse) {
      let r = pos.row + dr;
      let c = pos.col + dc;

      while (board[r]?.[c]) {
        if (!board[r][c].piece) {
          moves.push({ row: r, col: c });
        } else {
          if (board[r][c].piece!.color !== piece.color) {
            moves.push({ row: r, col: c });
          }
          break;
        }
        r += dr;
        c += dc;
      }
    }
  }

  // knight
  if (piece.type === "knight") {
    for (let [dr, dc] of directions.knight) {
      const r = pos.row + dr;
      const c = pos.col + dc;
      if (!board[r]?.[c]) continue;

      if (!board[r][c].piece || board[r][c].piece!.color !== piece.color) {
        moves.push({ row: r, col: c });
      }
    }
  }

  // king
  if (piece.type === "king") {
    const kingMoves = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];

    for (let [dr, dc] of kingMoves) {
      const r = pos.row + dr;
      const c = pos.col + dc;

      if (!board[r]?.[c]) continue;

      if (!board[r][c].piece || board[r][c].piece!.color !== piece.color) {
        moves.push({ row: r, col: c });
      }
    }
  }

  return moves;
};

const movePiece = (board: Square[][], from: Position, to: Position) => {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

  newBoard[to.row][to.col].piece = newBoard[from.row][from.col].piece;
  newBoard[from.row][from.col].piece = null;

  return newBoard;
};

const getWinner = (board: Square[][]) => {
  let whiteKing = false;
  let blackKing = false;

  for (let row of board) {
    for (let sq of row) {
      if (sq.piece?.type === "king") {
        if (sq.piece.color === "white") whiteKing = true;
        if (sq.piece.color === "black") blackKing = true;
      }
    }
  }

  if (!whiteKing) return "black";
  if (!blackKing) return "white";
  return null;
};

const symbols: any = {
  white: {
    pawn: "♙",
    rook: "♖",
    knight: "♘",
    bishop: "♗",
    queen: "♕",
    king: "♔",
  },
  black: {
    pawn: "♟",
    rook: "♜",
    knight: "♞",
    bishop: "♝",
    queen: "♛",
    king: "♚",
  },
};

export default function ChessGameScreen() {
  const [gameState, setGameState] = useState<GameState>({
    board: createBoard(),
    currentPlayer: "white",
    winner: null,
  });

  const [selected, setSelected] = useState<Position | null>(null);
  const [moves, setMoves] = useState<Move[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [mustContinueJump, setMustContinueJump] = useState(false);
  const [time, setTime] = useState(0);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  useEffect(() => {
    if (gameState.winner) setShowModal(true);
  }, [gameState.winner]);

  const handlePress = (sq: Square) => {
    if (gameState.winner) return;

    const validMove = moves.find((m) => m.row === sq.row && m.col === sq.col);

    if (selected && validMove) {
      const newBoard = movePiece(gameState.board, selected, validMove);
      const winner = getWinner(newBoard);

      setGameState({
        board: newBoard,
        currentPlayer: gameState.currentPlayer === "white" ? "black" : "white",
        winner,
      });

      setSelected(null);
      setMoves([]);
      return;
    }

    if (!sq.piece || sq.piece.color !== gameState.currentPlayer) return;

    setSelected({ row: sq.row, col: sq.col });
    setMoves(getMoves(gameState.board, { row: sq.row, col: sq.col }));
  };

  const resetGame = () => {
    setGameState({
      board: createBoard(),
      currentPlayer: "white",
      winner: null,
    });
    setSelected(null);
    setMoves([]);
    setShowModal(false);
  };
  const handleQuit = async () => {
    await saveChessGame(gameState);
    setShowWinnerModal(false);

    router.replace("/");
  };

  const handleNewGame = async () => {
    const newGame = createNewGameState() as unknown as ChessGameState;
    await saveChessGame(newGame);
    router.push("/Chess/chessGame");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>♟ Chess for Thinker</Text>

      <Text style={styles.info}>
        {gameState.winner
          ? `${gameState.winner.toUpperCase()} wins!`
          : `${gameState.currentPlayer}'s turn`}
      </Text>
      <Text style={styles.timer}>Time: {formatTime(time)}</Text>

      <View style={styles.board}>
        {gameState.board.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((sq) => (
              <Pressable
                key={`${sq.row}-${sq.col}`}
                onPress={() => handlePress(sq)}
                style={[
                  styles.square,
                  sq.isDark ? styles.dark : styles.light,
                  selected?.row === sq.row &&
                    selected?.col === sq.col &&
                    styles.selected,
                  moves.some((m) => m.row === sq.row && m.col === sq.col) &&
                    styles.valid,
                ]}
              >
                {sq.piece && (
                  <Text style={styles.piece}>
                    {symbols[sq.piece.color][sq.piece.type]}
                  </Text>
                )}
              </Pressable>
            ))}
          </View>
        ))}
      </View>

      <Pressable style={styles.button} onPress={handleNewGame}>
        <Text style={styles.buttonText}>New Game</Text>
      </Pressable>
      <Pressable style={styles.redButton} onPress={handleQuit}>
        <Text style={styles.buttonText}>QUIT</Text>
      </Pressable>

      <Modal visible={showModal} transparent>
        <View style={styles.modal}>
          <View style={styles.card}>
            <Text style={styles.title}>Game Over</Text>
            <Text>{gameState.winner} wins!</Text>
            <Pressable style={styles.button} onPress={resetGame}>
              <Text style={styles.buttonText}>Restart</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
  info: { marginBottom: 10 },

  board: { width: 320, height: 320 },
  row: { flex: 1, flexDirection: "row" },

  square: { flex: 1, alignItems: "center", justifyContent: "center" },
  light: { backgroundColor: "#eee" },
  dark: { backgroundColor: "#666" },

  selected: { backgroundColor: "#ffd54f" },
  valid: { backgroundColor: "#8bd3ff" },

  piece: { fontSize: 26 },

  button: {
    backgroundColor: "#2ea3ff",
    padding: 10,
    marginTop: 15,
    width: 140,
    alignItems: "center",
    borderRadius: 8,
  },

  buttonText: { color: "#fff", fontWeight: "bold" },

  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000088",
  },
  redButton: {
    backgroundColor: "#ff1616",
    padding: 10,
    marginTop: 15,
    width: 140,
    alignItems: "center",
    borderRadius: 8,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    borderRadius: 10,
  },
  timer: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
});
