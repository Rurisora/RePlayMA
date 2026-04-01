import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type Cell = {
    value: string;
    fixed: boolean;
    isValid?: boolean;
}

type Board = number[][];

// Soduku Starter Logic and Generator
function isValidPlacement(
    grid: Board,
    row: number,
    col: number,
    value: number
) {
    for (let i = 0; i < 9; i++) {
        if (grid[row][i] === value) return false;
        if (grid[i][col] === value) return false;
    }

    const startRow = Math.floor(row / 3 ) * 3;
    const startCol = Math.floor(col / 3 ) * 3;

    for (let r = 0; r < 3; r++) {
        for (let c = 0 ; c < 3; c++) {
            if (grid[startRow + r][startCol + c] === value) return false;
        }
    }
    return true;
}

function suffle(arr: number[]) {
    for (let i = arr.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr
}

function solveSudoku(grid: Board) : boolean {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                const numbers = suffle([1,2,3,4,5,6,7,8,9]);

                for (const num of numbers) {
                    if (isValidPlacement(grid, row, col, num)) {
                        grid[row][col] = num;

                        if (solveSudoku(grid)) return true;

                        grid[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function generateSolvedBoard(): Board {
    const grid: Board = Array.from({ length: 9 }, () => Array(9).fill(0));
    solveSudoku(grid);
    return grid;
}

function generatePuzzle(difficulty: string): Cell[][] {
    const solved = generateSolvedBoard();

    let removeCount = 
    difficulty === 'easy' ? 25 :
    difficulty === 'medium' ? 35 : 45;

    while (removeCount > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (solved[row][col] !== 0) {
            solved[row][col] = 0;
            removeCount--;
        }
    }

    return solved.map(row => row.map(value => ({
        value: value === 0 ? '' : String(value),
        fixed: value !== 0,
        isValid: true
    })))
}

// Validation (player Input)

function isValidInput(grid: Cell[][], row: number, col: number, value: string) {
    if (!value) return true;

    for (let c = 0; c < 9; c++) {
        if (c !== col && grid[row][c].value === value) return false;
    }

    for (let r = 0; r < 9; r++) {
        if (r !== row && grid[r][col].value === value) return false;
    }

    const startRow = Math.floor(row / 3 ) * 3;
    const startCol = Math.floor(col / 3 ) * 3;

    for (let r = 0; r < 3; r++) {
        for (let c = 0 ; c < 3; c++) {
            const rr = startRow + r;
            const cc = startCol + c;
            if ((rr !== row || cc !== col) && grid[rr][cc].value === value) {
                return false;
            }
        }
    }
    return true;
}
      
function checkWin(grid: Cell[][], solution: Board) {
    for (let r =0; r < 9; r++) {
        for(let c = 0; c< 9; c++) {
            const val = Number(grid[r][c].value);
            if (val !== solution[r][c]) return false;
        }
    }
    return true;
}

export default function SudokuGame() {
    const {difficulty} = useLocalSearchParams();
    
    const [grid, setGrid] = useState<Cell[][]>(([]));
    const [solution, setSolution] = useState<Board>([]);
    const [isWon, setIsWon] = useState(false);
    const [started, setStarted] = useState(false);

    const [time, setTime] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const diff = Array.isArray(difficulty) ? difficulty[0] : difficulty;


    useEffect(() => {
        const solved = generateSolvedBoard();
        const puzzle = generatePuzzle((difficulty as string) );

        setSolution(solved);
        setGrid(puzzle);
        setTime(0);
        setIsWon(false);
    }, []);

    useEffect(() => {
        if (started && !isWon) {
            const interval = setInterval(() => {
                setTime(t => t + 1 );
            }, 1000)

        return () => clearInterval(interval);
        }
    }, [started, isWon])

    const formatTime =(t: number) => {
        const m = Math.floor(t/60);
        const s= t%60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sudoku Game</Text>

            <Text>Difficulty: {diff}</Text>
            <Text>Time: {formatTime(time)}</Text>

            {isWon && (
                <View style={styles.winOverlay}>
                    <Text style={styles.winSubText}>Congratulation, You Win!</Text>
                    <Text style={styles.winSubText}>Time: {formatTime(time)}</Text>
                </View>
            )}

            <View style={styles.grid}>
                {grid.map((row, i) => (
                    <View key={i} style={styles.row}>
                        {row.map((cell, j) => (
                            <TextInput
                                key={j}
                                style={[styles.cell,
                                    cell.fixed && styles.fixedCell,
                                    cell.isValid === false && styles.invalidCell]
                                }
                                value={cell.value}
                                editable={!cell.fixed && !isWon}
                                keyboardType="number-pad"
                                maxLength={1}
                                onChangeText={(text) => {
                                    if (isWon) return;
                                    if (cell.fixed) return;
                                    
                                    if (!(text === '' || /^[1-9]$/.test(text))) return;

                                    const newGrid = grid.map(r => [...r]);
                                                                               
                                    newGrid[i][j] = {
                                        ...newGrid[i][j],
                                        value: text,
                                    };

                                    const valid = isValidInput(newGrid, i, j, text);
                                    newGrid[i][j].isValid = valid || text === '';

                                    setGrid(newGrid);

                                    if (checkWin(newGrid, solution)) {
                                        setIsWon(true);
                                        setStarted(false);
                                    }

                                    if (!started) {
                                        setStarted(true);
                                        setTime(0);
                                    }

                                    }
                                }
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
        lineHeight: 15,
    },
    fixedCell: {
        backgroundColor: '#ddd',
        fontWeight: 'bold',
    },
    invalidCell: {
        backgroundColor: '#fdd',
    },
    winOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    winSubText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'green',
    },
});