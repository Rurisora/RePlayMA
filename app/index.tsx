import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function Home() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Text>Home Page</Text>

            <Button title="Sudoku" onPress={() => router.push("/Sudoku")}/>
            <Button title="Chess" onPress={() => router.push("/Chess")}/>
            <Button title="Checker" onPress={() => router.push("/Checker")}/>
            <Button title="Whack-a-Mole" onPress={() => router.push("/WhackAMole")}/>
        </View>
    )
}