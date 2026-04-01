import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type Cell = {
    value: string;
    fixed: boolean;
}
function createEmptyGrid() {
    return Array(9).fill(null).map(() => 
        Array(9).fill(null).map(() => ({ 
            value: '', 
            fixed: false
        }))
    );
}

function generateGame(difficulty: string) {
    const grid = createEmptyGrid();

    const filled = 
        difficulty === 'easy' ? 40 : 
        difficulty === 'medium' ? 30 : 20;

    for (let i = 0; i < filled; i++) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        
        const value = String(Math.floor(Math.random() * 9) + 1);

        grid[row][col] = {
            value,
            fixed: true,
        }
    }

    return grid;
}

export default function SudokuGame() {
    const router = useRouter();
    const { difficulty, continue: isContinue } = useLocalSearchParams();

    const [grid, setGrid] = useState<Cell[][]>(createEmptyGrid());

    useEffect(() => {
        if (isContinue === "true") {
            setGrid(createEmptyGrid());
        } else {
            newGame();
        }
    }, []);

    const newGame = () => {
        const newGrid = generateGame((difficulty as string) || "easy");
        setGrid(newGrid);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sudoku Game</Text>

            <Text>Difficulty: {difficulty}</Text>
            <Text>Continue: {isContinue}</Text>

            <View style={styles.grid}>
                {grid.map((row, i) => (
                    <View key={i} style={styles.row}>
                        {row.map((cell, j) => (
                            <TextInput
                                key={j}
                                style={[styles.cell,
                                    cell.fixed && styles.fixedCell]
                                }
                                value={cell.value}
                                editable={!cell.fixed}
                                keyboardType="number-pad"
                                maxLength={1}
                                onChangeText={(text) => {
                                    if (cell.fixed) return;
                                    const newGrid = grid.map(r => [...r]);

                                    if (text === '' || /^[1-9]$/.test(text)) {                                  
                                        newGrid[i][j] = {
                                            ...newGrid[i][j],
                                            value: text,
                                        };
                                        setGrid(newGrid);
                                        }
                                }}
                             />
                        ))}
                    </View>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    grid: {
        borderWidth: 2,
        borderColor: 'black',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: 35,
        height: 35,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fixedCell: {
        backgroundColor: '#ddd',
        fontWeight: 'bold',
    },
});