import AsyncStorage from "@react-native-async-storage/async-storage";

const GAME_KEY = "sudoku_game";
const BEST_TIME_KEY = "sudoku_best_time";

export const saveGame = async (data: any) => {
    try {
        await AsyncStorage.setItem(GAME_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Error saving game:", e);
    }
}

export const loadGame = async () => {
    try {
        const data = await AsyncStorage.getItem(GAME_KEY);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error("Error loading game:", e);
        return null;
    }
}

export const clearGame = async () => {
    await AsyncStorage.removeItem(GAME_KEY);
}

export const saveBestTime = async (time: number, difficulty: string) => {
    const key = `${BEST_TIME_KEY}_${difficulty}`;
    const existing = await AsyncStorage.getItem(key);

    if (!existing || time < Number(existing)) {
        await AsyncStorage.setItem(key, String(time));
    }
};

export const getBestTime = async (difficulty: string) => {
    const key = `${BEST_TIME_KEY}_${difficulty}`;
    const time = await AsyncStorage.getItem(key);
    return time ? Number(time) : null;
};