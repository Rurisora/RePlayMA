import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { getBestTime } from '../../utils/sudokustorage';

export default function SudokuGame() {
    const router = useRouter();
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
    const [bestTime, setBestTime] = useState<{ easy: number | null, medium: number | null, hard: number | null }>({
        easy: null,
        medium: null,
        hard: null,
    });
    const [card, setCard] = useState<{ image: any, text: string} | null > (null)
    const displayGame = [
        {
            image: require('../../utils/sudokuImage/sudokuEasy.png'),
            text: "Easy: let practice some sudoku"
        },
        {
            image: require('../../utils/sudokuImage/sudokuMedium.png'),
            text: "Medium, lets play with some more challenge"
        },
        {
            image: require('../../utils/sudokuImage/sudokuHard.png'),
            text: "Hard, show us you are the master of Sudoku"
        }
    ]

    useFocusEffect(
        useCallback(() => {
            let active = true;
            const load = async () => {
                const easy = await getBestTime('easy');
                const medium = await getBestTime('medium');
                const hard = await getBestTime('hard');
                setBestTime({ easy, medium, hard });
            };
            load();

            return() => {
                active = false;
            }
        }, [])
    );

    useFocusEffect( 
        useCallback(() => {
            let active = true

            const pick = () => {
                const index = Math.floor(Math.random() * displayGame.length);
                const selected = displayGame[index]

                if(active) {
                    setCard(selected)
                }
            };
            pick();

            return () => {
                active = false;
            }
        }, [])
    );

    const formatTime = (totalSeconds : number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        if (minutes > 0) {
            return `${minutes}m${seconds.toString().padStart(2, '0')}s`;
        }
        return `${seconds}s`;
    }

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Text style={styles.title}>Welcome To Sudoku World</Text>
            <Text style={styles.title}>Choose your challenged difficulty and lets have fun</Text>
            {card && (
                <View style={{ alignItems: "center", marginVertical: 15 }}>
                    <Image
                        source={card.image}
                        style={{
                            width: 240,
                            height: 240,
                            marginBottom: 10,
                        }}
                        resizeMode="cover"
                    />

                    <Text style={{ fontSize: 14, fontWeight: "600", textAlign: "center" }}>
                        {card.text}
                    </Text>
                </View>
            )}            
            <Pressable onPress={() => router.push({ pathname: "/Sudoku/sudokugame",
                                                                  params: {difficulty}
             })
            } style={styles.button}
            >
                <Text style={styles.buttonText}>New Game</Text> 
            </Pressable>
            
            <Pressable onPress={() => router.push("/Sudoku/sudokugame?continue=true")}
                style={({pressed}) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                    styles.continueButton
                ]}>
                    <Text style={styles.buttonText}>Continue</Text>
                </Pressable>
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
            <View style={styles.bestTime}>
                <Text>Best Times:</Text>
                <Text style={styles.timebox}>EASY: {bestTime.easy !== null ? formatTime(bestTime.easy) : "-"}</Text>
                <Text style={styles.timebox}>MEDIUM: {bestTime.medium !== null ? formatTime(bestTime.medium) : "-"}</Text>
                <Text style={styles.timebox}>HARD: {bestTime.hard !== null ? formatTime(bestTime.hard) : "-"}</Text>
            </View>
            <Pressable onPress={() => router.push("/")} style={styles.button}>
                <Text style={styles.buttonText}>Back to Home</Text>    
            </Pressable>
        </View> 
    )
}
const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    boxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
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
        backgroundColor: '#6c8cd5',
        minWidth: 50,
    },

    boxActive: {
        backgroundColor: 'green',
        borderColor: '#333',
    },

    boxText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 12,
    },

    boxTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    bestTime: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        width: '90%',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#6c8cd5',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 5,
        alignItems: 'center',
        width: 200,
    },

    continueButton: {
        backgroundColor: '#6c8cd5',
    },

    buttonPressed: {
        opacity: 0.6,
        transform: [{ scale: 0.98 }],
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    timebox: {
        borderRadius: 5,
        borderWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 3,
        color: 'white',
        backgroundColor: '#6c8cd5',
        fontSize: 12,
    },
});
