import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function SudokuGame() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Text>Sudoku Game Screen</Text>

            <Button title="New Game" onPress={() => router.push("/Sudoku/sudokugame")}/>
            <Button title="Continue" onPress={() => router.push("/Sudoku/sudokugame?continue=true")}/>
            <Button title="Back To Home" onPress={() => router.back()}/>
        </View> 
    )
}