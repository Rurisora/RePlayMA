import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';

export default function SudokuGame() {
    const router = useRouter();

    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Text>Sudoku Game Screen</Text>
            <Button title="New Game" onPress={() => router.push({ pathname: "/Sudoku/sudokugame",
                                                                  params: {difficulty}
             })}/>
            <Button title="Continue" onPress={() => router.push("/Sudoku/sudokugame?continue=true")}/>
            <View style={styles.boxContainer}>
                <Text>Select Difficulty:</Text>
                {['easy', 'medium', 'hard'].map(level => (
                    <Pressable
                        key={level}
                        onPress={() => setDifficulty(level as any)}
                        style={[
                            styles.box,
                            difficulty === level && styles.boxActive
                        ]}
                    >
                        <Text
                            style={[
                                styles.boxText,
                                difficulty === level && styles.boxTextActive
                            ]}
                        >
                            {level.toUpperCase()}
                        </Text>
                    </Pressable>
                ))}
            </View>
            <Button title="Back To Home" onPress={() => router.push("/")}/>
        </View> 
    )
}
const styles = StyleSheet.create({
    boxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginVertical: 20,
    },

    box: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: '#fff',
        minWidth: 80,
    },

    boxActive: {
        backgroundColor: '#333',
        borderColor: '#333',
    },

    boxText: {
        color: '#333',
        fontWeight: '500',
        fontSize: 12,
    },

    boxTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
