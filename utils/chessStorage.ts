import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChessGameState } from "./chessTypes";

const CHESS_GAME_KEY = "chess_game_state";

export async function saveChessGame(state: ChessGameState) {
  try {
    await AsyncStorage.setItem(CHESS_GAME_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save chess game:", error);
  }
}

export async function loadChessGame(): Promise<ChessGameState | null> {
  try {
    const savedGame = await AsyncStorage.getItem(CHESS_GAME_KEY);

    if (!savedGame) {
      return null;
    }

    return JSON.parse(savedGame) as ChessGameState;
  } catch (error) {
    console.error("Failed to load chess game:", error);
    return null;
  }
}

export async function clearChessGame() {
  try {
    await AsyncStorage.removeItem(CHESS_GAME_KEY);
  } catch (error) {
    console.error("Failed to clear chess game:", error);
  }
}
