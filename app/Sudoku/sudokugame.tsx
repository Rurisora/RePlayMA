import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { loadGame, saveBestTime, saveGame } from '../../utils/sudokustorage';

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

function generatePuzzleFromSolution(solved: Board, difficulty: string): Cell[][] {
    const puzzle = solved.map(row => [...row]);

    let removeCount = 
    difficulty === 'easy' ? 25 :
    difficulty === 'medium' ? 35 : 45;

    while (removeCount > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (puzzle[row][col] !== 0) {
            puzzle[row][col] = 0;
            removeCount--;
        }
    }

    return puzzle.map(row => row.map(value => ({
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
    if (solution.length !== 9) return false;

    for (let r =0; r < 9; r++) {
        for(let c = 0; c < 9; c++) {
            const cellVal = grid[r][c].value;

            if(cellVal === '') return false;

            const val = Number(cellVal);

            if (val !== solution[r][c]) return false;
        }
    }
    return true;
}

export default function SudokuGame() {
    const {difficulty, continue: continueParam} = useLocalSearchParams();
    
    const [grid, setGrid] = useState<Cell[][]>(([]));
    const [solution, setSolution] = useState<Board>([]);
    const [isWon, setIsWon] = useState(false);
    const [started, setStarted] = useState(false);
    const latestGridRef = useRef<Cell[][]>([]);

    const [time, setTime] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const router = useRouter();
    const diff = Array.isArray(difficulty) ? difficulty[0] : difficulty;
    const isContinueGame = continueParam === 'true';

    const startNewGame = () => {
        const solvedBoard = generateSolvedBoard();
        const puzzle = generatePuzzleFromSolution(
            solvedBoard.map(row => [...row]),
            diff || 'easy'
        );

        setSolution(solvedBoard);
        setGrid(puzzle);
        setTime(0);
        setIsWon(false);
        setStarted(false);
    }

    useEffect(() => {
        const resume = async () => {
            if (isContinueGame) {
                const saved = await loadGame();

                if (saved) {
                    setGrid(saved.grid);
                    latestGridRef.current = saved.grid;
                    setSolution(saved.solution);
                    setTime(saved.time);
                    setStarted(true);
                    return;
                } else {
                    Alert.alert("No saved game found, starting new game.");
                }
            }
            startNewGame();
        };
        resume();
    }, []);

    useEffect(() => {
        latestGridRef.current = grid;
    }, [grid]);

    useEffect(() => {
        if (isWon && started) {
            saveGame({
                grid: latestGridRef.current,
                solution: solution.map(r => [...r]),
                time,
                difficulty: diff || 'easy',
            })
    }}, [grid, time, started]);

    useEffect(() => {
        if (started && !isWon && !timerRef.current) {
            timerRef.current = setInterval(() => {
                setTime(t => t + 1);
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [started, isWon]);

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

            <View style={styles.grid}>
                {grid.map((row, i) => (
                    <View key={i} style={styles.row}>
                        {row.map((cell, j) => (
                            <TextInput
                                key={j}
                                style={[styles.cell,
                                    cell.fixed && styles.fixedCell,
                                    cell.isValid === false && styles.invalidCell,
                                    {
                                        borderTopWidth: i % 3 === 0 ? 2 : 1, 
                                        borderLeftWidth: j % 3 === 0 ? 2 : 1, 
                                        borderColor: 'black',
                                    }
                                ]
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
                                    latestGridRef.current = newGrid;

                                    if (!started && text !== '') {
                                        setStarted(true);
                                        setTime(0);
                                    }

                                    if (text !== '' && checkWin(newGrid, solution)) {
                                        setIsWon(true);
                                        setStarted(false);
                                        
                                        const finalTime = time;

                                        saveBestTime(finalTime, diff || 'easy');

                                        Alert.alert(
                                            "🎉 You Win!",
                                            `Time: ${formatTime(time)}`,
                                            [
                                                {
                                                    text: "New Game",
                                                    onPress: startNewGame
                                                },
                                                {
                                                    text: "Quit",
                                                    onPress: async () => {
                                                        await saveGame({
                                                            grid: latestGridRef.current,
                                                            solution: solution.map(r => [...r]),
                                                            time,
                                                            difficulty: diff || 'easy',
                                                        });
                                                        router.replace("/Sudoku");
                                                    },
                                                    style: "destructive"
                                                }
                                            ]
                                        );
                                        }
                                    }
  
                                }
                                
                             />
                        ))}
                    </View>
                ))}
            </View>
            <View style={styles.buttonContainer}>
                <View>
                    <Pressable style={styles.button} onPress={startNewGame}>
                        <Text style={styles.buttonText}>New Game</Text>
                    </Pressable>
                </View>

                <View>
                    <Pressable style={[styles.button, styles.quitButton]}
                        onPress={async () => {
                            await saveGame({
                                grid: latestGridRef.current,
                                solution: solution.map(r => [...r]),
                                time,
                                difficulty: diff || 'easy',
                            });
                            router.replace("/Sudoku");
                        }}
                    >
                        <Text style={styles.buttonText}> Quit</Text>
                    </Pressable>
                </View>
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
        borderWidth: 0.5,
        borderColor: 'black',
        textAlign: 'center',
        textAlignVertical: 'center',
        lineHeight: 12,
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
    buttonContainer: {

    },
    button: {
        width: 200,
        padding: 12,
        backgroundColor: "#6c8cd5",
        borderRadius: 10,
        marginVertical: 5,
        alignItems: "center",        
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    quitButton: {
        backgroundColor: "#6c8cd5",
    },
});