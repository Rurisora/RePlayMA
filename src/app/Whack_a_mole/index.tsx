import { useEffect, useState } from "react";
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const GRID_SIZE = 9;

export default function Index(): JSX.Element {
  const [moleIndex, setMoleIndex] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const scaleAnim = useState(new Animated.Value(0))[0];
  const [hammer, setHammer] = useState<{
    x: number;
    y: number;
    index: number;
  } | null>(null);

  // Move mole randomly
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (moleIndex !== null) return; // wait until mole disappears

      const random = Math.floor(Math.random() * GRID_SIZE);
      setMoleIndex(random);

      // trigger pop animation
      scaleAnim.setValue(0);

      Animated.spring(scaleAnim, {
        toValue: 1.3,
        useNativeDriver: true,
        friction: 4,
      }).start();
    }, 800);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Timer countdown
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isPlaying]);

  // Game over
  useEffect(() => {
    if (timeLeft === 0) {
      setIsPlaying(false);
      setMoleIndex(null);
      alert(`Game Over! Your score: ${score}`);
    }
  }, [timeLeft, score]);

  const handlePress = (index: number, event: any): void => {
    if (!isPlaying) return;

    const { locationX, locationY } = event.nativeEvent;

    setHammer({ x: locationX, y: locationY, index });

    if (index === moleIndex) {
      // hit animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.6, // squish
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1.2, // bounce back
          useNativeDriver: true,
        }),
      ]).start(() => {
        // remove mole after animation
        setMoleIndex(null);
      });

      setScore((prev) => prev + 5);
    }

    // remove hammer after short time
    setTimeout(() => setHammer(null), 200);
  };

  /*const handlePress = (index: number): void => {
    
    if (!isPlaying) return;

    if (index === moleIndex) {
      setScore((prev) => prev + 5);
      setMoleIndex(null);
    }
  };*/

  const startGame = (): void => {
    setScore(0);
    setTimeLeft(60);
    setIsPlaying(true);
  };

  const quitGame = (): void => {
    setIsPlaying(false);
    setMoleIndex(null);
  };

  // Format time display
  const formatTime = (): string => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m}m ${s}s`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Whack a mole</Text>
      <Text style={styles.subtitle}>Enjoy your games</Text>

      <Text style={styles.info}>Difficulty: Normal</Text>
      <Text style={styles.info}>Time: {formatTime()}</Text>
      <Text style={styles.score}>Score: {score}</Text>

      {/* Grid */}
      <View style={styles.grid}>
        {Array.from({ length: GRID_SIZE }).map((_, index) => (
          <TouchableOpacity
            key={index}
            style={styles.hole}
            onPress={(e) => handlePress(index, e)}
          >
            {moleIndex === index && (
              <Animated.Text
                style={[
                  styles.mole,
                  {
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                🐭
              </Animated.Text>
            )}
            {hammer && hammer.index === index && (
              <Text
                style={[
                  styles.hammer,
                  {
                    position: "absolute",
                    left: hammer.x - 15,
                    top: hammer.y - 15,
                  },
                ]}
              >
                🔨
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.button} onPress={startGame}>
        <Text style={styles.buttonText}>New Game</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.quitButton]}
        onPress={quitGame}
      >
        <Text style={styles.buttonText}>Quit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    color: "#777",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginVertical: 2,
  },
  score: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
  grid: {
    width: 300,
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 20,
  },
  hole: {
    width: 90,
    height: 90,
    margin: 5,
    backgroundColor: "#4ed893",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  mole: {
    fontSize: 40,
  },
  button: {
    width: 200,
    padding: 12,
    backgroundColor: "#6c8cd5",
    borderRadius: 10,
    marginVertical: 5,
    alignItems: "center",
  },
  quitButton: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  hammer: {
    fontSize: 40,
    transform: [{ rotate: "90deg" }],
  },
});
