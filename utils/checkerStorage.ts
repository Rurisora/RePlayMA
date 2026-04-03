import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckerGameState } from "./checkerTypes";

const CHECKER_GAME_KEY = "checker_game_state";

export async function saveCheckerGame(state: CheckerGameState) {
  try {
    await AsyncStorage.setItem(CHECKER_GAME_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save checker game:", error);
  }
}

export async function loadCheckerGame(): Promise<CheckerGameState | null> {
  try {
    const savedGame = await AsyncStorage.getItem(CHECKER_GAME_KEY);

    if (!savedGame) {
      return null;
    }

    return JSON.parse(savedGame) as CheckerGameState;
  } catch (error) {
    console.error("Failed to load checker game:", error);
    return null;
  }
}

export async function clearCheckerGame() {
  try {
    await AsyncStorage.removeItem(CHECKER_GAME_KEY);
  } catch (error) {
    console.error("Failed to clear checker game:", error);
  }
}