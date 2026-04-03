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

  // ADDED: control speed
  const SPAWN_SPEED = 800; // faster mole spawn
  const MOLE_DURATION = 700; // how long mole stays

  // CHANGED: Move mole faster + allow replacement
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const random = Math.floor(Math.random() * GRID_SIZE); // CHANGED (removed blocking condition)
      setMoleIndex(random);

      scaleAnim.setValue(0);

      Animated.spring(scaleAnim, {
        toValue: 1.3,
        useNativeDriver: true,
        friction: 4,
      }).start();
    }, SPAWN_SPEED); // CHANGED (was 800)

    return () => clearInterval(interval);
  }, [isPlaying]);

  // ADDED: auto-hide mole if not hit
  useEffect(() => {
    if (moleIndex === null) return;

    const timeout = setTimeout(() => {
      setMoleIndex(null);
    }, MOLE_DURATION);

    return () => clearTimeout(timeout);
  }, [moleIndex]);

  // CHANGED: safer timer
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0)); // CHANGED
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
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.6,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setMoleIndex(null);
      });

      setScore((prev) => prev + 5);
    }

    setTimeout(() => setHammer(null), 200);
  };

  // CHANGED: reset mole when starting
  const startGame = (): void => {
    setScore(0);
    setTimeLeft(60);
    setMoleIndex(null); // ADDED
    setIsPlaying(true);
  };

  const quitGame = (): void => {
    setIsPlaying(false);
    setMoleIndex(null);
  };

  const formatTime = (): string => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m}m ${s}s`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Whack a mole</Text>
      <Text style={styles.subtitle}>Enjoy your games</Text>

        {/* CHANGED */}
      <Text style={styles.info}>Difficulty: Normal</Text> 
      <Text style={styles.info}>Time: {formatTime()}</Text>
      <Text style={styles.score}>Score: {score}</Text>

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